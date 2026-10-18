#!/usr/bin/env node
// No Em Dashes.md — fails the build if any visible string contains an
// em dash (U+2014) or en dash (U+2013): en.json / ar.json (every string
// value), index.html, and .tsx files' JSX text and aria-label/alt/title
// attributes. Code comments are not visible text and are not scanned.
import { readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import ts from 'typescript';

const FORBIDDEN = /[—–]/;
const DASH_NAME = { '—': 'an em dash (U+2014)', '–': 'an en dash (U+2013)' };
const VISIBLE_ATTRS = new Set(['aria-label', 'alt', 'title']);

const violations = [];

function lineColAt(text, index) {
  const before = text.slice(0, index);
  const line = before.split('\n').length;
  const col = index - before.lastIndexOf('\n');
  return { line, col };
}

function checkPlainTextFile(path) {
  const text = readFileSync(path, 'utf8');
  const re = new RegExp(FORBIDDEN, 'g');
  let match;
  while ((match = re.exec(text))) {
    const { line, col } = lineColAt(text, match.index);
    violations.push(`${path}:${line}:${col} contains ${DASH_NAME[match[0]]}`);
  }
}

function checkJsonFile(path) {
  const data = JSON.parse(readFileSync(path, 'utf8'));
  function walk(value, keyPath) {
    if (typeof value === 'string') {
      const match = FORBIDDEN.exec(value);
      if (match) violations.push(`${path}: "${keyPath}" contains ${DASH_NAME[match[0]]} ("${value}")`);
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${keyPath}[${i}]`));
    } else if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) walk(value[key], keyPath ? `${keyPath}.${key}` : key);
    }
  }
  walk(data, '');
}

function staticTemplateText(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    return node.head.text + node.templateSpans.map((span) => span.literal.text).join('');
  }
  return null;
}

function checkTsxFile(path) {
  const text = readFileSync(path, 'utf8');
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  function report(pos, what) {
    const { line, character } = source.getLineAndCharacterOfPosition(pos);
    violations.push(`${path}:${line + 1}:${character + 1} ${what}`);
  }

  function visit(node) {
    if (ts.isJsxText(node)) {
      const match = FORBIDDEN.exec(node.text);
      if (match) report(node.getStart(source), `JSX text contains ${DASH_NAME[match[0]]}`);
    }
    if (ts.isJsxAttribute(node) && VISIBLE_ATTRS.has(node.name.text) && node.initializer) {
      let valueNode = node.initializer;
      if (ts.isJsxExpression(valueNode) && valueNode.expression) valueNode = valueNode.expression;
      const value = staticTemplateText(valueNode);
      const match = value ? FORBIDDEN.exec(value) : null;
      if (match) report(node.getStart(source), `"${node.name.text}" attribute contains ${DASH_NAME[match[0]]}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

function walkDir(dir, exts, onFile) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, exts, onFile);
    else if (exts.includes(extname(entry.name))) onFile(full);
  }
}

checkPlainTextFile('index.html');
checkJsonFile('src/content/en.json');
checkJsonFile('src/content/ar.json');
walkDir('src', ['.tsx'], checkTsxFile);

if (violations.length > 0) {
  console.error(`No Em Dashes: found ${violations.length} forbidden dash(es):\n`);
  for (const v of violations) console.error('  ' + v);
  console.error('\nReplace with a colon, comma or full stop — not an en dash, double hyphen or spaced hyphen.');
  process.exit(1);
}

console.log('No Em Dashes: clean.');
