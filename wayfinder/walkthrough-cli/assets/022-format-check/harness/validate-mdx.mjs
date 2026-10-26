import { compile } from '@mdx-js/mdx';
import { readFileSync } from 'node:fs';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import remarkFrontmatter from 'remark-frontmatter';
import { visit } from 'unist-util-visit';
import { load as yamlLoad } from 'js-yaml';

const ICONS = ['list-unordered', 'git-compare', 'git-branch', 'database', 'beaker', 'shield-lock'];

// Best-effort prop lint assembled from parts — the real-world MDX validation story.
const SPEC = {
  Section: { required: ['id', 'navLabel', 'icon', 'group', 'title'], optional: [], enums: { icon: ICONS } },
  Callout: { required: ['tone'], optional: [], enums: { tone: ['key', 'warn'] } },
  Flow: { required: ['steps'], optional: [], enums: {} },
  Diff: { required: ['file', 'from', 'to'], optional: ['mark'], enums: {} },
  Fields: { required: [], optional: [], enums: {} },
  Field: { required: ['name', 'type'], optional: [], enums: {} },
  Method: { required: ['sig'], optional: ['decorator'], enums: {} },
  Tests: { required: [], optional: [], enums: {} },
  Test: { required: ['name', 'kind', 'asserts'], optional: [], enums: { kind: ['unit', 'tour', 'http'] } },
};

const file = process.argv[2];
const source = readFileSync(file, 'utf8');
const errors = [];
let crash = false;

// 1. The compile step — the only validation MDX gives for free.
try {
  await compile(source, { remarkPlugins: [remarkFrontmatter] });
} catch (e) {
  crash = true;
  errors.push({ id: 'mdx-compile-crash', message: e.message, line: e.line ?? e.place?.line });
}

// 2. Custom prop lint on the mdast (only reachable when the parse half works).
try {
  const tree = remark().use(remarkFrontmatter).use(remarkMdx).parse(source);

  let fmSeen = false;
  visit(tree, 'yaml', (node) => {
    fmSeen = true;
    try {
      const fm = yamlLoad(node.value);
      for (const key of ['title', 'pr', 'module'])
        if (fm?.[key] === undefined) errors.push({ id: 'frontmatter-key-missing', message: `frontmatter misses ${key}` });
    } catch (e) {
      errors.push({ id: 'frontmatter-yaml-invalid', message: e.message });
    }
  });
  if (!fmSeen) errors.push({ id: 'frontmatter-missing', message: 'no frontmatter' });

  for (const type of ['mdxJsxFlowElement', 'mdxJsxTextElement'])
    visit(tree, type, (node) => {
      const line = node.position?.start?.line;
      const spec = SPEC[node.name];
      if (!spec) {
        errors.push({ id: 'component-unknown', message: `unknown component <${node.name}>`, line });
        return;
      }
      const seen = new Set();
      for (const attr of node.attributes ?? []) {
        if (attr.type !== 'mdxJsxAttribute') {
          errors.push({ id: 'prop-spread-unsupported', message: `spread props on <${node.name}>`, line });
          continue;
        }
        seen.add(attr.name);
        if (!spec.required.includes(attr.name) && !spec.optional.includes(attr.name))
          errors.push({ id: 'prop-unknown', message: `<${node.name}> has unknown prop ${attr.name}`, line });
        const allowed = spec.enums[attr.name];
        if (allowed && typeof attr.value === 'string' && !allowed.includes(attr.value))
          errors.push({ id: 'prop-enum-invalid', message: `<${node.name} ${attr.name}="${attr.value}"> not in [${allowed}]`, line });
        // Expression values ({...}) are estree — statically uncheckable in general.
      }
      for (const req of spec.required)
        if (!seen.has(req))
          errors.push({ id: 'prop-missing-required', message: `<${node.name}> misses required prop ${req}`, line });
    });
} catch (e) {
  if (!crash) {
    crash = true;
    errors.push({ id: 'mdx-parse-crash', message: e.message, line: e.line ?? e.place?.line });
  }
}

console.log(JSON.stringify({ file, crash, errors }, null, 2));
process.exit(errors.length ? 1 : 0);
