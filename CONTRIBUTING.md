# Contributing

Contributions should make this library more accurate, useful, and defensible.

## Add a source when

- it is a primary paper, specification, standard, framework, dataset, benchmark, or maintained public repository;
- it directly helps practitioners design, evaluate, operate, or recover agent-facing software workflows;
- the URL is public and stable enough to cite;
- the linked work's status is clear: peer-reviewed paper, preprint, official spec, official framework, dataset, or repository;
- your annotation is original and concise.

## Do not add

- sponsored placements or affiliate links;
- generic vendor pages without technical substance;
- private traces, customer artifacts, employer data, or unpublished experiments;
- copied abstracts, copied PDFs, screenshots with unclear rights, or full-text reproductions;
- sources about unrelated meanings of "agent experience" such as call-center staffing or real-estate agents.

## Required metadata

Every new entry in `data/sources.json` needs:

- `title`
- `url`
- `sourceType`
- `year`
- `section`
- `whyItMatters`
- `limitations`

Prefer stable official URLs: arXiv, ACL Anthology, OpenReview, standards bodies, NIST, W3C, OpenAPI, JSON Schema, or the project's canonical repository/site.

## Review checklist

Before opening a pull request:

1. Regenerate with `node scripts/build-readme-sources.mjs`, then run `node --test test/*.test.mjs`, `node scripts/build-readme-sources.mjs --check`, and `node scripts/check-links.mjs`.
2. If online access is available, run `node scripts/check-links.mjs --online`.
3. Confirm the annotation is original and does not copy an abstract.
4. Confirm the source is relevant to software agent experience.
5. Confirm the contribution is not paid placement, link exchange, or SEO filler.

This project welcomes corrections and removals. A smaller accurate list is better than a large noisy one.

## Generated README protocol

Run `node scripts/build-readme-sources.mjs`, `node scripts/build-readme-sources.mjs --check`, and `node scripts/check-links.mjs`. Submit canonical public URLs, an original rationale and limitation, and verified source/version facts; do not infer dates or status.

The offline checks also run in GitHub Actions on pull requests and pushes to `main`. Online URL checks remain an explicit maintainer task; CI does not crawl external sources. See [maintenance](docs/MAINTENANCE.md) for the review cadence.
