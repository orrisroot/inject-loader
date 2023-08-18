module.exports = {
  '*': ['prettier --list-different'],
  '*.{js,ts}': ['eslint --max-warnings=0'],
};
