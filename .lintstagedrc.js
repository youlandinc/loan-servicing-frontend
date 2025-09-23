const path = require('path');

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  // '*.{ts,tsx}': ['npx tsc --noEmit --pretty'],
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, 'npx prettier --write'],
  '*.{json,md,css,scss}': ['npx prettier --write'],
};
