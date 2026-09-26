#!/usr/bin/env node
import { readFile, writeFile, realpath } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const START = '<!-- GENERATED:SOURCES:START -->';
export const END = '<!-- GENERATED:SOURCES:END -->';

/** Dataset prose is plain text, not executable HTML or nested Markdown. */
export function escapeMarkdown(value) {
  if (typeof value !== 'string') throw new TypeError('Source prose must be a string');
  return value.replace(/[\r\n]+/g, ' ').replace(/([\\`*_{}\[\]<>#|])/g, '\\$1');
}

function destination(value) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Source URL must use HTTP(S)');
  // Angle-delimited destinations permit parentheses without changing the source URL.
  return `<${url.href.replace(/</g, '%3C').replace(/>/g, '%3E')}>`;
}

/** GitHub-style heading anchor for a plain-text heading. */
export function anchor(heading) {
  return heading.toLowerCase().replace(/[^a-z0-9 -]/g, '').trim().replace(/ /g, '-');
}

function entry(source) {
  const meta = [source.sourceType, source.year].filter((value) => value !== undefined && value !== null && value !== '');
  const tag = meta.length ? ` (${escapeMarkdown(meta.join(', '))})` : '';
  return `- [${escapeMarkdown(source.title)}](${destination(source.url)})${tag}: ${escapeMarkdown(source.whyItMatters)} _Limit: ${escapeMarkdown(source.limitations)}_`;
}

function groupBy(items, key) {
  const groups = new Map();
  for (const item of items) {
    const name = item[key] ?? '';
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(item);
  }
  return groups;
}

/**
 * Sections and optional subsections render in order of first appearance in the dataset.
 * Entries without a subsection render before any subsection heading in their section.
 */
export function render(sources) {
  if (!Array.isArray(sources)) throw new TypeError('Expected a source array');
  const sections = [...groupBy(sources, 'section')];
  const contents = sections.map(([section, entries]) =>
    `- [${escapeMarkdown(section)}](#${anchor(section)}) (${entries.length})`,
  );
  const body = sections.map(([section, entries]) => {
    const parts = [`## ${escapeMarkdown(section)}`];
    const subsections = groupBy(entries, 'subsection');
    if (subsections.has('')) parts.push(subsections.get('').map(entry).join('\n'));
    for (const [subsection, items] of subsections) {
      if (subsection === '') continue;
      parts.push(`### ${escapeMarkdown(subsection)}`, items.map(entry).join('\n'));
    }
    return parts.join('\n\n');
  });
  return [`## Contents\n\n${contents.join('\n')}`, ...body].join('\n\n') + '\n';
}

export function replaceGenerated(readme, body) {
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start < 0 || end < start || readme.indexOf(START, start + 1) >= 0 || readme.indexOf(END, end + 1) >= 0) {
    throw new Error('README generated markers missing, duplicated, or reversed');
  }
  return readme.slice(0, start + START.length) + '\n' + body + readme.slice(end);
}

async function main(args) {
  if (args.some((arg) => arg !== '--check')) throw new Error('Usage: build-readme-sources.mjs [--check]');
  const path = new URL('../README.md', import.meta.url);
  const [readme, data] = await Promise.all([
    readFile(path, 'utf8'), readFile(new URL('../data/sources.json', import.meta.url), 'utf8'),
  ]);
  const next = replaceGenerated(readme, render(JSON.parse(data)));
  if (args.includes('--check')) {
    if (next !== readme) throw new Error('README generated sources drift; run node scripts/build-readme-sources.mjs');
    console.log('README source section matches data/sources.json.');
  } else {
    await writeFile(path, next);
    console.log('Updated README source section only.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(await realpath(process.argv[1])).href) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
