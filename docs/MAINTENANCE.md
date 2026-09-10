# Maintaining a useful AX reference list

The public product is a selective annotated reading list, not a mirror of a scraped research archive. Keep `data/sources.json` as the source of truth. A generated README proves consistency, not relevance, safety, availability or endorsement.

## Every change

1. Check the canonical primary source and read the passages supporting the proposed annotation. Record the checked date and source version/status in the PR description; unknown dates remain unknown.
2. Explain the reader question, why existing entries do not cover it, and the source's specific limitation. Do not copy abstracts or imply measured benefits.
3. Edit JSON, then run:
   ```sh
   node scripts/build-readme-sources.mjs
   node --test test/readme-generator.test.mjs
   node scripts/build-readme-sources.mjs --check
   node scripts/check-links.mjs
   ```
4. Review the README diff. Only the marked source-list region is generated. Framing, scope, contribution and same-maintainer disclosure stay hand-edited.
5. Obtain a separate annotation review before merging. A reachable URL is not proof of source quality. Preserve the existing license; link to sources rather than reproducing their full text.

## Weekly — a small queue, not a quota

- Triage up to five suggestions; advance at most three that answer a specific AX question.
- Prefer corrections, canonical redirects and stronger sources over additions.
- Reject duplicates, paid placement, copied material, generic AI promotion and unrelated human-agent meanings.
- Run offline checks; do not edit generated entries directly in README.

## Monthly — freshness and curation

- Optionally run `node scripts/check-links.mjs --online`; investigate failures manually before removing a source. Temporary rate limits are not proof that a work disappeared.
- Recheck version-sensitive protocol/SDK sources. Pin the appropriate version; distinguish a draft, release, mutable main branch and vendor implementation.
- Confirm that each category still answers a reader's task; split a section only when its contents justify it.
- Review contribution instructions and common-maintainer disclosure. Keep commercial invitations outside individual resource annotations.

## Change-review record

Use this in a PR or local review note; it is not a claim that every legacy entry has been re-reviewed:

- Source title and canonical URL:
- Proposed category and reader question:
- Original publication date / revision / version / status (unknown if not verified):
- Checked on / checked by / passages reviewed:
- Why this source adds something distinct:
- Limitation and what it does not establish:
- Duplicate/stronger-source check:
- Original-language annotation and public-source/rights check:
- Test/check results:
- Reviewer decision: include / revise / defer / reject:

Expand only when a reviewed source answers a missing reader question. There is no source-count quota, and list size does not establish expertise or market leadership.

## Automated offline gate

`.github/workflows/validate.yml` runs generator tests, README drift detection and offline source checks on pull requests and pushes to `main`, using Node 24 and commit-pinned GitHub actions. It has read-only repository permissions, installs no project dependencies, and performs no online source crawl.
