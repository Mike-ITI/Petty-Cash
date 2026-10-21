# Super User

Select **Super User — Alex Morgan** from the existing role preview. This account can open every module, create requests for any listed employee, liquidate any eligible released advance, edit other users’ transactions, release cash for any fund, review its own submissions, approve, reject, request corrections, verify expenses, record funding receipt, and maintain funds and categories.

Edits to pending or approved transactions return them to Draft unless explicitly resubmitted. Existing transaction owners remain identifiable, while activity history records Alex Morgan as the actor. Accepted cash counts can be edited and sent through review again; the recorded-cash snapshot is preserved.

After actual cash movement, financial fields are protected. Super User can edit notes on released requests, verified/settled liquidations, and posted replenishments. Replenishment reservations also protect their source liquidations. Duplicate posting, receipt evidence, returned-cash confirmation, fund balance, and eligibility checks still apply. Super User is a prototype role, not a real authenticated account.

| Requirement | Reuse rung | Implementation |
| --- | --- | --- |
| All-module access and role selection | 2 | Existing roles, permissions, scope, and role selector |
| Creation and cross-user editing | 2 | Existing forms and transaction handlers; explicit editAll permission |
| Approval and rejection | 2 | Existing decision handlers, confirmation modals, and history |
| Posted-data protection | 2 | Existing cash-movement and state controls, shared financial lock check |

No dependencies added. Real authentication and durable account provisioning remain outside this frontend prototype; they require a separately requested backend implementation.

Verified: `pnpm test` passes all 29 tests; `pnpm build` succeeds. Browser checks confirmed all navigation modules, cross-user request editing and approval, liquidation actions, and editable notes with protected posted amounts.
