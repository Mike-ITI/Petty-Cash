# Petty Cash workspace

A working React frontend prototype for Mayden Group, based on the supplied business PRD, functional revision notes, and visual references. No backend is included.

The overall interface now uses the supplied Figma Design Systems foundations: locally bundled Poppins, the blue-to-orange brand palette, neutral text, and shared 8px controls. See `DESIGN.md` and `design-system/figma-foundations.json` for the source mapping and application details.

## Open and run

For the already-built local preview, double-click **Start Prototype.cmd**, then open `http://127.0.0.1:5173`. The launcher uses the included build and does not require a fresh package installation.

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Vite. Build with `pnpm build` and run the 40 workflow tests with `pnpm test`. The project uses React, Vite, Lucide icons, and shared purpose-built UI components.

## Explore the journey

The **Viewing as** selector is available in the preview bar. Choose **Super User** to use **Alex Morgan**, who can access every module, create and edit across employees, approve or reject eligible submissions, and complete the lifecycle without changing roles. Posted financial facts stay protected; notes remain editable. See `SUPER_USER.md` for details. The **Explore the guide** shortcut opens a clickable six-step walkthrough.

1. **Requester:** create an estimated multi-item cash request and submit it. Submitted requests return to the listing with Pending Approval status.
2. **Approver:** review For Approval, approve, reject, or request changes with a real explanation.
3. **Custodian:** open an Approved request and confirm actual cash handover with a voucher reference.
4. **Requester:** create a liquidation by selecting an eligible own Released request. Estimates copy into editable actual-expense lines. Add receipts, payees, dates and return information; then submit.
5. **Custodian:** review For Verification. Confirm actual returned money before verification. Verified expenses settle immediately when there is no excess spending; excess requires Finance payment handling.
6. **Custodian:** select liquidated expenses from one fund to create a replenishment. Draft and pending records reserve selected sources.
7. **Finance / Admin:** approve the replenishment, then post only after explicitly confirming actual funding receipt. The ledger and fund balance update once; source expenses cannot be selected again.

Additional flows include correction/resubmission, external or petty-cash reimbursement, cash counts with preserved variance and approval, fund authorization and separate opening funding, expense category CRUD, scoped reports, CSV export, receipt previews, filters, sorting, pagination, and activity history.

## Ready-to-review sample records

- PCR-2026-0001: Isabella's released advance, available for new liquidation.
- PCR-2026-0002: pending request for Approver review.
- PCR-2026-0003: approved request ready for Custodian release.
- LIQ-2026-0001: submitted expenses of ₱1,650 against a ₱1,800 release; requires a ₱150 actual cash return.
- LIQ-2026-0002 and LIQ-2026-0004: Main Office liquidations eligible for replenishment.
- LIQ-2026-0005: correction and resubmission example.
- REC-2026-0001: cash count with a ₱10 shortage, awaiting Finance review.
- FND-004: Davao authorization pending approval; no opening cash has been received.

All initial funds reconcile to their complete sample cash movement history: Main Office ₱37,650, Cebu ₱23,000, Warehouse ₱13,500, combined ₱74,150.

## Intentional boundaries

- Records and local file references exist in memory and reset on refresh. Reset demo restores the fixtures.
- Role switching simulates permissions. No real authentication or production authorization is provided.
- Seeded receipt images are labelled demonstration documents. Actual user-selected PDF/JPG/PNG files are previewed locally; no server upload occurs.
- Three calendar days to liquidate and a 25% replenishment threshold are demonstration defaults, configurable per fund and documented in Policies & guide.
- Cash authorization and actual handover/receipt are separate. Reconciliation never silently adjusts money.
- Reimbursement from outside petty cash does not produce a fund cash-out; that externally funded excess is excluded from fund replenishment.
- Posted movements cannot be edited or deleted. Full correction/reversal execution, production accounting, bank integrations and statutory compliance are outside this prototype.
- Outstanding-advance reporting identifies advances still unsettled now and released by the chosen as-of date. It does not reconstruct historical settlement status for previously closed requests.

## Verification

29 model tests cover exact cents, submission, permissions, actual release, insufficient cash, eligible source selection, receipt validation, cash return, corrections, reimbursement, reservation, replenishment approval/posting, snapshot counts, category history, opening funding, seed balance reconciliation, and Super User access across the complete workflow.

Browser checks exercised cash return → verification → multi-selection replenishment → Finance approval → funding receipt posting → ledger tracing. Fund/category report filters, own-request lookup and expense auto-population, cash-difference feedback, unsaved-work confirmation, and responsive desktop/phone layouts were also inspected.


## Direct employee reimbursement

Open **Expense Settlements → New Settlement → Claim personal expenses**, or **Claim personal expenses** on the dashboard. No Cash Request is needed. Enter purpose, actual expense items, dates, merchants and receipts. Review any unrelated open advances and confirm the personal expense declaration.

Submit → Approver review → Approved — Pending Payment → Finance records actual payment → Paid. Finance chooses the paying fund or outside company account and records date, method and reference. Insufficient petty cash keeps the claim unpaid. Only paid claims funded by petty cash can be included in replenishment, once.

For an existing unreleased advance, **Use personal funds instead** cancels the advance and creates a reimbursement draft together. Released advances cannot be converted. In production the same checks require server-side transactions; this prototype demonstrates them atomically within one browser session.

Sample RMB-2026-0001 awaits approval; RMB-2026-0002 awaits payment. See REIMBURSEMENT.md for reuse decisions and prototype limitations.
