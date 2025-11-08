# Translation Guide for UNCHAIN Projects

This guide explains how to translate UNCHAIN learning content from Japanese to English.

## Overview

UNCHAIN projects use Docusaurus for documentation with built-in i18n (internationalization) support. English translations are stored in a separate directory structure that mirrors the original Japanese content.

## Directory Structure

### Japanese (Original)
```
docs/
  └── [Chain]/
      └── [Project-Name]/
          ├── index.md
          ├── section-1/
          │   ├── lesson-0.md
          │   ├── lesson-1.md
          │   └── ...
          └── section-2/
              └── ...
```

### English (Translation)
```
i18n/en/docusaurus-plugin-content-docs/current/
  └── [Chain]/
      └── [Project-Name]/
          ├── index.md
          ├── section-1/
          │   ├── lesson-0.md
          │   ├── lesson-1.md
          │   └── ...
          └── section-2/
              └── ...
```

## Translation Process

### 1. Choose a Project

See [issue #3526](https://github.com/unchain-tech/UNCHAIN-projects/issues/3526) for the list of projects needing translation. Comment on the issue to claim a project before starting.

### 2. Create Directory Structure

Create the corresponding directory structure in the English translation folder:

```bash
mkdir -p i18n/en/docusaurus-plugin-content-docs/current/[Chain]/[Project-Name]
```

### 3. Translate Files

For each markdown file:

#### Elements to Translate:
- ✅ Title in YAML frontmatter
- ✅ All Japanese text content
- ✅ Image alt text (in `![alt text](url)`)
- ✅ Link text (in `[link text](url)`)

#### Elements to Keep Unchanged:
- ❌ Code blocks (```)
- ❌ Image URLs
- ❌ Link URLs
- ❌ Emojis (👋, 🎉, etc.)
- ❌ File/folder names in paths

### 4. Translation Tips

#### Standard Sections

Many documents have standard sections that should be translated consistently:

**"プロジェクトをアップグレードする"** → **"Upgrading this Project"**

**"質問する"** → **"Asking Questions"**

#### Common Terms

| Japanese | English |
|----------|---------|
| スマートコントラクト | Smart Contract |
| ブロックチェーン | Blockchain |
| ウォレット | Wallet |
| デプロイ | Deploy |
| ミント | Mint |
| トークン | Token |
| ガス代 | Gas Fee |

#### Link Translations

For GitHub documentation links, change `ja` to `en` in URLs:
- `https://docs.github.com/ja/...` → `https://docs.github.com/en/...`

### 5. Quality Checks

Before submitting:

- [ ] All markdown files have corresponding English versions
- [ ] YAML frontmatter is properly formatted
- [ ] Code blocks are intact
- [ ] Images display correctly
- [ ] Links work properly
- [ ] Build succeeds: `yarn build`
- [ ] Content makes sense in English

## Using AI Translation Tools

While AI translation (ChatGPT, Claude, DeepL, etc.) can speed up the process, **always review and edit the output**:

1. **Preserve Markdown Structure**: Ensure code blocks, links, and images remain intact
2. **Natural English**: Fix awkward phrasings, make it sound natural
3. **Technical Accuracy**: Verify technical terms are correct
4. **Consistency**: Use the same terms throughout the project

### Example Prompt for AI Translation:

```
Translate the following Japanese markdown document to English.

Requirements:
- Keep all markdown formatting intact
- Do NOT translate code blocks (enclosed in ```)
- Do NOT translate image URLs
- Do NOT translate link URLs (but DO translate link text)
- Keep all emojis unchanged
- Translate the YAML frontmatter title
- Use natural English suitable for technical documentation

[Paste Japanese markdown here]
```

## Testing Translations

### Local Development

1. Install dependencies:
```bash
yarn install
```

2. Start development server:
```bash
yarn start
```

3. View English version:
```bash
yarn start --locale en
```

4. Build to check for errors:
```bash
yarn build
```

### Viewing Translations

Once deployed, English translations will be available at:
`https://buidl.unchain.tech/[Project-Name]/en/`

## Examples

Refer to these existing translations for examples:

- **Polygon-Whitelist-NFT**: [Japanese docs](https://buidl.unchain.tech/Polygon-Whitelist-NFT/) → [English](https://buidl.unchain.tech/Polygon-Whitelist-NFT/en/)
- **TheGraph-ScaffoldEth2**: [Japanese docs](https://buidl.unchain.tech/TheGraph-ScaffoldEth2/) → [English](https://buidl.unchain.tech/TheGraph-ScaffoldEth2/en/)
- **AVAX-AMM**: [Japanese docs](https://buidl.unchain.tech/AVAX-AMM/) → [English](https://buidl.unchain.tech/AVAX-AMM/en/)

## Submitting Your Translation

1. Create a new branch:
```bash
git checkout -b translate/[project-name]
```

2. Commit your changes:
```bash
git add i18n/en/docusaurus-plugin-content-docs/current/[Chain]/[Project-Name]
git commit -m "Add English translation for [Project-Name]"
```

3. Push to your fork:
```bash
git push origin translate/[project-name]
```

4. Create a Pull Request on GitHub

5. In the PR description:
   - Mention which project you translated
   - Reference issue #3526
   - Note if you used AI translation tools (for transparency)

## Getting Help

- **Discord**: Join the UNCHAIN Discord community
- **GitHub Issues**: Comment on [issue #3526](https://github.com/unchain-tech/UNCHAIN-projects/issues/3526)
- **Examples**: Review existing translations for guidance

## Project Status

Track translation progress on [issue #3526](https://github.com/unchain-tech/UNCHAIN-projects/issues/3526).

---

Thank you for contributing to make UNCHAIN learning content accessible to English speakers! 🌍✨
