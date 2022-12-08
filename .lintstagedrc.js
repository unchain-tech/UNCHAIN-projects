const path = require('path');

const buildTextLintCommand = (filenames) => `textlint ${filenames
  .map((f) => path.relative(process.cwd(), f))
  .join(' ')}`

module.exports = {
  "docs/**/*.md": [buildTextLintCommand]
}
