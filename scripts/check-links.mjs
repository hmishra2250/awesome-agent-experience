#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { render, replaceGenerated } from './build-readme-sources.mjs';

const ONLINE = process.argv.includes('--online');
const sourcePath = new URL('../data/sources.json', import.meta.url);
const required = ['title', 'url', 'sourceType', 'year', 'section', 'whyItMatters', 'limitations'];
const allowedTypes = new Set([
  'paper', 'specification', 'framework', 'dataset', 'repository', 'essay',
  'documentation', 'tool', 'benchmark', 'list',
]);
const requiredSections = [
  'Agent experience framing',
  'Discovery and agent-readable web',
  'Documentation for agents',
  'Tool use, tool descriptions and MCP',
  'Protocols and machine-readable surfaces',
  'Agent identity and authorization',
  'Agentic commerce and payments',
  'Human control, approval and recovery',
  'Security for agent-facing surfaces',
  'Evaluation',
  'Readiness instruments',
  'GEO and AI search (adjacent)',
  'Related lists',
];

async function validateCitationFile() {
  const citationUrl = new URL('../CITATION.cff', import.meta.url);
  const citationPath = new URL(citationUrl).pathname;
  const citationText = await readFile(citationUrl, 'utf8');
  const { spawnSync } = await import('node:child_process');

  const rubyAvailable = spawnSync('ruby', ['-e', "require 'yaml'"], { encoding: 'utf8' });
  if (!rubyAvailable.error && rubyAvailable.status === 0) {
    const ruby = spawnSync('ruby', ['-e', "require 'yaml'; YAML.load_file(ARGV[0])", citationPath], { encoding: 'utf8' });
    if (ruby.status === 0) return;
    fail(`CITATION.cff invalid YAML: ${ruby.stderr.trim() || 'Ruby YAML parser rejected the file'}`);
    return;
  }

  const pythonAvailable = spawnSync('python3', ['-c', 'import yaml'], { encoding: 'utf8' });
  if (!pythonAvailable.error && pythonAvailable.status === 0) {
    const python = spawnSync('python3', ['-c', 'import sys, yaml; yaml.safe_load(open(sys.argv[1]))', citationPath], { encoding: 'utf8' });
    if (python.status === 0) return;
    fail(`CITATION.cff invalid YAML: ${python.stderr.trim() || 'Python YAML parser rejected the file'}`);
    return;
  }

  // Last-resort static checks when no YAML parser is installed.
  for (const key of ['cff-version:', 'title:', 'type:', 'abstract:', 'authors:', 'url:', 'repository-code:', 'license:', 'date-released:']) {
    if (!citationText.includes(key)) fail(`CITATION.cff missing ${key}`);
  }
  const abstractLine = citationText.split('\n').find((line) => line.startsWith('abstract:')) ?? '';
  if (!/^abstract: ["'].*["']$/.test(abstractLine)) {
    fail('CITATION.cff abstract must be quoted when it contains a colon');
  }
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function assertHttpUrl(value, index) {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      fail(`source ${index}: url must be http(s): ${value}`);
    }
  } catch {
    fail(`source ${index}: invalid URL: ${value}`);
  }
}

async function fetchOk(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'awesome-agent-experience-link-check/1.0' }
    });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'awesome-agent-experience-link-check/1.0' }
      });
    }
    return { ok: response.ok, status: response.status };
  } finally {
    clearTimeout(timer);
  }
}

await validateCitationFile();
const sources = JSON.parse(await readFile(sourcePath, 'utf8'));
if (!Array.isArray(sources)) fail('data/sources.json must contain an array');
try {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  if (replaceGenerated(readme, render(sources)) !== readme) {
    fail('README generated sources drift; run node scripts/build-readme-sources.mjs');
  }
} catch (error) {
  fail(error.message);
}


const urls = new Set();
const sections = new Map();
for (const [index, source] of sources.entries()) {
  for (const field of required) {
    if (!(field in source) || source[field] === '') fail(`source ${index}: missing ${field}`);
  }
  assertHttpUrl(source.url, index);
  if (urls.has(source.url)) fail(`source ${index}: duplicate URL ${source.url}`);
  urls.add(source.url);
  // null records that the source states no publication year; never infer one.
  if (source.year !== null && (!Number.isInteger(source.year) || source.year < 1900 || source.year > 2100)) {
    fail(`source ${index}: year must be a reasonable integer or null`);
  }
  if ('subsection' in source && (typeof source.subsection !== 'string' || source.subsection.trim() === '')) {
    fail(`source ${index}: subsection must be a non-empty string when present`);
  }
  for (const field of ['whyItMatters', 'limitations']) {
    const text = String(source[field]);
    if (/[\u2013\u2014]/.test(text)) fail(`source ${index}: ${field} uses an en or em dash`);
    if (/\b\w+n['\u2019]t\b|\b(it|that|there|what)['\u2019]s\b/i.test(text)) fail(`source ${index}: ${field} uses a contraction`);
  }
  if (!allowedTypes.has(source.sourceType)) {
    fail(`source ${index}: sourceType must be one of ${[...allowedTypes].join(', ')}`);
  }
  if (String(source.whyItMatters).length < 80) fail(`source ${index}: whyItMatters is too short`);
  if (String(source.limitations).length < 60) fail(`source ${index}: limitations is too short`);
  sections.set(source.section, (sections.get(source.section) ?? 0) + 1);
}

if (sources.length < 1) fail('expected at least one source');
for (const name of requiredSections) {
  if (!sections.has(name)) fail(`missing section: ${name}`);
}
for (const name of sections.keys()) {
  if (!requiredSections.includes(name)) fail(`unexpected section: ${name}; add it to requiredSections or fix the typo`);
}
// Sections must be contiguous so the generated README order matches the reader path.
const sectionOrder = [...new Set(sources.map((source) => source.section))];
if (sectionOrder.join('|') !== requiredSections.join('|')) {
  fail(`sections must appear contiguously in reader-path order: ${requiredSections.join(' > ')}`);
}
for (let i = 1; i < sources.length; i += 1) {
  if (sources[i].section !== sources[i - 1].section && sources.slice(0, i - 1).some((source) => source.section === sources[i].section)) {
    fail(`source ${i}: section ${sources[i].section} is split across the dataset`);
  }
}

if (ONLINE && Array.isArray(sources)) {
  for (const source of sources) {
    try {
      const result = await fetchOk(source.url);
      if (!result.ok) fail(`${source.url} returned HTTP ${result.status}`);
      else console.log(`✓ ${source.url}`);
    } catch (error) {
      fail(`${source.url} failed: ${error.message}`);
    }
  }
}

if (!process.exitCode) {
  console.log(`✓ ${sources.length} sources passed ${ONLINE ? 'online' : 'offline'} checks`);
}
