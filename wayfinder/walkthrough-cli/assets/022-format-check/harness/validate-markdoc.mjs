import Markdoc from '@markdoc/markdoc';
import { readFileSync } from 'node:fs';
import { load as yamlLoad } from 'js-yaml';

const ICONS = ['list-unordered', 'git-compare', 'git-branch', 'database', 'beaker', 'shield-lock'];

const tags = {
  section: {
    render: 'Section',
    attributes: {
      id: { type: String, required: true, matches: /^[a-z0-9-]+$/ },
      navLabel: { type: String, required: true },
      icon: { type: String, required: true, matches: ICONS },
      group: { type: String, required: true },
      title: { type: String, required: true },
    },
  },
  callout: {
    render: 'Callout',
    attributes: { tone: { type: String, required: true, matches: ['key', 'warn'] } },
  },
  flow: {
    render: 'Flow',
    attributes: { steps: { type: Array, required: true } },
    validate(node) {
      const s = node.attributes.steps;
      if (Array.isArray(s) && s.length < 2)
        return [{ id: 'flow-steps-too-few', level: 'error', message: 'flow needs 2+ steps' }];
      return [];
    },
  },
  diff: {
    render: 'Diff',
    attributes: {
      file: { type: String, required: true },
      from: { type: Number, required: true },
      to: { type: Number, required: true },
      mark: { type: String },
    },
    validate(node) {
      const { from, to } = node.attributes;
      if (typeof from === 'number' && typeof to === 'number' && from > to)
        return [{ id: 'diff-range-invalid', level: 'error', message: `from (${from}) must be <= to (${to})` }];
      return [];
    },
  },
  fields: { render: 'Fields' },
  field: {
    render: 'Field',
    attributes: { name: { type: String, required: true }, type: { type: String, required: true } },
  },
  method: {
    render: 'Method',
    attributes: { sig: { type: String, required: true }, decorator: { type: String } },
  },
  tests: { render: 'Tests' },
  test: {
    render: 'Test',
    attributes: {
      name: { type: String, required: true },
      kind: { type: String, required: true, matches: ['unit', 'tour', 'http'] },
      asserts: { type: Array, required: true },
    },
  },
};

const file = process.argv[2];
const source = readFileSync(file, 'utf8');
const errors = [];

const ast = Markdoc.parse(source);

if (!ast.attributes.frontmatter) {
  errors.push({ id: 'frontmatter-missing', message: 'no frontmatter' });
} else {
  try {
    const fm = yamlLoad(ast.attributes.frontmatter);
    for (const key of ['title', 'pr', 'module'])
      if (fm?.[key] === undefined) errors.push({ id: 'frontmatter-key-missing', message: `frontmatter misses ${key}` });
  } catch (e) {
    errors.push({ id: 'frontmatter-yaml-invalid', message: e.message });
  }
}

for (const e of Markdoc.validate(ast, { tags })) {
  errors.push({
    id: e.error?.id,
    level: e.error?.level,
    message: e.error?.message,
    lines: e.lines,
  });
}

console.log(JSON.stringify({ file, crash: false, errors }, null, 2));
process.exit(errors.length ? 1 : 0);
