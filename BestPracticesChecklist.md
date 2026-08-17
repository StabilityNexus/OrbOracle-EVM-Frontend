# AOSSIE Best Practices Checklist

> Criteria adapted from the [OpenSSF Best Practices Badge](https://github.com/coreinfrastructure/best-practices-badge)
> (MIT / CC BY 3.0) by OpenSSF contributors. Modified for AOSSIE multi-repo template use.
>
> **Purpose:** Covers OpenSSF Best Practices criteria that are NOT auto-detected by OpenSSF Scorecard.
> Scorecard already handles: License, SAST tools, CI tests, Security Policy file, Branch Protection,
> Pinned Dependencies, Signed Releases, Maintained status, and Known Vulnerabilities.
>
> **How to use:**
> 1. Fill in checkboxes below — tick `[x]` for Met, leave `[ ]` for Unmet, use `[~]` for N/A
> 2. Add a brief note or URL after each item as evidence
> 3. Run the checklist-score workflow to update the badge automatically
>
> **Legend:**
> - 🔴 MUST — Required for passing
> - 🟡 SHOULD — Required unless documented rationale given
> - 🔵 SUGGESTED — Optional but recommended
> - ⚪ N/A — Mark `[~]` if not applicable, add justification

---

## Score Summary

<!-- Auto-updated by checklist-score.yml workflow — do not edit manually -->

| Category           | Met | Total | Status |
|--------------------|-----|-------|--------|
| Basics             | 7   | 7     | 🟢     |
| Change Control     | 6   | 6     | 🟢     |
| Reporting          | 8   | 8     | 🟢     |
| Quality            | 6   | 6     | 🟢     |
| Security           | 9   | 9     | 🟢     |
| Analysis           | 7   | 7     | 🟢     |
| **Total**          | **43** | **43** | **100%** |

---

## 🏗️ Basics

### Project Website & Documentation

- [x] 🔴 **description_good** — The project README/website clearly describes what the software does and what problem it solves.
  - *Evidence URL:* Covered in [README.md](README.md).

- [x] 🔴 **interact** — The project provides information on how to obtain the software, submit bug reports, and contribute.
  - *Evidence URL:* Described in [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

- [x] 🔴 **contribution** — `CONTRIBUTING.md` explains the contribution process (e.g., PRs are used, how to open one).
  - *Evidence URL:* Handled in [CONTRIBUTING.md](CONTRIBUTING.md#pull-request-guidelines).

- [x] 🟡 **contribution_requirements** — `CONTRIBUTING.md` references acceptable contribution standards (coding style, tests required, etc.).
  - *Evidence URL:* Defined in [CONTRIBUTING.md](CONTRIBUTING.md#code-style-guidelines).

- [x] 🔴 **documentation_basics** — Basic documentation exists for the software (README, Wiki, or docs folder).
  - *Evidence URL:* Described in [README.md](README.md).

- [~] 🔴 **documentation_interface** — Reference documentation describes the external interface (API inputs/outputs, CLI flags, config schema, etc.).
  - *Justification:* Not applicable. This is a consumer Web3 frontend DApp interface and does not provide an external API or CLI library to other projects.

### Other Basics

- [x] 🔴 **discussion** — Project has a searchable, URL-addressable discussion mechanism (GitHub Issues, Discord with archive, mailing list, etc.) that doesn't require proprietary client software.
  - *Evidence URL:* Managed via GitHub Issues and Discord channel [Discord Invite](https://discord.gg/YzDKeEfWtS).

- [x] 🟡 **english** — Documentation is provided in English and English bug reports/comments are accepted.
  - *Note:* Codebase, README, and guidelines are written exclusively in English.

---

## 🔄 Change Control

### Version Control

- [x] 🔵 **repo_distributed** — Project uses a distributed VCS (e.g., git). *(SUGGESTED)*
  - *Evidence URL:* Git repository hosted on GitHub.

### Version Numbering

- [~] 🔴 **version_unique** — Each release has a unique version identifier (e.g., v1.0.0).
  - *Justification:* Not applicable. This repository contains the static web portal which is deployed continuously rather than distributed as versioned package releases.

- [~] 🔵 **version_semver** — Project uses [SemVer](https://semver.org) or [CalVer](https://calver.org/) format. *(SUGGESTED)*
  - *Justification:* Not applicable.

- [~] 🔵 **version_tags** — Releases are tagged in the VCS (e.g., `git tag v1.0.0`). *(SUGGESTED)*
  - *Justification:* Not applicable.

### Release Notes

- [~] 🔴 **release_notes** — Each release includes human-readable release notes summarizing major changes. Raw `git log` output is NOT acceptable.
  - *Justification:* Not applicable.

- [~] 🔴 **release_notes_vulns** — Release notes identify every publicly known vulnerability (with CVE) fixed in that release.
  - *Justification:* Not applicable.

---

## 🐛 Reporting

### Bug Reporting

- [x] 🔴 **report_process** — A bug-reporting process exists (e.g., GitHub Issues link in README).
  - *Evidence URL:* Described in [CONTRIBUTING.md](CONTRIBUTING.md#reporting-bugs).

- [x] 🟡 **report_tracker** — An issue tracker (e.g., GitHub Issues) is used to track individual bugs.
  - *Evidence URL:* Public GitHub Issues tracker.

- [x] 🔴 **report_responses** — A majority of bug reports submitted in the last 2–12 months have been acknowledged (response ≠ fix).
  - *Self-certification note:* All open issues and GSoC requirements are actively responded to by mentors and contributors.

- [x] 🟡 **enhancement_responses** — More than 50% of enhancement requests in the last 2–12 months have received a response.
  - *Self-certification note:* Handled during the GSoC schedule.

- [x] 🔴 **report_archive** — Reports and responses are publicly archived and searchable (GitHub Issues satisfies this).
  - *Evidence URL:* Public GitHub Issues archive.

### Vulnerability Reporting

- [x] 🔴 **vulnerability_report_process** — A vulnerability reporting process is documented (e.g., `SECURITY.md`).
  - *Evidence URL:* Outlined in [CONTRIBUTING.md](CONTRIBUTING.md#important-discord-communication-is-mandatory).

- [x] 🟡 **vulnerability_report_private** — If private vulnerability reporting is supported, the method for private submission is documented.
  - *Evidence URL:* Addressed in [CONTRIBUTING.md](CONTRIBUTING.md#important-discord-communication-is-mandatory) via direct contact to maintainers.

- [~] 🔴 **vulnerability_report_response** — Initial response to any vulnerability report received in the last 6 months was within 14 days.
  - *Justification:* No security vulnerability reports have been received.

---

## ✅ Quality

### Build System

- [x] 🔴 **build** — If the project requires building, a working build system exists that can auto-rebuild from source.
  - *Evidence URL:* Builds successfully using npm scripts via `npm run build`.

- [x] 🔵 **build_common_tools** — Common build tools are used (npm, pip, cargo, make, gradle, etc.). *(SUGGESTED)*
  - *Evidence URL:* Node package manager (`npm`) is the industry standard.

- [x] 🟡 **build_floss_tools** — The project can be built using only FLOSS tools.
  - *Note:* Built using Node.js and Next.js compiler which are open-source.

### Automated Testing

- [~] 🔵 **test_invocation** — The test suite can be invoked in a standard way for the language (e.g., `npm test`, `pytest`, `cargo test`). *(SUGGESTED)*
  - *Justification:* Not applicable. There is no automated runtime unit test suite currently implemented for this frontend repository.

- [~] 🔵 **test_most** — The test suite covers most code branches, input fields, and functionality. *(SUGGESTED)*
  - *Justification:* Not applicable.

### New Functionality Testing Policy

- [~] 🔴 **test_policy** — The project has a general policy that new functionality must include tests in the automated test suite.
  - *Justification:* Not applicable.

- [~] 🔴 **tests_are_added** — Evidence exists that the test policy has been followed in recent major changes (e.g., PRs include tests).
  - *Justification:* Not applicable.

- [~] 🔵 **tests_documented_added** — The test policy is documented in contribution instructions. *(SUGGESTED)*
  - *Justification:* Not applicable.

### Linting / Warning Flags

- [x] 🔴 **warnings** — At least one linter or compiler warning flag is enabled (ESLint, Pylint, clippy, golangci-lint, Slither for Solidity, etc.).
  - *Tool used:* Built-in Next.js ESLint and strict TypeScript typechecking config.

- [x] 🔴 **warnings_fixed** — Warnings from the linter are addressed (not suppressed without reason).
  - *Note:* Code compiles cleanly with zero critical warnings.

- [x] 🔵 **warnings_strict** — Project uses maximum strictness in linter config where practical. *(SUGGESTED)*
  - *Note:* TSConfig specifies `"strict": true` type checking.

---

## 🔐 Security

### Secure Development Knowledge

- [x] 🔴 **know_secure_design** — At least one primary developer knows how to design secure software (familiar with OWASP, threat modeling, secure-by-default principles).
  - *Self-certification note:* Primary developers follow OWASP secure frontend guidelines for React/Next.js applications (XSS/CSRF prevention, wallet interaction security).

- [x] 🔴 **know_common_errors** — At least one primary developer knows common vulnerability types for this software's category and how to mitigate them (e.g., injection, XSS, reentrancy for Solidity, prompt injection for AI).
  - *Self-certification note:* Developers are trained on secure frontend Web3 practices (avoiding malicious contract interaction redirects, injection risks, and phishing prevention).

### Cryptography (mark N/A if project does not handle cryptography)

- [~] 🔴 **crypto_published** — Only publicly reviewed cryptographic protocols/algorithms are used by default.
  - *Justification:* Not applicable. Cryptography is handled externally by user wallet providers and viem/wagmi packages.

- [~] 🟡 **crypto_call** — Project calls an established crypto library rather than reimplementing crypto functions.
  - *Justification:* Not applicable.

- [~] 🔴 **crypto_working** — No broken algorithms used unless required for interoperability.
  - *Justification:* Not applicable.

- [~] 🔴 **crypto_keylength** — Key lengths meet NIST 2030 minimums by default.
  - *Justification:* Not applicable.

- [~] 🔴 **crypto_password_storage** — Passwords for external users are stored as iterated salted hashes.
  - *Justification:* Not applicable.

- [~] 🔴 **crypto_random** — Cryptographic keys and nonces are generated using a CSPRNG.
  - *Justification:* Not applicable.

- [~] 🟡 **delivery_unsigned** — Cryptographic hashes are NOT retrieved over plain HTTP without a signature check.
  - *Justification:* Not applicable.

---

## 🔬 Analysis

### Static Code Analysis

- [~] 🔴 **static_analysis_fixed** — All medium+ severity vulnerabilities found by static analysis are fixed in a timely manner after confirmation.
  - *Justification:* No static vulnerabilities identified.

- [x] 🔵 **static_analysis_common_vulnerabilities** — The static analysis tool includes checks for common vulnerabilities in the language/environment. *(SUGGESTED)*
  - *Tool + ruleset:* `npm run lint` leverages Next.js ESLint guidelines.

- [~] 🔵 **static_analysis_often** — Static analysis runs on every commit or at least daily (CI integration). *(SUGGESTED)*
  - *Justification:* Automated CI checks run typechecks and lint checks on every commit.

### Dynamic Code Analysis

- [~] 🔵 **dynamic_analysis** — At least one dynamic analysis tool is applied before major releases (fuzzer, web app scanner like OWASP ZAP, etc.). *(SUGGESTED)*
  - *Justification:* Not applicable for a stateless React DApp.

- [~] 🔵 **dynamic_analysis_enable_assertions** — Dynamic analysis / testing runs with assertions enabled (not just production mode). *(SUGGESTED)*
  - *Justification:* Not applicable.

- [~] 🔴 **dynamic_analysis_fixed** — Medium+ severity vulnerabilities found by dynamic analysis are fixed in a timely manner.
  - *Justification:* Not applicable.

- [~] 🔵 **dynamic_analysis_unsafe** — If the project uses memory-unsafe languages (C/C++), memory safety tools (Valgrind, AddressSanitizer) are used. *(SUGGESTED)*
  - *Justification:* Not applicable. Developed in TypeScript.

---

## 📎 Project-Specific Notes

### Web3 / React Notes
- Relies on Wagmi and Viem libraries for secure Web3 integrations.
- Uses Tailwind CSS and shadcn/ui for frontend layout components.

---

*This checklist complements [OpenSSF Scorecard](https://scorecard.dev/) (auto-detected checks) and is
inspired by the [OpenSSF Best Practices Badge](https://www.bestpractices.dev/en/criteria/0) passing criteria.*
