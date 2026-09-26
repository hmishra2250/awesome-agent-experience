import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { render, replaceGenerated, anchor, START, END } from '../scripts/build-readme-sources.mjs';

const sources = [{
  section: 'A <B>', title: 'a*[x]', url: 'https://example.test/a_(b)?q=two%20words',
  whyItMatters: 'Plain *text*\nnot a heading', limitations: '<script> and _emphasis_',
}];
const original = `# Manual framing\n${START}\nstale\n${END}\nManual disclosure\n`;

test('rendering is deterministic, preserves order and does not mutate source records', () => {
  const before = JSON.stringify(sources);
  assert.equal(render(sources), render(JSON.parse(before)));
  assert.equal(JSON.stringify(sources), before);
  const output = render([...sources, { ...sources[0], title: 'Second', section: 'Later' }]);
  assert.ok(output.indexOf('## A') < output.indexOf('## Later'));
});

test('plain-text headings, titles and annotations are escaped; URL parentheses remain intact', () => {
  const output = render(sources);
  assert.ok(output.includes('## A \\<B\\>'));
  assert.ok(output.includes('[a\\*\\[x\\]](<https://example.test/a_(b)?q=two%20words>)'));
  assert.ok(output.includes('Plain \\*text\\* not a heading'));
  assert.ok(output.includes('\\<script\\> and \\_emphasis\\_'));
});

test('renders a contents list with counts and GitHub-style anchors', () => {
  const output = render([
    { ...sources[0], section: 'Tool use, tool descriptions and MCP' },
    { ...sources[0], title: 'Two', section: 'GEO and AI search (adjacent)' },
  ]);
  assert.ok(output.startsWith('## Contents\n\n'));
  assert.ok(output.includes('- [Tool use, tool descriptions and MCP](#tool-use-tool-descriptions-and-mcp) (1)'));
  assert.ok(output.includes('(#geo-and-ai-search-adjacent) (1)'));
  assert.equal(anchor('Human control, approval and recovery'), 'human-control-approval-and-recovery');
});

test('renders subsections after unsectioned entries, in order of first appearance', () => {
  const base = { ...sources[0], section: 'Evaluation' };
  const output = render([
    { ...base, title: 'Bench', subsection: 'Benchmarks' },
    { ...base, title: 'Loose' },
    { ...base, title: 'Method', subsection: 'Methodology' },
    { ...base, title: 'Bench two', subsection: 'Benchmarks' },
  ]);
  const at = (text) => output.indexOf(text);
  assert.ok(at('[Loose]') < at('### Benchmarks'));
  assert.ok(at('### Benchmarks') < at('[Bench]'));
  assert.ok(at('[Bench two]') < at('### Methodology'));
  assert.equal(output.match(/### Benchmarks/g).length, 1);
});

test('tags entries with source type and year, omitting an unknown year', () => {
  const output = render([
    { ...sources[0], sourceType: 'paper', year: 2026 },
    { ...sources[0], title: 'Undated', sourceType: 'specification', year: null },
  ]);
  assert.ok(output.includes('>) (paper, 2026): Plain'));
  assert.ok(output.includes('[Undated](<https://example.test/a_(b)?q=two%20words>) (specification): '));
});

test('rejects unsafe URL schemes and malformed source shapes', () => {
  assert.throws(() => render([{ ...sources[0], url: 'javascript:alert(1)' }]), /HTTP/);
  assert.throws(() => render(null), /array/);
  assert.throws(() => render([{ ...sources[0], title: null }]), /string/);
});

test('preserves manual prefix and suffix exactly; repeated replacement is idempotent', () => {
  const body = render(sources);
  const next = replaceGenerated(original, body);
  assert.equal(next, `# Manual framing\n${START}\n${body}${END}\nManual disclosure\n`);
  assert.equal(replaceGenerated(next, body), next);
});

for (const [name, input] of [
  ['both missing', 'x'], ['end missing', START], ['start missing', END],
  ['reversed', `${END}${START}`], ['duplicate start', `${START}${START}${END}`],
  ['duplicate end', `${START}${END}${END}`],
]) {
  test(`rejects ${name} markers`, () => assert.throws(() => replaceGenerated(input, ''), /markers/));
}

test('CLI detects drift without writing, generates, then passes --check in a path with spaces', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'ax readme test '));
  try {
    await mkdir(path.join(dir, 'scripts'));
    await mkdir(path.join(dir, 'data'));
    const script = path.join(dir, 'scripts/build-readme-sources.mjs');
    await copyFile(new URL('../scripts/build-readme-sources.mjs', import.meta.url), script);
    await writeFile(path.join(dir, 'data/sources.json'), JSON.stringify(sources));
    await writeFile(path.join(dir, 'README.md'), original);
    const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', cwd: tmpdir() });
    assert.notEqual(run('--check').status, 0);
    assert.equal(await readFile(path.join(dir, 'README.md'), 'utf8'), original);
    assert.equal(run().status, 0);
    assert.equal(run('--check').status, 0);
    const generated = await readFile(path.join(dir, 'README.md'), 'utf8');
    assert.equal(run().status, 0);
    assert.equal(await readFile(path.join(dir, 'README.md'), 'utf8'), generated);
    assert.notEqual(run('--unknown').status, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
