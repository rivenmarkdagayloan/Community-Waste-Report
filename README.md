# Community Waste Report

A small, single-page community web app for reporting local waste problems and tracking whether each report is pending, being handled, or resolved.

## The community problem

Residents may notice overflowing garbage, scattered plastic, or illegal dumping but have no simple shared record to describe the issue and follow its progress. Reports can be scattered across conversations, and residents may not know whether anyone has started addressing them.

This project provides one simple place to submit a waste report and view its current status. Replace the generic wording with a specific example from your own barangay/community before submitting the lab work.

## Users

- **Community member / resident:** submits a report and checks its status.
- **Community leader / waste-management staff:** reviews reports, updates status, edits incorrect details, and removes duplicate or invalid reports.

## Features

1. Submit a report with a title, waste category, location, and description.
2. Automatically set new reports to **Pending**.
3. View saved reports and their current status.
4. Search reports and filter by category or status.
5. View total, pending, in-progress, and resolved report counts.
6. Leader demo mode can change a report to **Pending**, **In Progress**, or **Resolved**, and can modify or delete a report.
7. Save reports in browser `localStorage` so they remain after refreshing the same browser on the same device.

## Functional requirement — FR-01

**FR-01: Submit and track a community waste report.**

As a community member, I want to submit a waste problem with its category, location, and description, and see its progress, so that the issue is recorded and I can check whether it is being addressed.

### Acceptance criteria

- The form requires a report title, category, location, and description.
- A valid report appears in the submitted reports list after submission.
- A new report starts with **Pending** status.
- A saved report remains visible after refreshing the page in the same browser.
- A leader can change the report status to **In Progress** or **Resolved**.
- The updated status remains after refreshing the page.
- Residents can search reports and filter the list by category or status.

## How to run

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.
3. Submit a test waste report.
4. Refresh the page to confirm it is saved.
5. Select **LEADER** and enter the demo PIN `1234` to test status updates, editing, and deletion.

No server, database, package installation, or external library is required.

## Architecture

- **Frontend:** one HTML file containing the page structure, CSS, and JavaScript.
- **Storage:** browser `localStorage` using the key `community_waste_reports_v1`.
- **Data flow:** form submission creates a report → report is saved locally → report list and summary counts are rendered → leader updates are saved and rendered again.

## Important limitations

- This is a classroom/demo prototype. `localStorage` is local to one browser profile and device; reports are **not** shared between residents or across devices.
- The leader PIN (`1234`) is hard-coded in client-side JavaScript. It is only a demonstration switch, **not secure authentication**. Do not use this version to protect real community or personal data.
- A real deployment would need a backend API, shared database, and server-side authentication/authorization.

## Demo checklist

- [ ] Submit a report as a community member.
- [ ] Confirm its status is Pending.
- [ ] Refresh the page and show that the report remains.
- [ ] Unlock Leader mode using the demo PIN `1234`.
- [ ] Change the report to In Progress, then Resolved.
- [ ] Demonstrate search and category/status filters.
- [ ] Demonstrate editing or deleting a test report.
- [ ] Explain that localStorage is local to the current browser/device.

## GitHub submission materials

- `PROJECT_BRIEF.md` — one-page pitch, problem, target users, feature, and architecture.
- `FR-01.md` — testable functional requirement and acceptance criteria.
- `PROMPT_LOG.md` — AI-use log (add an entry for every later AI prompt used).
- `DEMO_SCRIPT.md` — suggested 2–3 minute walkthrough.
- `COMMIT_AND_PR_PLAN.md` — suggested 6+ commit sequence and merged-PR workflow.
- `RELEASE_NOTES_v0.1.0.md` — notes for the required release.
- `SUBMISSION_FORM_ANSWERS.md` — draft answers to copy into the lab form.

To publish, create a public GitHub repository, push your feature branch, open and merge a pull request, and create the `v0.1.0` release tag. The project files are prepared locally; a GitHub repository, merged PR, public video, and release still need to be created in your GitHub/YouTube accounts.
