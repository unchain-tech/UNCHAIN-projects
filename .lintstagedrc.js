const path = require('path');

const buildTextLintCommand = (filenames) => {
  // Filter out files that should be ignored
  const filtered = filenames.filter(f => {
    const relative = path.relative(process.cwd(), f);
    // Exclude translation-related English docs and English translations
    return !relative.includes('TRANSLATION_GUIDE.md') && 
           !relative.includes('TRANSLATION_STATUS.md') && 
           !relative.includes('i18n/en/');
  });
  
  if (filtered.length === 0) return 'echo "No files to lint"';
  
  return `textlint ${filtered
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;
};

module.exports = {
  "docs/**/*.md": [buildTextLintCommand]
}
