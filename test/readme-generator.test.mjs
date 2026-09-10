import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { render, replaceGenerated, START, END } from '../scripts/build-readme-sources.mjs';

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
