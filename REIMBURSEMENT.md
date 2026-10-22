# Employee reimbursements

Implementation scope: React 19 / Vite, Node 24.19.0, frontend session simulation. Preserve the current Figma foundations and cash advance workflow.

| Requirement | Reuse rung | Implementation evidence |
| --- | --- | --- |
| Expense entry, receipts, confirmations, history | 2 | Existing ExpenseEditor, Modal, Confirm, History, Field, Section |
| Combined settlement listing | 2 | Existing DataTable, PageHeading, Pill, search and filters |
| Independent claims, review and payment | 7 | New reimbursement actions within existing transact atomic state update |
| Conversion and duplicate checks | 7 | Cancellation and draft creation together; recheck current state on every action |
| Fund payment and replenishment | 2 | Existing post, balance, replenishable and funding receipt workflow |
| Reports and notification queues | 2 | Extend existing views with claim records |

Direct reimbursement does not require a Cash Request. An existing unreleased request can be cancelled and converted to a draft in one operation. Released requests must be liquidated. Approval does not move money; Finance records payment separately. Only paid petty cash reimbursements can be replenished, once.

Duplicate review compares local SHA-256 receipt fingerprints, receipt URLs and expense signatures within session data. The employee must review outstanding unreleased cash requests and declare that expenses are not claimed elsewhere. Unrelated requests can remain open; overlapping requests must first be converted. This is a prototype safeguard, not receipt OCR or production concurrency protection.

Deferred: persistent storage, real authentication, database locking, bank integration and receipt OCR. A backend implementation would require these integrations; no new dependencies or external deployment are needed here.

## Verification

- `pnpm test`: 40 passing workflow tests, including 11 reimbursement scenarios.
- `pnpm build`: production build succeeds.
- Browser: created a direct PHP 100 claim with a marked sample receipt, submitted as Requester, approved as Approver, paid as Finance, followed its single ledger cash-out, then selected and posted its replenishment as Super User.
- Browser: converted an approved unreleased request to a cancelled advance and linked reimbursement draft. Separate tests exercise both release/conversion orderings.
- Browser: outside payment, protected paid fields, editable Super User notes, and approved claim expense reporting verified.
- Combined listing, reimbursement form and payment dialog checked at 320, 375, 425, 768, 1024 and 1440 px without page overflow. Form controls remain within the viewport; wide tables scroll inside their containers.
- Existing Figma tokens, centered confirmation hierarchy, role switching and advance liquidation workflows retained.

Source changes: new reimbursement UI module (~60 source lines following the repository's compact JSX style), extension of shared App routes/components and pure transaction model, and reuse of existing styles with a small settlement layout addition. No new framework or package was added.
