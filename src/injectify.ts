import type { NodePath } from '@babel/core';
import { types as t, transformFromAstSync, transformSync, traverse } from '@babel/core';
import type { LoaderContext } from 'webpack';

import type { InputSourceMap } from './types';
import wrapperTemplate from './wrapper_template';
import wrapperTemplateESM from './wrapper_template_esm';

const processRequireCall = (path: NodePath<t.CallExpression>) => {
  t.assertStringLiteral(path.node.arguments[0]);
  const dependencyString = path.node.arguments[0].value;
  path.replaceWith(
    t.expressionStatement(
      t.conditionalExpression(
        t.callExpression(
          t.memberExpression(t.identifier('__injections'), t.identifier('hasOwnProperty'), false),
          [t.stringLiteral(dependencyString)],
        ),
        t.memberExpression(t.identifier('__injections'), t.stringLiteral(dependencyString), true),
        path.node,
      ),
    ),
  );

  return dependencyString;
};

const processImport = (path: NodePath<t.ImportDeclaration>) => {
  const { node } = path;
  const dependencyString = node.source.value;

  const injectionStatements: t.VariableDeclaration[] = [];
  const aliasedSpecifiers = node.specifiers.map((specifier) => {
    const localIdentifier = specifier.local;
    // ex: __React
    const aliasIdentifier = t.identifier(`__${localIdentifier.name}`);

    // __injections['react']
    let injectionExpression = t.memberExpression(
      t.identifier('__injections'),
      t.stringLiteral(dependencyString),
      true,
    );
    if (t.isImportSpecifier(specifier)) {
      // __injections['react'].Component
      injectionExpression = t.memberExpression(injectionExpression, specifier.imported);
    }

    injectionStatements.push(
      t.variableDeclaration('var', [
        t.variableDeclarator(
          localIdentifier,
          t.conditionalExpression(
            t.callExpression(
              t.memberExpression(
                t.identifier('__injections'),
                t.identifier('hasOwnProperty'),
                false,
              ),
              [t.stringLiteral(dependencyString)],
            ),
            injectionExpression,
            aliasIdentifier,
          ),
        ),
      ]),
    );

    // eslint-disable-next-line no-param-reassign
    specifier.local = aliasIdentifier;
    return specifier;
  });

  const aliasedImport = t.importDeclaration(aliasedSpecifiers, node.source);

  path.replaceWithMultiple(injectionStatements);

  return {
    node: aliasedImport,
    dependencyString,
  };
};

const processDynamicImport = (path: NodePath<t.CallExpression>) => {
  t.assertStringLiteral(path.node.arguments[0]);
  const dependencyString = path.node.arguments[0].value;
  path.replaceWith(
    t.expressionStatement(
      t.conditionalExpression(
        t.callExpression(
          t.memberExpression(t.identifier('__injections'), t.identifier('hasOwnProperty'), false),
          [t.stringLiteral(dependencyString)],
        ),
        t.callExpression(
          t.memberExpression(t.identifier('Promise'), t.identifier('resolve'), false),
          [
            t.memberExpression(
              t.identifier('__injections'),
              t.stringLiteral(dependencyString),
              true,
            ),
          ],
        ),
        path.node,
      ),
    ),
  );

  return dependencyString;
};

// module.exports[exportIdentifier] = localIdentifier
const createExportAssignment = (
  exportIdentifier: t.PrivateName | t.Expression,
  localIdentifier: t.Expression,
) =>
  t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(
        t.memberExpression(t.identifier('module'), t.identifier('exports'), false),
        exportIdentifier,
        false,
      ),
      localIdentifier,
    ),
  );

const processDefaultExport = (path: NodePath<t.ExportDefaultDeclaration>) => {
  let exportAssignment: t.ExpressionStatement | null = null;
  const { declaration } = path.node;

  if (t.isFunctionDeclaration(declaration)) {
    exportAssignment = createExportAssignment(
      t.identifier('default'),
      t.functionExpression(
        declaration.id,
        declaration.params,
        declaration.body,
        declaration.generator,
        declaration.async,
      ),
    );
  } else if (t.isExpression(path.node.declaration)) {
    exportAssignment = createExportAssignment(t.identifier('default'), path.node.declaration);
  }

  if (exportAssignment != null) {
    path.replaceWith(exportAssignment);
  }
};

const processNamedExport = (path: NodePath<t.ExportNamedDeclaration>) => {
  let statements: t.Statement[] = [];

  const { declaration } = path.node;
  if (declaration) {
    statements.push(declaration);
    if (t.isVariableDeclaration(declaration)) {
      declaration.declarations.forEach((d) => {
        t.assertExpression(d.id);
        statements.push(
          createExportAssignment(d.id, d.init && t.isLiteral(d.init) ? d.init : d.id),
        );
      });
    } else if (
      (t.isClassDeclaration(declaration) || t.isFunctionDeclaration(declaration)) &&
      declaration.id != null
    ) {
      statements.push(createExportAssignment(declaration.id, declaration.id));
    }
  } else {
    statements = path.node.specifiers
      .filter((specifier): specifier is t.ExportSpecifier => t.isExportSpecifier(specifier))
      .map((specifier) => createExportAssignment(specifier.exported, specifier.local));
  }

  path.replaceWithMultiple(statements);
};

const injectify = (
  context: LoaderContext<object>,
  source: string,
  inputSourceMap?: InputSourceMap,
) => {
  const { ast } = transformSync(source, {
    ast: true,
    code: false,
    babelrc: false,
    compact: false,
    configFile: false,
    filename: context.resourcePath,
  })!;
  t.assertFile(ast);

  const dependencies: string[] = [];
  const imports: t.Statement[] = [];
  let usesESModules = false;

  traverse(ast, {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: 'require' })) {
        dependencies.push(processRequireCall(path));
        path.skip();
      } else if (t.isImport(path.node.callee)) {
        dependencies.push(processDynamicImport(path));
        path.skip();
      }
    },
    ImportDeclaration(path) {
      usesESModules = true;
      const { node, dependencyString } = processImport(path);
      imports.push(node);
      dependencies.push(dependencyString);
      path.skip();
    },
    ExportDefaultDeclaration(path) {
      usesESModules = true;
      processDefaultExport(path);
      path.skip();
    },
    ExportNamedDeclaration(path) {
      usesESModules = true;
      processNamedExport(path);
      path.skip();
    },
  });

  if (dependencies.length === 0) {
    context.emitWarning(
      new Error(
        "The module you are trying to inject into doesn't have any dependencies. " +
          'Are you sure you want to do this?',
      ),
    );
  }
  const template = usesESModules ? wrapperTemplateESM : wrapperTemplate;

  const wrapperModuleAst = t.file(
    t.program([
      ...imports,
      template({
        SOURCE: ast.program.body,
        SOURCE_PATH: t.stringLiteral(context.resourcePath),
        DEPENDENCIES: t.arrayExpression(dependencies.map((d) => t.stringLiteral(d))),
      }) as t.Statement,
    ]),
  );

  return transformFromAstSync(wrapperModuleAst, source, {
    sourceMaps: context.sourceMap,
    sourceFileName: context.resourcePath,
    inputSourceMap: inputSourceMap || undefined,
    babelrc: false,
    compact: false,
    configFile: false,
    filename: context.resourcePath,
  });
};

export default injectify;
