/**
 * Ensures each section-* folder under docs has _category_.json with a unique
 * Docusaurus i18n key (parent project key + section folder name), and syncs
 * those keys into i18n/en/docusaurus-plugin-content-docs/current.json.
 *
 * Run via: yarn sync-docs-sidebar-keys (also runs as yarn prebuild).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const docsDir = path.join(root, "docs");
const currentJsonPath = path.join(
  root,
  "i18n/en/docusaurus-plugin-content-docs/current.json",
);
const sidebarId = "tutorialSidebar";
const categoryPrefix = `sidebar.${sidebarId}.category.`;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  fs.writeFileSync(filePath, text, "utf8");
}

/** @param {string} dir */
function collectSectionDirs(dir) {
  /** @type {string[]} */
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const full = path.join(dir, ent.name);
    if (/^section-/.test(ent.name)) out.push(full);
    out.push(...collectSectionDirs(full));
  }
  return out;
}

function syncSectionCategoryFiles() {
  const sectionDirs = collectSectionDirs(docsDir).sort();
  for (const sectionDir of sectionDirs) {
    const projectDir = path.dirname(sectionDir);
    const projectCategoryPath = path.join(projectDir, "_category_.json");
    if (!fs.existsSync(projectCategoryPath)) {
      throw new Error(
        `Section ${path.relative(root, sectionDir)} has no parent _category_.json at ${path.relative(root, projectCategoryPath)}`,
      );
    }
    const { key: projectKey } = readJson(projectCategoryPath);
    const sectionName = path.basename(sectionDir);
    const key = `${projectKey}-${sectionName}`;
    const payload = { label: sectionName, key };
    const sectionCategoryPath = path.join(sectionDir, "_category_.json");
    const line = `${JSON.stringify(payload, null, 2)}\n`;
    const prev = fs.existsSync(sectionCategoryPath)
      ? fs.readFileSync(sectionCategoryPath, "utf8")
      : null;
    if (prev !== line) fs.writeFileSync(sectionCategoryPath, line, "utf8");
  }
}

function syncEnCurrentJson() {
  const current = readJson(currentJsonPath);
  const next = { ...current };

  const legacySectionKey = new RegExp(
    `^sidebar\\.${sidebarId}\\.category\\.section-\\d+$`,
  );
  for (const k of Object.keys(next)) {
    if (legacySectionKey.test(k)) delete next[k];
  }

  /** @type {string[]} */
  const sectionCategoryFiles = [];
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!ent.isDirectory()) continue;
      const full = path.join(dir, ent.name);
      if (/^section-/.test(ent.name)) {
        const f = path.join(full, "_category_.json");
        if (fs.existsSync(f)) sectionCategoryFiles.push(f);
      }
      walk(full);
    }
  }
  walk(docsDir);
  sectionCategoryFiles.sort();

  for (const file of sectionCategoryFiles) {
    const { label, key } = readJson(file);
    const msgKey = `${categoryPrefix}${key}`;
    next[msgKey] = {
      message: label,
      description: `The label for category '${label}' in sidebar ${sidebarId}`,
    };
  }

  const sortedKeys = Object.keys(next).sort((a, b) => {
    if (a === "version.label") return -1;
    if (b === "version.label") return 1;
    return a.localeCompare(b);
  });
  /** @type {Record<string, unknown>} */
  const ordered = {};
  for (const k of sortedKeys) ordered[k] = next[k];
  writeJson(currentJsonPath, ordered);
}

syncSectionCategoryFiles();
syncEnCurrentJson();
