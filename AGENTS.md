# Cadence97 agent instructions

These instructions apply throughout this repository, including all packages,
applications, and delegated agent work. Read them before making changes.

## New tests and automated checks require explicit approval

The owner prioritizes meaningful product work over accumulating tests and the
recurring time spent running and maintaining them. **Do not add or expand any
test or automated validation without first presenting a justification and
receiving the owner's explicit approval for that proposal.**

This gate includes:

- Unit, integration, end-to-end, regression, smoke, snapshot, visual,
  accessibility, performance, and property-based tests.
- New test cases, assertions, scenarios, or coverage in existing test files.
- Test fixtures, snapshots, mocks, helpers, harnesses, and test dependencies
  introduced to support new or expanded testing.
- New lint rules, lint tests, validation scripts, quality gates, CI checks,
  pre-commit checks, and additional automatic test or check invocations.
- Temporary or one-off automated test scripts, even if they will not be committed.

Calling something a safeguard, verification script, or acceptance check does not
exempt it. A feature request, bug fix, refactor, request to be thorough, general
permission to work autonomously, or permission to commit does not authorize new
tests. Generic advice in skills, templates, or inherited upstream documentation
to add tests does not supply the required approval either.

### Make the case before writing the test

If a new test or check would be worthwhile, present a concise, concrete proposal
that explains:

1. **The risk:** the specific behavior or failure it would catch and why that
   matters for the requested work.
2. **The gap:** why existing coverage, a focused existing check, code inspection,
   or a manual check is insufficient.
3. **The scope:** exactly which tests, files, dependencies, or configuration would
   be added or expanded, and how the check would run.
4. **The cost:** expected setup, execution, and ongoing maintenance costs,
   including whether it runs on every commit or in CI. Label estimates and
   unknowns honestly; do not invent timings.
5. **The tradeoff:** the simplest cheaper alternative and why the proposed test
   is worth the additional cost.

Then ask for approval and **wait for an explicit affirmative response before
creating or expanding the proposed tests or checks**. Silence is not approval.
Approval applies only to the accepted scope; do not use it as permission to add
unrelated tests or testing infrastructure. If the owner requests a test directly,
still present the justification unless that exact proposal has already been
justified and approved in the conversation.

Continue authorized implementation work that does not depend on the proposal
while waiting. Do not make unapproved test work a prerequisite for delivering a
feature. If approval is declined or absent, leave the new tests out and accurately
report what was and was not verified.

## Keep verification proportional

- Existing checks may be run without a new test-creation approval. Choose the
  smallest relevant checks and honor existing required hooks and checks.
- Do not automatically run the entire repository's test, lint, or typecheck
  suites for every edit. Broaden verification only when the change, a failure,
  or an explicit requirement warrants it.
- Once relevant checks pass, do not repeat them without a material change or a
  concrete unresolved concern.
- For documentation-only or low-impact presentation changes, prefer inspection,
  focused formatting checks, or manual verification as appropriate.
- Do not delete tests, weaken assertions, disable checks, or bypass hooks to save
  time or obtain a passing result unless the owner explicitly requests it.
- Report checks actually performed and any limitations. Never imply that unrun
  tests passed.
