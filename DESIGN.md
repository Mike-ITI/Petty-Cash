# Petty Cash design system

The application now uses the user-supplied [Figma foundations](https://www.figma.com/design/sLnszbRLvVGcVojiSmyKZy/Design-Systems?node-id=1-286), inspected through the Figma connector on 22 October 2026. The supplied node contains palette, typography and button examples, rather than application screens. Its black canvas presents the swatches; the transactional workspace retains white working surfaces.

## Source foundations

| Foundation | Figma value | Application |
| --- | --- | --- |
| Primary blue | #559CDA | Brand mark, navigation accents, icons and charts |
| Primary gradient | 90deg: #559CDA 0%, #7BADFF 27%, #FFB58D 76%, #ED8028 100% | Header rule, fund-position accent and cash meter |
| Primary text | #333333 | Titles, data, amounts and transaction details |
| Secondary text | #666666 | Descriptions, labels, metadata and help text |
| White | #FFFFFF | Panels, navigation, dialogs and secondary buttons |
| Heading | Poppins Semibold, 600 | Titles and totals |
| Body | Poppins Medium, 500 | Working content and data |
| Label | Poppins Regular, 400 | Field labels and table headings |
| Buttons | 8px radius, semibold Poppins, solid primary / outlined secondary | Shared buttons across all modules and dialogs |

Poppins 400, 500 and 600 are bundled in `public/fonts/` with the SIL Open Font License. The app makes no external font request. The 191px specimen letters in Figma are type samples, not application heading sizes.

## Implementation

- `src/design-tokens.css` defines shared colors, typography, spacing, chart palette and semantic statuses.
- `src/styles.css` retains the established layouts, responsiveness, transaction insets and centered confirmation composition. Hardcoded violet colors were replaced by semantic token references.
- `src/figma-system.css` applies the foundations to navigation, dashboards, listings, forms, lookup dialogs, transaction details/history, categories, funds, ledger, reports and confirmations.
- Existing React components, Lucide icons and CSS are reused. No dependency was added.
- The exact source blue is the brand token. Small white action labels use a darker derived blue (#2E73AB, hover #225C8B) for readable contrast. Outlined secondary buttons use the source #A8A8A8 border.
- Typography adapts to business tasks: page headings 24–30px, section headings 16–18px, working text 13–14px and labels 11–12px. Wide data tables scroll inside their own containers.
- Green, amber and red remain semantic colors for success, exceptions and errors.

## Preserved behavior

All existing roles, including Super User, approvals, receipt checks, posting safeguards, calculations, session boundaries and source relationships remain in place. This visual task does not add reimbursement without an advance or backend functionality.

## Verification

The production build succeeds and all 29 workflow tests pass. Browser inspection confirmed locally loaded Poppins, #333333 primary text, #559CDA brand blue, and 8px button/input corners. All nine operational/administration modules were checked at desktop size. Dashboard, populated liquidation form and confirmation dialog were checked at 320, 375, 425, 768, 1024 and 1440px with no page/dialog horizontal overflow. Transaction selector insets remain 17px on phones and 22px on larger layouts, excluding the panel border. These checks are not a full accessibility conformance audit.
