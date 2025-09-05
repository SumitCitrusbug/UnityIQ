EPIC A — Task Templates Management
Goal: Standardize recurring workflows using reusable checklists with required proofs and publishing controls.
US-A1: Create/Edit/Delete Task Templates
User Story
As an Admin, I want to create, edit, and delete task templates with defined fields so managers can consistently assign standardized tasks. 
Template fields: 
Template Name (mandatory), 
Department/Location (mandatory), 
Task Title (mandatory), 
Description/Instructions (optional), 
Expected Outcome (optional), 
Tags (Team/Individual/Recurring) (mandatory), 
Required Input (photo/note) (optional).
Acceptance Criteria
Given I’m an Admin on the Templates screen, when I click “New Template” and fill all mandatory fields, then the template saves and appears in the list with status “Draft”.


Given a Draft template, when I edit any field and save.
then changes persist and are versioned.


Given a template in any state, when I delete it, then it moves to “Archived/soft deleted” and is no longer assignable.


Definition of Done (DoD)
CRUD endpoints implemented; 
validation for mandatory fields; 
Drafted templates excluded from assignment pickers; 
audit entries captured (“created/updated/deleted”).


Priority: High
Dependencies: Auth & roles (EPIC J); Audit Trail (EPIC I)
Risks & Assumptions
Assumption: No multi-lingual support is needed for the project.


Risk: Free-text “Expected Outcome” may lead to inconsistent evaluation mitigated later with checklists.


Business Rules
Only Admin can create/edit/delete templates.


Tasks
FE: Template form + list.
BE: CRUD APIs; validation layer; soft-delete.
QA: CRUD, permissions, negative cases.


US-A2: Preview & Publish Templates
User Story
As an Admin, I want to preview a template and publish/unpublish it so managers only assign the templates.
AC
Given a Draft template, when I click Preview, then I see the read-only task card as staff will see it.


Given a Draft template, when I click Publish, then state changes to “Published” and it becomes assignable.


Given a Published template, when I Unpublish, then it’s hidden from assignment pickers.


DoD
Preview view matches staff task card; publish state respected everywhere; events logged.


Priority: Medium
Dependencies: US-A1
Risks/Assumptions
N/A


Test Data
Draft “Morning Setup” → Publish → visible in assignment.
Business Rules
Only Admin can change publish state.
Tasks
FE: Preview modal; publish toggle.


BE: State transitions



EPIC B — Assignment & Visibility
Goal: Let managers assign tasks to individuals/teams/roles with due times, required inputs, notes, and make team tasks visible appropriately
US-B1: Assign Tasks (Individual/Team/Role) with Due Time & Requirements
User Story
 As a Manager, I want to assign tasks to individual staff, a team, or a role with due time, optional notes, and required inputs so work is clearly distributed.
AC
Given I open “Assign Task”, when I pick assignee(s), set Due Time and Required Inputs, then the task saves and appears on assignees’ lists.


Given I pick a team(multiple staff members), when I assign, then the task shows to all team members (see US-B2).


DoD
Assignment API; required-input enforcement; notifications fired.


Priority: High
Dependencies: Templates (EPIC A), Roles (EPIC J)
Risks/Assumptions
Assumption: Location scoping enforces staff visibility.


Risk: Over-assignment mitigate with duplicate warning.


Business Rules
Managers can assign daily/weekly; Admin can view cross-location.


Tasks
FE: Assign modal; people picker; validation.


BE: CreateTask; notify.


QA: Role vs team vs individual matrix.


DevOps: Queue/topic for task events.




US-B2: Team Task Visibility + “Completed By” Tracking
User Story
 As a Manager, I need team tasks to be visible to all team members, and the system must capture who actually completed the task.
AC
Given a team task, when any team member opens it, then they can complete it if it’s not already completed.


Given a team task is completed, when I view details, then I see both Assigned To (Team) and Completed By (User) with timestamp.


DoD
Data model supports “assigned to group” + “completed by user”; UI shows both.


Priority: High
Dependencies: US-B1
Risks/Assumptions
Assumption: One completion suffices for a team task.


Business Rules
First valid completion locks task for others.


Tasks
FE: Team badge & “Completed by” field.


BE: Completion ownership; concurrency lock.


US-B3: Create Ad-Hoc Task (One-Off)
User Story
 As a Manager, I want to create and assign a one-off ad-hoc task (without using a template) to an individual, team, or role so I can handle unique or time-sensitive work quickly.
Fields (ad-hoc)
Task Title (mandatory)
Department/Location (mandatory)
Assignee(s) = Individual or Team | Role (mandatory)
Due Time/Date (mandatory)
Task Window (optional; start–end; if provided must include due time)
Description/Instructions (optional)
Required Inputs (optional; Photo and/or Note)
Tags (mandatory; Team / Individual, & Recurring)


Acceptance Criteria
Given I’m on “Assign Task”, when I choose Create Ad-Hoc and fill all mandatory fields, then the task is created, appears on the selected assignees’ lists, and notifications are sent.


Given I omit a mandatory field (e.g., Title, Location, Due Time), when I submit, then I see inline validation and the task is not created.


Given I set a Due Time in the past, when I submit, then I see an error instructing me to pick a future time.


Given I provide a Task Window, when the window does not encompass the Due Time or start ≥ end, then I see a validation error.


Given I assign to a Team/Role, when the task is created, then it is visible to all eligible members (per Location/Role) and the system records Completed By (User) when one person finishes it.


Given a task has Required Inputs, when a staff member tries to complete without them, then submission is blocked with a specific message (e.g., “Photo required”).


Given an ad-hoc task is created, when I view its details, then it is clearly labeled Ad-Hoc (Not a Template) and all actions are fully audit-logged (created/assigned/edited).


Definition of Done (DoD)
Ad-hoc creation form + validation implemented; assignment + notifications wired.
Team/Role visibility and Completed By tracking in place.
Required-input enforcement server-side; audit entries for create/update.


Priority & Story Points
Priority: High 


Dependencies
RBAC/Auth (EPIC J), Assignment flows (US-B1/B2), Audit Trail (EPIC I), Notifications, Storage (if Photo required).


Business Rules
Only Managers/Admins can create ad-hoc tasks.


Ad-hoc tasks do not appear in Template lists and are single-use.


First valid completion locks team/role tasks for others.


Tasks Breakdown
Frontend:


Ad-hoc create form (toggle from Assign Task), inline validation, success/error toasts, ad-hoc badge on detail view.


Backend:


POST /tasks (ad_hoc=true) with validation (future due time, window bounds, required inputs), assignment, notifications, audit write.


QA:


Mandatory/optional field matrix, team/role visibility, duplicate warning, API negative tests.

EPIC C — Task Listing & Completion
Goal: Staff see their tasks, grouped and with required inputs; submit completions with proof.
US-C1: Staff Task List (Today/Week) & Detail
User Story
 As Staff, I want to view my assigned tasks for today/week with clear instructions, due time, and proof requirements.
AC
Given I open Tasks, when tasks exist for me, then I see cards with Task Name, Instructions, Due Time, Required Inputs.


Given no tasks, then I see an empty state.


DoD
List + detail views; location scoping; pagination; empty state.


Priority: High
Dependencies: Auth/Roles (EPIC J)
Risks/Assumptions
Assumption: “Week” means current Monday–Sunday.


Test Data
3 tasks across today/tomorrow; one overdue (red).
Business Rules
Staff only see tasks assigned to them/team at their location.
Tasks
FE: List, filters, detail view.


BE: GetTasksByUser API.


QA: Access control by role/location.


US-C2: Complete Task with Required Photo/Note
User Story
 As Staff, I want to complete a task and attach required proof so managers can verify.
AC
Given a task requiring Photo, when I submit without a photo, then I get a validation error.


Given I add the photo and submit, then the task moves to “Awaiting Review” and captures timestamp & my user ID.


DoD
Upload control; server-side validation; S3/Blob storage; audit entry.


Priority: High
Risks/Assumptions
Risk: Large image sizes, add client resize.


Test Data
Upload 1.5MB or higher JPG as proof.


Business Rules
Required inputs enforced strictly.


Tasks
FE: Proof uploader; progress.


BE: Upload endpoint.



EPIC D — Pass/Fail Evaluation & Overrides
Goal: Managers grade tasks; failed tasks impact Groove Score and may incur bonus penalty; allow overrides without disputes.
US-D1: Manager Pass/Fail with Optional Reason & Penalty Hint
User Story
 As a Manager, I want to mark tasks Pass/Fail and optionally add a reason so performance impact is traceable. Failed tasks show “5% bonus penalty” tooltip and reduce Groove Score (auto).
AC
Given a completed task, when I select Fail and add a reason, then status updates and a penalty hint is displayed.


Given a Pass, then no penalty is applied.


DoD
Review queue; fail reasons; penalty flag to Groove Score.


Priority: High
Dependencies: Groove Score integration (EPIC K)
Risks/Assumptions
Assumption: Default penalty is 5% (configurable in Settings later).
Business Rules
Managers evaluate; Staff see result; Admin can override.


Tasks
FE: Review table; Pass/Fail modal.


BE: EvaluateTask API; GS sync event.


QA: Reason required on fail.
US-D2: Manager Override Without Dispute
User Story
 As a Manager, I want to override a task outcome (e.g., mark “no score impact”, adjust due date) without forcing staff to raise a dispute, to resolve operational exceptions quickly. 
AC
Given a failed or overdue task, when I click “Override” and select “No score impact” with a note, then Groove Score impact is suppressed and audit logged.


Given a past-due task, when I move the due date to today, then the task is current and staff sees it in “Today”.


DoD
Override UI; suppression flag; due-date editor.


Priority: High
Dependencies: Audit Trail (EPIC I), GS Integration (EPIC K)
Risks/Assumptions
Risk: misuse of overrides, mitigate with reporting on override counts.
Business Rules
Manager overrides do not require Admin approval; Admin sees all overrides.


Tasks
FE: Override drawer; date control.


BE: Override API; GS suppression logic.


QA: Verify GS unaffected after override.



EPIC E — Overdue & Carry-Forward
Goal: Tasks not completed roll over visibly; managers get a morning view to act. 
US-E1: Auto Carry-Forward + Red Status
User Story
 As Staff/Manager, I want overdue tasks to carry forward and be clearly marked so they’re addressed next day and counted in performance.
AC
Given a task not completed by due time, when the next day starts, then it appears in “Overdue” (red) and impacts score by default.


Given a manager override “No score impact”, then score is not impacted.


DoD
Nightly or rolling carry-forward job; status color; GS default impact.


Priority: High
Dependencies: GS Integration (EPIC K), Overrides (US-D2)
Risks/Assumptions
Assumption: “Day starts” is based on store timezone in Settings.


Test Data
Due yesterday 18:00 → today shows “Overdue”.


NFRs
Rollover completes < 60s after day start.


Business Rules
Overdue impacts GS unless overridden.


Tasks
FE: Overdue filter; red styling.


BE: Rollover job; GS default penalties.


QA: Rollover timing tests.



US-E2: Morning Manager “Past-Due” View with Actions
User Story
 As a Manager, I need a morning view of all past-due items with quick actions (move due date, mark complete, mark no-impact) to triage the day.
AC
Given I open “Past Due”, when items exist, then I can bulk select and apply actions (Move to Today / Mark Complete / No Score Impact).


Given I apply an action, then items update and audit records are written.


DoD
Bulk actions; success toasts; audit.


Priority: Medium
Dependencies: Overrides (US-D2)
Risks/Assumptions
Risk: For Bulk actions accidental, add confirmation.


Test Data
5 items → bulk “Move to Today”.


Business Rules
Only Managers/Admins can bulk triage.


Tasks
FE: Past-Due screen; bulk toolbar.


BE: Bulk endpoints.
EPIC F — Dispute Management
Goal: Staff can dispute failed tasks; Admin is final arbiter.
US-F1: Staff Raise Dispute on Failed Task
User Story
 As Staff, I want to dispute a failed task with a comment so my case can be reviewed.
AC
Given a failed task, when I click “Dispute” and enter a comment, then a dispute record is created and appears in Admin’s queue.


Given I already disputed, then I cannot create another dispute for the same task.


DoD
One-to-one dispute per task; comment required; notifications.


Priority: Medium
Dependencies: Notifications
Risks/Assumptions
Assumption: 500-char limit sufficient.


Test Data
Comment: “Store was overwhelmed; manager aware.”


Business Rules
Staff can dispute only failed tasks.


Tasks
FE: Dispute modal.


BE: CreateDispute API; constraints.


QA: Duplicate-dispute prevention.


US-F2: Admin Resolves Dispute (Approve/Deny) — Final Decision
User Story
 As an Admin, I want to approve/deny disputes with notes so outcomes are final and auditable.
AC
Given a dispute, when I Approve, then the failure is overridden and GS impact removed.


Given a dispute, when I Deny, then original failure stands.


Then the staff and manager are notified of the decision.


DoD
Approve/Deny endpoints; GS sync; notifications; audit entries.


Priority: High
Dependencies: GS Integration (EPIC K), Notifications
Risks/Assumptions
Risk: Backlog of disputes, add filters/status.


Test Data
Approve dispute → pass + GS restored.
Business Rules
Admin decision is final (no second-level appeal).


Tasks
FE: Dispute queue; decision modal.


BE: ResolveDispute API; GS adjustments.


QA: Notification content.


EPIC G — Alerts & Flags
Goal: Surface risk patterns: repeated failures, suspicious completions, missing proofs.
US-G1: Auto-Flag Rules & Manager Flag Inbox
User Story
 As a Manager, I want the system to flag repeated failures, suspiciously fast completions (<2 minutes), and missing proofs so I can investigate.
AC
Given a staff fails 3+ tasks in 7 days, when threshold is hit, then a “Repeated Failures” flag appears.


Given a completion under 2 minutes, then a “Suspicious Completion” flag appears.


Then flags list is visible on Manager dashboard.


DoD
Rule engine; flag entities; Manager inbox.


Priority: Medium
Dependencies: Completion events; Manager dashboard


Test Data
User S1 fails 3 tasks within 7 days → flag.


Business Rules
Flags are informational; do not auto-penalize.


Tasks
FE: Flag list; actions.


BE: Rule engine; flag storage.


QA: Rule thresholds; snooze.


EPIC H — Reporting & Export
Goal: Basic weekly summaries and CSV export for accountability.
US-H1: Weekly Summary & Filters + CSV Export
User Story
 As a Manager/Admin, I want weekly summaries with filters by Staff/Date, location and CSV export.
AC
Given I select a week, when I filter by Staff & location, then I see Tasks Completed/Failed and compliance.


Given I click Export, then I receive a CSV matching the grid.


DoD
Grid; filters; CSV download; permissions enforced.


Priority: Medium
Risks/Assumptions
Assumption: Timezone from Org Settings.


Test Data
Week of Aug 18–24; Staff “Jane”.
Business Rules
Managers limited to their locations.


Tasks
FE: Filters; export.


BE: Report query; CSV stream.


EPIC I — Task History & Audit Trail
Goal: Full action history for compliance and review.
US-I1: Immutable Audit Log per Task/User
User Story
 As an Admin, I want to see Created/Assigned/Completed/Reviewed actions with actors and timestamps per task and per user.
AC
Given a task, when I open History, then I see events (who/when/what).


Given a user, when I open their history, then I see tasks they acted on.


DoD
Append-only log; tamper-resistant; pagination.


Priority: High
Dependencies: All task flows emit events
Business Rules
Admin has full access to logs.


Tasks
FE: History tab; filters.


BE: Event store; writers in all flows.


QA: Event ordering; permissions.
EPIC J — Authentication & Authorization
Goal: Ensure only authorized users can perform actions; integrate with UnityIQ SSO/roles; enforce least privilege.
US-J1: Role-Based Access (Admin/Manager/Staff)
User Story
 As the System, I must enforce RBAC so Admins/Managers/Staff have correct permissions for templates, assignments, evaluation, disputes, reporting.
AC
Given my role, when I access restricted actions, then I am allowed/denied according to the matrix.


DoD
Policy middleware; permission matrix tests.


Priority: High
Dependencies: Auth foundation
Risks/Assumptions
Assumption: Existing UnityIQ user store + PIN login flows are in place; TAMZE consumes identity (no new IdP).


Test Data
Admin vs Manager vs Staff accounts.


Business Rules
Staff cannot view other users’ reports/logs.


Tasks
FE: Guard routes; hide controls.


BE: RBAC middleware; policy config.


QA: Permission matrix.



EPIC K — Groove Score Integration (Impact & Bonus)
Goal: Failed/overdue tasks affect Groove Score and bonus; allow suppression via overrides or approved disputes.
US-K1: Emit Outcomes to Groove Score
User Story
 As the System, I must emit pass/fail/overdue outcomes (and suppression flags) to Groove Score to calculate staff performance/bonus.
AC
Given a task is Failed, when saved, then an event with penalty metadata is sent to GS.


Given an override/dispute approval suppresses impact, then GS receives a suppression event.


DoD
Event schema; retry queue
Priority: High
Dependencies: D1, D2, F2, E1
Risks/Assumptions
Assumption: GS schema can accept suppression flag and penalty %.


Test Data
Fail→send penalty=0.05; Override→send suppressed=true.


Business Rules
Default penalty 5% (configurable).


Tasks
FE: None (Not applicable).


BE: Event producer; retry policy.


QA: Contract tests with GS stub.


DevOps: Queue, DLQ, dashboards.



EPIC L — System Control Panel & Settings
Goal: One place to configure rules, templates, audit, and notes.
US-L1: Admin Control Panel
User Story
 As an Admin, I want a control panel to manage templates, task rules (pass/fail, penalty%), disputes, audit logs, and admin notes.
AC
Given I open Control Panel, then I can: open Templates, Rules, Disputes, Audit, Notes.


When I change penalty% to 10, then the new value is used for subsequent failures.


DoD
Settings persisted; effective immediately; audited.


Priority: High
Dependencies: A, D, F, I
Risks/Assumptions
Assumption: No per-location override in MVP.


Test Data
Penalty%: 0.10; verify on new fail.


Business Rules
Only Admin can change rules.


Tasks
FE: Settings nav + forms.


BE: Config store; cache invalidation.


QA: Rule effect on new events.










EPIC M — Brands & Locations Master Data
Goal: Allow Admins to create and manage multiple Brands and Locations, and scope staff to them so ShiftIQ scheduling, PTO, attendance, and payroll can be filtered correctly.
US-M1: Create / Edit / Archive Brands
User Story
 As an Admin, I want to create, edit, and archive Brands so the organization can schedule and report across multiple brands.
Acceptance Criteria
Given I am on the Brands page, when I click New Brand and provide a unique Brand Name (mandatory), then the brand is created and visible in pickers.


Given an existing brand, when I edit its name and save, then updates appear everywhere brands are referenced.


Definition of Done (DoD)
Brand CRUD (create/read/update/archive), uniqueness validation, audit logs.
Dependencies: RBAC (Master Admin canl provide to any user)
Risks & Assumptions
Assumption: Brand has only Name in MVP, no additional notes or image, etc.


Risk: Accidental delete, mitigate with confirmation modal listing dependent locations.


Test Data
Brand: “Craft Therapy Network” and “Shroom Groove”.


Business Rules
Only Admins or assigned staff members can create/edit/delete brands.


Tasks Breakdown
Frontend: Brand list, search, New/Edit modal, Delete confirmation.


Backend: Brand model, CRUD endpoints, uniqueness checks.


US-M2: Create / Edit / Delete Locations (per Brand)
User Story
 As an Admin, I want to create, edit, and delete Locations under a Brand with operational settings so scheduling and clock-in validation work correctly.
Acceptance Criteria (Given/When/Then)
Given a Brand, when I click Add Location and provide mandatory fields, Location Name, Brand, Store Hours (open/close), Approved IPs (can be empty at creation) - then the location is created.


Given a Location, when I edit settings (e.g., add/remove Approved IPs), then Time Clock validation uses the new values immediately.
That means, If an Admin updates the settings of a Location specifically the list of Approved IP addresses that are allowed to be used for Clock-In / Clock-Out — then the system should start using the new IP list immediately (i.e., without delay, no need for a manual refresh, deploy, or restart).


Given a Location with published future shifts, when I attempt to delete it, then I’m blocked and shown the list of future shifts to move/cancel first.


Definition of Done (DoD)
Location CRUD with Brand foreign key; operational settings persisted


Dependencies
 US-M1; Scheduler (read-only); Time Clock (for settings consumption)
Risks & Assumptions
Assumption: One timezone per location; multi-address or kiosk list optional later.


Risk: Incorrect IP blocks punches, add “Test Validation” button to simulate.


Test Data
Location: “Main St.” (TZ=America/Los_Angeles, Hours 11–19, IPs: 203.0.113.17).


Business Rules
Only Admins manage locations; Manager sees locations scoped to their role.
Or If admin authorize the permission to any user, users would as well be able to create the location and brand.


Tasks Breakdown
Frontend: Location form (name, tz, hours, IP allowlist list); delete flow with dependency warning.


Backend: Location model, CRUD, config validation



US-M3: Assign Staff to Brands & Locations
User Story
As an Admin, I want to assign staff to specific Brands and Locations so they appear in the correct schedulers and can punch only where authorized, whereas there would be a flexibility to see different staff members as well according to the availability.
Acceptance Criteria
Given a staff profile, when I assign Brand(s) and Location(s), then the user appears in those schedule pickers and not in others.
That means If I assign a staff member to specific Brands and Locations, they will only show up in the scheduler for those places—not in others.


Given a staff not assigned to a Location, when I try to schedule them there, then I’m able to see a message “User not assigned to this Location/Brand.” Do you stll want to assign him/her?
(Depending upon the availability of the staff)


Definition of Done (DoD)
Staff↔Brand/Location many-to-many mapping; picker filter. 
Dependencies
 US-M1, US-M2; Identity/RBAC; Scheduler.
Risks & Assumptions
Assumption: Role/badge assignment handled


Test Data
Staff “Alice” → Brand “Shroom Groove” → Locations “Main St”


Business Rules
Managers can schedule staff within their Brands/Locations as per the availability.


Tasks Breakdown
Frontend: Staff profile tab for Brand/Location assignments; multi-select with search.


Backend: Assignment endpoints; scheduler filters



EPIC S — Shift Management & Smart Planner
Goal: Plan, publish, and maintain compliant shift schedules with intelligent assistance, visibility of availability/PTO, and conflict prevention across brands and locations. (Daily/weekly/monthly views, split shifts with approval, recurring templates, draft→publish.)
US-S1: Create / Edit / Delete Shifts (Daily/Weekly/Monthly)
User Story
 As a Manager, I want to create, edit, and delete shifts across day/week/month views so the team has a clear, accurate schedule. (Assign by role/badges, location, shift type; define time range; support split shifts with approval.)
Acceptance Criteria
Given I’m on the scheduler, when I create a shift with Role (can be any as discussed on call, each shift can have a separate role of each staff), Location, Shift Type, and Time Range, then the shift saves and appears in the calendar/grid (day/week/month).


Given an existing shift, when I edit time, role, or assignee, then the change persists and history logs the edit (actor/timestamp).


Given a shift, when I delete it, then it is removed from the active schedule and the deletion is audit-logged.


Given a split shift proposal, when manager approval is required, then I cannot finalize the split without explicit approval.


Definition of Done (DoD)
CRUD implemented with validation; audit logs for create/update/delete; calendar/list rendering for day/week/month; RBAC enforced.

Dependencies: RBAC.
Risks & Assumptions
Assumption: No edits on live schedules will be there.


Business Rules
Split shifts require manager approval.


Tasks Breakdown
FE: Calendar (day/week/month), shift form, inline validation, Calendar interactions and empty/error states.


BE: Shift model, CRUD APIs, audit writer, RBAC checks.

US-S2: Draft → Publish Workflow for Schedules
User Story
 As a Manager, I want to stage draft schedules and then publish them so staff only see finalized plans.
AC
Given a draft schedule, when I publish, then staff-facing views update can be triggered.


DoD: Status states: Draft/Published; visibility rules respected; audit entries
Dependencies: US-S1; RBAC.
Business Rules
Only Managers publish.
Tasks
FE: Publish toggle, confirmation modals.


BE: State transition API, bulk updates, audit writer.


QA: Visibility before/after publish.


US-S3: Recurring Shift Templates
User Story
 As a Manager, I want reusable weekly patterns (recurring templates) so I can apply a base schedule quickly.
AC
Given a weekly pattern, when I apply the template to a target week, then shifts are generated automatically to the whole week.


DoD: Template create/edit; apply to range.
Priority: Medium.
Risks & Assumptions
Assumption: Holidays/blackout dates managed externally for MVP (manual blocks).


Tasks
FE: Template builder & apply dialog.


BE: Template schemas, batch generator.


US-S4: Multi-Brand & Multi-Location Scheduling
User Story
 As an Admin/Manager, I want to schedule by Brand and Location, and allow staff assigned to multiple brands/locations to appear in relevant pickers, so payroll and visibility remain clean.
AC
Given I select Brand + Location, when I open the staff picker, then on priority I only see staff assigned to that Brand + Location, if I’d like to see all Staff Members, then needs to click on View All Staff Members. (it won’t be further specified with multiple loc and brands)


Given a staff member assigned to multiple brands/locations, when I schedule them at Location A, then they won’t be available for Location B.
Given cross-location work, when payroll is run, then hours stay separated by Brand and Location.


DoD: Brand/Location master data; staff↔brand/location assignments; filtered staff pickers.
Dependencies: Master data for Brands/Locations; RBAC.
Risks & Assumptions
Risk: Staff wrongly scoped; mitigate with staff profile assignments and badges.


Test Data
Staff “A” assigned to Brand=Shroom Groove, Loc=Main & Loc=North; appears in both contexts.
Business Rules
Brand+Location are mandatory context keys for schedules.


Tasks
FE: Context switcher (Brand/Location)


BE: Brand/Location entities; staff assignments; context-aware queries.


US-S5: Staff Shift View (Calendar/List)
User Story
 As Staff, I want to see my assigned shifts in calendar or list so I can plan my week.
AC
Given published schedules, when I open “My Shifts”, then I see day/week views with Brand/Location, Role, and times.


Given no assignments, when I open “My Shifts”, then I see an empty state.


DoD: Responsive list/calendar; timezone correct; access limited to self.
Dependencies: US-S2 (publish), RBAC.
Risks & Assumptions
Assumption: Desktop only flow.


Test Data
3 shifts this week: M/W/F 10:30–19:30.
Business Rules
Staff cannot see other users’ schedules.


Tasks
FE: My Shifts page (toggle calendar/list).


BE: GetShiftsByUser API.


QA: Role-based access tests.


US-S6: Availability & PTO Overlays in Planner
User Story
As a Manager, I want to see staff availability and approved/requested PTO overlaid on the planner so I can schedule efficiently.
AC
Given Planner week view, when I toggle overlays, then staff availability shows (green) and PTO/unavailable shows (red/blocked).


Given PTO submitted by the 15th for next month, when I view that month, then those requests appear in the overlay for decisioning.


Given a staff is unavailable, when I try to assign a shift, then the planner blocks or warns.


DoD
 Overlay rendering; data adapters to PTO/availability
Dependencies: PTO module; staff availability input.


Test Data
PTO: 2 days next month; Unavailability: Tue 12–16h.


Business Rules
Approved PTO blocks scheduling; requests show as pending (yellow).
 PTO submitted by the 15th for next month.


Tasks
FE: Overlay chips/bars; color legend; filters.


BE: PTO/availability endpoints or adapters.


QA: Overlay accuracy, edge of week/month.


US-S7: Smart Suggestions (AI-assisted Scheduling)
User Story
 As a Manager, I want Smart Suggestions that propose assignees based on role, availability, Groove Score weight, and weekly-hour caps to speed up scheduling and fairness.
AC
Given an unfilled slot, when I open “Suggest”, then I get a ranked list factoring availability/Groove Score and reasons for PTO (travel/leisure/sick) per rules.


Given multiple requests for a day, when I auto-build a schedule, then the system proposes a draft plan which I can tweak before publish.


DoD
 Ranking function, “Why suggested” tooltip.
Priority: Medium
Dependencies
 Groove Score feed; availability/PTO data (US-S6).
Business Rules
Reasons & GS weights drive priority; scheduler retains final say.


Tasks
FE: Suggest drawer, “why suggested”, apply all.


BE: Ranker service; inputs: role, availability, PTO, GS; outputs: ranked list.


QA: Deterministic tests for scenarios.



US-S8: Conflict Detection & Compliance Rules
User Story
As a Manager, I want simple conflict detection that blocks overlapping shifts for the same staff member so no one is double-booked.
AC
Given a staff member already has a scheduled shift, when I try to create or publish another shift that overlaps in time (even across different Brands/Locations), then the system blocks the action with a clear message showing both conflicting shifts.


Given I adjust the start/end time so the overlap is removed, when I save/publish, then the system allows it.


Given back-to-back shifts (end time equals next start time), when I save/publish, then it is allowed (no overlap).


Given I attempt to assign a user to two concurrent half-shifts, when I save/publish, then the system blocks until times no longer overlap.


Definition of Done (DoD)
Server-side validator that detects time intersection per user across all Brands/Locations; inline error messages identify conflicts; no hour-cap warnings; no compliance report in this story.


Priority
 High 
Dependencies
 US-S1 (Create/Edit/Delete Shifts); US-S2 (Publish); Brand/Location scoping (US-M3) for visibility, not for the overlap rule (which is global per user).
Risks & Assumptions
Assumption: Overlap logic uses inclusive start, exclusive end ([start, end)) to allow exact back-to-back shifts.


Assumption: Other rules like split-shift approval are handled in separate stories and not part of conflict detection.


Test Data
Shift A: 10:30–14:00; Attempt Shift B: 13:45–19:30 → Blocked (overlap 15 min).


Shift A: 10:30–14:00; Attempt Shift B: 14:00–19:30 → Allowed (no overlap).
Business Rules
Overlaps are blocking. No hour caps, no additional compliance checks in this story.


Tasks Breakdown
Frontend: Inline error banners/tooltips on the grid; “View conflicting shift(s)” link.


Backend: Overlap validator at create, edit, and publish endpoints; returns conflict objects (shift_id, brand, location, start/end).



US-S9: “A Shift is a Shift” (Half-Shifts count as Shifts)
User Story
 As the System, I must treat any scheduled segment (half or full) as a “shift” for attendance purposes; staff can work multiple shifts/day, each independently accountable for punctuality.
AC
Given two half-shifts in one day, when attendance metrics run, then each counts as an individual shift for on-time/late rules.


Given multi-location halves on the same day, when saved, then payroll attribution remains per Brand+Location (handled later in Payroll Sync).


DoD
 Shift granularity stored; attendance hooks prepared.
Priority
 Medium
Dependencies
 Attendance & Groove Score integration (later).
Risks & Assumptions
Risk: Edge travel times between locations, outside MVP scope.


Test Data
10:30–16:00 (Loc A) + 16:30–19:30 (Loc B) → 2 counted shifts.


Business Rules
Half-shift swaps require manager approval.


Tasks
FE: None (N/A).


BE: Attendance counter config; flags per segment.


QA: Counting logic scenarios. 





EPIC T — Time Clock (Clock-In/Clock-Out) & Attendance Capture
Goal: Enable authentic, real-time timekeeping with device/location validation (store IP + browser location), fair grace windows, clear on-duty visibility, and exception handling that flows through disputes (no direct time edits).
US-T1: Kiosk Punch (PIN) with IP Whitelist & Browser Location
User Story
 As Staff, I want to clock in/out on the store kiosk with validation so punches are only accepted from approved networks/locations and I get a clear confirmation state.
Acceptance Criteria (Given/When/Then)
Given the kiosk is on an approved network (within that IP address), when I enter my PIN and the browser shares location within the store radius, then my punch is recorded and I see a visual confirmation (status, time, upcoming break/shift end).


Given the kiosk is off an approved IP or location cannot be acquired, when I attempt to punch, then I see an error “Punch not allowed from this device/location” and no time record is created.


Given my shift starts at 10:30, when I punch between 10:25–10:29 (early window), then the punch is accepted per policy (see US-T2).


Given my shift starts at 10:30, when I punch at 10:34 (within late grace), then I’m marked On-Time (Grace) and the punch does not count as “late” for policy scoring (see US-T2).


Definition of Done (DoD)
PIN punch screen; IP whitelist check; browser geolocation with store radius; success/error states; audit log for punch attempts (success/fail).


Unit/integration tests for IP, geo, and success/failure flows.


Priority: High
Dependencies: RBAC/identity (PIN), Store IP/Geo config, Audit Logs.
Risks & Assumptions
Assumption: Desktop-first kiosk.


Risk: Some browsers block geolocation → allow IP-only


Test Data
Store IP: 203.0.113.17; Shift 10:30–19:30.
Business Rules
Punches allowed only from approved IPs locations.


Tasks Breakdown
Frontend: PIN entry UI, browser IP request, confirmation state, error banners.


Backend: POST /punch (validate IP)

US-T2: Grace Windows & Time Policy (Early/Late)
User Story
 As an Admin, I want to configure early clock-in and late grace windows so legitimate small deviations don’t penalize attendance.
Acceptance Criteria
Given defaults Early ≤ 5 min and Late grace ≤ 5 min, when a punch falls within these windows, then it is accepted and does not count as “late” for scoring; display shows On-Time (Grace).


Given a punch earlier than early window, when submitted, then it is rejected with “Too early—return at HH:MM”.


Given a punch later than late grace, when submitted, then it records as Late.


Given Admin updates grace windows, when I save, then changes apply to future punches and are audit-logged.


DoD
Config form; policy engine applying windows; labels (On-Time/On-Time Grace/Late); audit for config changes.
Dependencies: US-T1; Audit; Groove Score rules (read-only in this epic)
Risks & Assumptions
Assumption: Grace affects attendance classification, not payroll hours.


Risk: Confusion between “non-penalty grace” vs score rules → copy and tooltip clarify.


Test Data
Early=5m, LateGrace=5m; Shift 10:30 → punches at 10:27, 10:34.


Business Rules
Grace windows are org-level; per-location overrides later.


Tasks
FE: Settings page; policy badges on punch screen.


BE: Policy cache; validation; audit writer.



US-T3: Real-Time On-Duty Board (Who’s In / Missed Clock-Ins)
User Story
 As a Manager, I want a live board showing expected staff vs actual punches so I can react to late/no-shows fast.
Acceptance Criteria
Given a Published schedule, when the shift window begins, then staff appear in one of: Not Punched, On-Time, On-Time (Grace), Late, No-Show (after X min).


Given a staff is Late or No-Show, when threshold is crossed, then row is highlighted.


Given I click a staff row, then I see their shift details and a quick action “Resolve”.


DoD
Streaming updates on punches; board with filters (Brand/Location/Role); quick links to dispute flow.


Priority: High
Dependencies: Published schedules; resolve module link.
Risks & Assumptions
Assumption: No-Show = 30 min after start (configurable later).


Test Data
Three staff due at 10:30 → punches at 10:27, 10:34, none.
Business Rules
Only admin/managers see their location boards.


Tasks
FE: On-Duty board; status chips; alert badge.


BE: Channel for punch events; status service.


QA: State transitions, alert thresholds.



US-T4: Missed Punch & Auto-Close Behavior (No Direct Edits)
User Story
 As the System, I must detect missed punches and prevent direct time edits; corrections happen only via disputes.
Acceptance Criteria
Given staff forgot to clock-out, when shift end + grace (e.g., 30 min) elapses, then status becomes “Clock-Out Missing” and the record is locked pending dispute.


Given a manager notices a missing punch, when they try to edit the time, then they are prompted to raise a Dispute (no direct field edit).


Given an approved dispute, when decision is Approve, then the punch record is amended.


DoD
Auto-flagging job for missing punch; lock mechanism; dispute linkage.


Dependencies: Dispute Resolution epic
Risks & Assumptions
Risk: Staff leave mid-rush → many flags
Test Data
Shift 10:30–19:30; no clock-out → flag at 20:00.


Business Rules
Clock edits only via approved disputes.


Tasks
FE: “Fix via Dispute” 


BE: Flag worker; lock state; dispute webhook.


US-T5: Staff “My Punches” (Daily Summary)
User Story
As Staff, I want to see today’s punches and status (On-Time/Late/Grace) so I can self-verify.
Acceptance Criteria
Given I punched today, when I open My Punches, then I see punch-in/out times, grace markers, and total shift time.


Given a missing punch, when I open the view, then I see a “Report an Issue” button that opens the Dispute form prefilled. (Dispute will only open between Sunday 12 AM to Tuesday 11.59 PM)
DoD
Read-only list; dispute link; timezone-aware display.


Dependencies: Disputes; Attendance classification (US-T2).
Risks & Assumptions
Assumption: No editing here—only dispute route.


Test Data
In 10:34 (Grace), Out 19:31 → total 8:57.


Business Rules
Staff see only their own records.


Tasks
FE: My Punches page.


BE: GET /me/punches?date=….


US-T6: Manager Exceptions & Flags (No Direct Edits)
User Story
 As a Manager, I want to see a list of punch exceptions (late, no-show, missing out).
Acceptance Criteria
Given an exception is detected, when I open the Exceptions tab, then I see grouped items (Late, No-Show, Missing Out) with quick actions (Resolve).


DoD
Exceptions list; actions


Dependencies: On-Duty board (US-T3); Disputes.
Risks & Assumptions
Risk: Managers expect edits
Test Data
4 exceptions today; 1 resolved..


Business Rules
No manual time edits in UI.


Tasks
FE: Exceptions table; action menu of resolution.


BE: Exceptions feed; dispute prefill endpoint.


US-T9: Punch Data → Attendance Classification
User Story
 As the System, I must classify each punch pair into On-Time (Grace)/On-Time/Late/No-Show states for downstream scoring and reporting.
Acceptance Criteria
Given grace windows (US-T2), when punches occur, then the record stores policy_state accordingly.


Given a No-Show, when staff never punched in by threshold, then create a zero-hour attendance record marked Absent (Unexcused), pending dispute.


DoD
Deterministic classifier; single source of truth for policy_state.


Dependencies: US-T1/T2; Published schedules.
Risks & Assumptions
Assumption: Only Published shifts are counted for attendance.


Test Data
Punch at 10:34 with LateGrace=5 → On-Time (Grace).


Business Rules
Minimum 2 shifts/week needed before attendance score is computed (consumed by a later epic).


Tasks
FE: Not applicable.


BE: Classifier service; unit tests; event emission hook.


QA: Truth table tests for edge times.











EPIC BKS — Break Scheduling
Goal: Fair, policy-driven break planning with a dedicated timeline UI, slot locking, one-at-a-time per location, and manager overrides.

US-BKS1: Configure Break Rules (Types, Caps, Eligibility)
User Story
 As an Admin, I want to configure break types and rules (1×30 lunch, 2×15 personal; max caps; eligibility by shift duration) so the system can enforce policy fairly.
Acceptance Criteria (Given/When/Then)
Given default rules (1×30 lunch, 2×15 personal), when I save updated caps, then new rules apply to future shifts and are audit-logged.


Given a 3-hour shift and eligibility “≥4h for lunch”, when staff tries to take lunch, then the system blocks with a clear reason.
That means:
If a staff member has a shift that's only 3 hours long, and the rule says lunch breaks are only allowed for shifts of 4 hours or more,
then when they try to schedule a lunch break, the system will not allow it and will show a clear message like:
“Lunch break not allowed for shifts under 4 hours.”


Given “one staff on break per location at a time”, when a slot is taken, then concurrent booking at the same location is prevented.


Definition of Done (DoD)
Settings UI + API; server-side validators
Dependencies: RBAC; Locations master.
Risks & Assumptions
Assumption: Rules are org-wide in MVP; per-location overrides later.
Test Data
Caps: Lunch=1×30; Personal=2×15; Eligibility: Lunch needs ≥4h shift.
Business Rules
Only Admin or assigned person can change break rules.


Tasks
FE: Settings forms.


BE: Rules model/CRUD; validation; auditing.


US-BKS2: Staff Break Picker (Self-Claim within Policy)
User Story
 As Staff, I want a visual timeline to self-claim break slots that comply with policy.
AC
Given my shift, when I open the Break Scheduler, then I see eligible slots; ineligible ones are disabled with tooltip (reason).
To simplify:
When I start my shift and open the Break Scheduler, I’ll see a list of available time slots.
The slots I’m allowed to take (based on break rules) will be clickable.
Any slots I’m not allowed to take will be grayed out, and if I hover over them, a tooltip will explain why (e.g., “Already at max personal breaks” or “Not eligible yet”).


Given I select a slot, when I confirm, then the slot locks and is visible to managers; double booking at my location is blocked.


Given I already took max personal breaks, when I attempt a new personal break, then the system will send a notification to admin for approval.


DoD
Timeline UI; slot locking; eligibility checks.
Dependencies: US-BKS1; published shift
Risks & Assumptions
Assumption: Desktop kiosk only


Test Data
Shift 10:30–19:30; lunch eligible 13:00–13:30; personal at 16:00 & 17:30.


Business Rules
One staff on break per location concurrently.


Tasks
FE: Timeline; slot state; tooltips.


BE: Check+lock endpoint; conflict prevention.


QA: Concurrency/race tests.


US-BKS3: Manager Override & Monitoring
User Story
 As a Manager, I want to override break distribution (approve out-of-policy exceptions) and monitor current/upcoming breaks.
That means:
If a staff member tries to take a break that isn’t allowed by the system (like a lunch break too early), the manager can manually approve it.
The manager can also monitor the live break schedule to know who’s on break and when they’ll return.

AC
Given a requested out-of-policy break, when I approve with a note, then the slot books and is audit-logged.
That Means
If a break request breaks the rules (e.g., lunch too early), and the manager approves it with a reason (e.g., "medical"),
→ the system allows the break, books it, and logs the override for tracking.


Given a break in progress, when I view dashboard, then I see who’s on break now/next.


DoD
Manager view; override action + note; audit entries.
Dependencies: US-BKS2.
Risks & Assumptions
Risk: Overrides abused → add weekly override report.


Test Data
Approve early lunch at 12:00 (note: “medical”).


Business Rules
Overrides require a reason; visible in reports.


Tasks
FE: Manager board, override modal.


BE: Override API; audit; report hook.


EPIC SWP — Shift Swaps & Covers
Goal: Controlled swaps & pickups, manager approval for trades; straight pickups allowed; expiry logic; compliance with split-shift policy.
US-SWP1: Request Swap (Trade with Teammate)
User Story
 As Staff, I want to propose a shift swap with a teammate so we can trade when needed (manager approval required).
AC
Given my published shift, when I request a swap with Person B, then a pending request is created and Manager sees it in Approvals.


Given the swap would create conflicts (overlap, hour cap), when submitted, then the system blocks with reason.


Given half-shift swaps, then they require Manager approval per policy.


DoD
Swap request UI; conflict checks; approval flow.
Dependencies: RBAC; schedule publish; conflict engine.
Risks & Assumptions
Assumption: Staff availability required to swap the shift.


Test Data
Trade Tue 10:30–19:30 (A ↔ B).
B should be available at this time slot.


Business Rules
Manager approval mandatory for swaps.
Tasks
FE: New swap request; status chip.


BE: Swap request model; validator; approvals.


US-SWP2: Expiry for Open Swaps
User Story
As the System, I must expire open swaps per rule (12–24h before shift OR 24h from post) to reduce last-minute chaos.
AC
Given a swap posted, when expiry rule matches, then the request auto-closes and staff are notified.


Given an expired request, when user tries to accept, then system blocks with reason.


DoD
Scheduler/worker for expiry; notifications; audit.
Risks & Assumptions
Assumption: Need to define a fixed choice between “12–24h before shift” vs “24h from post”.


Test Data
Post Mon 10:00 for Tue 10:30 shift → expires Mon 22:30.


Business Rules
Expired swaps cannot be re-opened.


Tasks
FE: Timer badges; disabled actions.


BE: Expiry worker; notifications.



EPIC PTO — PTO & Requested Time-Off Management
Goal: Balance tracking (earned/used/available), submission rules (15th cutoff for next month), accrual pause after 14+ days leave, manager approvals, and schedule blocking.
US-PTO1: Submit PTO/RTO (Full or Partial Day)
User Story
 As Staff, I want to submit full-day or partial-day PTO/RTO with a reason category so managers can decide fairly and it appears on the planner overlay.
AC
Given I choose date/time and reason (e.g., travel/leisure/sick/emergency), when I submit, then the request enters Pending and shows on the planner.


Given I submit after the 15th for the upcoming month, when I submit, then the system blocks with “Missed monthly cutoff”


Given my balance is insufficient for PTO, when I submit, then I see an error.


DoD
Request form; reason taxonomy
Dependencies: Balance engine; calendar overlay.
Risks & Assumptions
Assumption: Reasons taxonomy: Travel/Leisure/Sick/Emergency/Other as MVP.


Test Data
PTO: 2025-10-05 full day; Reason: Travel; Submit on 2025-09-12 (valid).


Business Rules
Approved PTO blocks scheduling during that time.
No PTO during first 3 months (probation period)
New employees do not earn or request PTO during their first 90 days


This is a strict block in the system
“They won’t have any PTO until after 3 months. That’s kind of the probation period.”
Accrual starts from Month 4 (Post-Probation)
After completing 3 months, they start earning PTO every month
PTO is added monthly, based on hours worked/scheduled


Tasks
FE: PTO form; overlay tag.


BE: PTO model; cutoff validator; balance calc.


US-PTO2: Manager Approve/Deny with Comments
User Story
 As a Manager, I want to approve/deny requests with notes; approvals should block scheduling; denials should notify staff.
AC
Given a pending request, when I approve, then the time is blocked on planner and staff are notified.


Given denial, when I provide a reason, then staff are notified and planner stays unblocked.


DoD
Approvals/denials; planner updates.
Dependencies: US-PTO1; notifications.
Test Data
Approve 2025-10-05 Travel for Alice.
Business Rules
Managers act only within their location scope.


Tasks
FE: Approval queue; filters.


BE: Action endpoints


QA: Scope checks.


US-PTO3: Accrual & Pause after 14+ Days Leave
User Story
 As the System, I must track PTO accrual and pause accrual if continuous leave exceeds 14 days.
AC
Given continuous leave ≥14 days, when day 15 starts, then accrual pauses until return.


Given return to work, when status flips, then accrual resumes next cycle.


DoD
Accrual job; pause/resume states; logs.


Dependencies: Attendance feed; payroll calendar.
Risks & Assumptions
Assumption: Accrual cadence: monthly on last day (MVP).


Test Data
Leave Sep 1–16 → pause accrual Sep 15 onward.
Business Rules
Accrual pause visible on balances screen.


Tasks
FE: Balance view indicator.


BE: Accrual engine; pause rules.


QA: Edge spans across months.


EPIC DSP — Dispute Resolution
Goal: Correct time/break errors only via disputes (no direct edits); clear types; audit-backed decisions.
US-DSP1: Raise Dispute (Missed/Incorrect/Late with Reason)
User Story
 As Staff, I want to raise a dispute on missed punch, incorrect time, or late punch with reason, so an Admin/Manager can review.
AC
Given a punch record, when I choose a dispute type and submit with a note/photo (optional), then the dispute enters the review queue.


Given a locked “missing clock-out”, when I dispute, then the record becomes editable only on approval.


DoD
Dispute form; types; attachments; notifications.


Dependencies: Attendance records; notifications to admin and manager
Risks & Assumptions
Assumption: One dispute per punch.


Test Data
Type: Missed Punch; Note: “Kiosk crashed”; Photo: optional.


Business Rules
Clock edits only via approved disputes.


Tasks
FE: Dispute modal; status chip.


BE: Dispute model; state machine; audit.


QA: Duplicate prevention.
US-DSP2: Admin/Manager Decision (Approve/Deny)
User Story
 As Admin/Manager, I want to approve/deny disputes with notes and have the system apply the correction automatically.
AC
Given an approved dispute, when I finalize, then the underlying punch/break record updates and is audit-logged.


Given a denial, when I finalize, then the original record remains and staff are notified.


DoD
Decision UI; audit; update hooks.
Dependencies: US-DSP1; audit; attendance.
Risks & Assumptions
Risk: Backlog grows → filters and SLA views.


Test Data
Approve “Clock-out missed → 19:31 set”.


Business Rules
Admin decision final; staff can escalate to Admin, if unsatisfied with Manager’s decision.


Tasks
FE: Decision modal; filters.


BE: Apply update; notify bus.


EPIC ATT — Attendance & Punctuality Scoring
Goal: Calculate attendance impact for Groove Score; apply only to published shifts; minimum 2 shifts/week required; weekday/weekend equal.
US-ATT1: Classify Attendance Outcomes
User Story
 As the System, I must classify each scheduled shift as On-Time, On-Time (Grace), Late, Absent (Unexcused) using policy windows (from Time Clock).
AC
Given grace = 5 min, when punch at start+4 min, then mark On-Time (Grace).


Given no punch by no-show threshold, then mark Absent (Unexcused).


DoD
Deterministic classifier; store policy_state.


Dependencies: Time Clock epics; published shifts.
Risks & Assumptions
Assumption: No-show threshold configured in settings (default 30 min).


Test Data
Start 10:30; punch 10:34 → On-Time (Grace).


Business Rules
Only published shifts counted.


Tasks
BE: Classifier service; unit tests.


US-ATT2: Compute Weekly Attendance Score
User Story
 As the System, I want to compute a weekly attendance score (late/absent penalties applied equally for weekdays/weekends) and publish to Groove Score.
AC
Given <2 shifts in a week, when computing, then no score is generated for that week.


Given classification data, when score is computed, then it posts to GS with details.


DoD
Score job; GS publish.
Dependencies: US-ATT1; GS Sync.
Risks & Assumptions
Assumption: Weighting formula tuned later in Settings.


Test Data
5 shifts: 1 Late, 0 Absent → score X.


Business Rules
Week is Mon–Sun (aligned with payroll).


Tasks
BE: Job + formula; GS event.


QA: Boundary weeks.


EPIC BON — Bonus Rules Engine
Goal: Attendance-driven bonuses (weekly/monthly/milestone), proration for part-time, real-time staff progress.
US-BON1: Configure Bonus Programs
User Story
As an Admin, I want to set up bonus programs that reward staff based on their weekly, monthly, or milestone attendance scores, and I want bonuses to be prorated for part-time staff.
That means:
You can define:
Bonus type (weekly/monthly/milestone)
Minimum attendance % required
Bonus amount
If you change the rules mid-cycle (e.g., raise threshold), the new rules start next week/month, and all changes are tracked.

AC
Given a new program, when I set thresholds, then it saves and appears in the list.
Example:
If I create a new bonus program,
→ I can define rules (e.g., “95%+ attendance = $25”) and save it.
→ It shows up in the list of active bonus programs.


Given changes mid-period, then they apply next period with audit.
Example:
If I edit a program mid-period,
→ the changes do not affect the current period.
→ They apply starting next week/month, and an audit entry is saved.


DoD
Rules model; UI; audit.
Risks & Assumptions
Assumption: Currency + payroll export handled in PAY epic.


Test Data
Weekly: ≥95 attendance → $25.
Business Rules
Programs versioned; historical calc preserved.


Tasks
FE: Config UI.


BE: Rules engine; versioning.


US-BON2: Staff Bonus Progress
User Story
 As Staff, I want to see my real-time progress toward bonuses.
AC
Given current attendance score, when I open “My Bonus”, then I see progress bars and projections.


Given disputes pending, then a banner notes “bonus may change”.


DoD
Progress UI; read-only calc
Risks & Assumptions
Risk: Over-promising—add “subject to disputes/payroll approval”.


Test Data
Score 92/100 → 92% toward $25.
Business Rules
None beyond visibility.


Tasks
FE: Progress widgets.


BE: Read models.
EPIC PAY — Payroll Sync
Goal: Export final hours, breaks, and bonuses weekly (Mon–Sun); disputes close by Tuesday 11:59 PM; lock approved records; bonuses as separate line item; CSV/API.
US-PAY1: Close Payroll Window & Lock Records
User Story
 As an Admin, I want to close the payroll window (Tue 11:59 PM) and lock approved records for export.
AC
Given it’s Tuesday 23:59 local, when I click Close Period, then approved records lock; open disputes are carried to next period.


Given locked status, when a new dispute is approved, then correction flows to next export.


DoD
Period close job; lock flags
Dependencies: Disputes; attendance finalization.
Risks & Assumptions
Assumption: Single pay calendar (Mon–Sun).


Test Data
Period Aug 25–31; close Sep 2, 23:59.
Business Rules
Locked items immutable except via next-period adjustments.


Tasks
FE: Close period UI; warnings.


BE: Lock+rollover logic.


QA: Edge disputes.


US-PAY2: Generate Payroll Export (CSV/API)
User Story
 As an Admin, I want to export final hours, breaks, and bonus line items as CSV or via API.
AC
Given a closed period, when I export, then I get a CSV with hours/breaks/bonus lines per staff.


DoD
CSV schema.
Dependencies: PAY1; BON; ATT.
Risks & Assumptions
Assumption: Mapping to payroll provider configured in Settings.


Test Data
CSV with “Bonus” as separate line.


Business Rules
Export only locked data.


Tasks
FE: Export UI + history.


BE: CSV/API producer; webhook.


QA: Contract tests.


EPIC GSS — Groove Score Sync
Goal: Feed ShiftIQ → Groove Score with reliable payloads; alert on failures.

US-GSS1: Publish Attendance Events to GS
User Story
 As the System, I must publish events (user_id, shift_id, punch_in/out, break_time, status, dispute_flag) to Groove Score.
AC
Given a classified shift, when saved, then a GS event is queued.


DoD
Event schema; retry; alert on fail
Risks & Assumptions
Assumption: GS endpoint available and versioned.


Test Data
status=“On-Time (Grace)”, dispute_flag=false.


Business Rules
Only published shifts produce GS events.


Tasks
BE: Producer & backoff; dashboard.


QA: Failure paths.


EPIC RPT — Reports & Analytics
Goal: Actionable insights: PTO usage, missed punches, dispute approvals, payroll summaries, GS trends; filters by week/pay period/custom; scoped access.
US-RPT1: PTO Usage Report
User Story
 As Manager/Admin, I want PTO usage by staff/location with balances and trends.
AC
Given filters (week/pay period/custom), when I run the report, then I see PTO taken/remaining per staff.


Given Manager role, then I see only my location/team.


DoD
Grid + CSV; permission filters.
Dependencies: PTO; RBAC.


Test Data
Week of Sep 1–7.


Business Rules
Admin sees cross-org.


Tasks
FE: Filters; CSV export.


BE: Report query; pagination.


US-RPT2: Missed Punches & Dispute Outcomes
User Story
 As Manager/Admin, I want a report of missed punches and dispute approvals/denials by period.
AC
Given a date range, when I run, then I see counts and details by staff; export available.


Given filters (location/role), then the view updates accordingly.


DoD
Grid; CSV; drill-down to record.


Test Data
12 missed punches; 8 approved.


Business Rules
None beyond RBAC.


Tasks
FE: Table + drill-down.


BE: Aggregations.

US-RPT3: Payroll Summary & GS Trends
User Story
 As Admin, I want payroll summary and Groove Score trendlines per location/brand.
AC
Given pay period view, when I select a location, then I see total hours, bonuses, and GS trend.


Given export, when I click CSV, then I get the same data.


DoD
Cards; CSV; RBAC.


Risks & Assumptions
Assumption: Overtime calc is Phase 2.


Test Data
Mon–Sun period; bonuses as separate line.
Business Rules
Admin full access; Manager scoped.


Tasks
FE: Charts; CSV.


BE: Summary endpoints.


QA: Data integrity vs exports.



EPIC RBA — User Roles, Permissions, Audit & Data Retention
Goal: Enforce least-privilege access; keep audit trails; apply security best practices.
US-RBA1: Role-Based Access Control Matrix
User Story
 As the System, I must enforce RBAC for Admin/Manager/Staff across scheduling, PTO, disputes, reports.
AC
Given my role, when I access a restricted action, then I’m allowed/denied per matrix.


Given a scope (brand/location), when I’m Manager, then I see only my scope.


DoD
Policy middleware; matrix tests.
Dependencies: Identity; brands/locations.
Risks & Assumptions
Assumption: UnityIQ provides identity and role.


Test Data
Admin vs Manager vs Staff test accounts.
Business Rules
Staff cannot access other users’ data.


Tasks
FE: Guard routes; hide controls.


BE: Policy middleware; scopes.


QA: Permission matrix.


US-RBA2: Immutable Audit Logs & Retention
User Story
 As an Admin, I want append-only audit logs (who/when/what) for critical actions and a retention policy.
AC
Given state changes (publish, approve, dispute decisions), then audit entries are written.


DoD
Append-only log store; retention job.
Dependencies: All modules.
Risks & Assumptions
Assumption: 1-year retention MVP; configurable later.


Business Rules
Logs immutable; only Admin can export.


Tasks
BE: Log writers; retention.


FE: Audit viewers.


QA: Tamper tests.


EPIC NOT — Notifications & Alerts
Goal: Deliver key events (publish, swap approvals, late/no-show, payroll/export status) to managers/staff

US-NOT1: Staff & Manager Notifications
User Story
 As the System, I want to notify stakeholders about schedule publishes, swaps, PTO decisions, disputes, and payroll/export events.
AC
Given a schedule publish, then staff receive “My Shifts updated”.


Given swap decision, then both parties & manager get notified.
DoD
Notification service; channels (email/in-app)


Dependencies: All epics.
Test Data
Publish week; approve swap
Business Rules
Respect RBAC scope.
Tasks
BE: Notifier; Slack webhook.


FE: Notification center.



EPIC CFG — System Settings
Goal: Centralize org settings: grace windows, no-show threshold, swap expiry mode, pay calendar, Slack webhook, reasons taxonomy.
US-CFG1: Attendance & Grace Settings
User Story
 As an Admin, I want to configure early clock-in and late grace windows and no-show threshold.
AC
Update early (≤5m) and late (≤5m) grace; apply to new punches.


Set no-show threshold (default 30 m); affects ATT classifier.


DoD
Settings UI; cached; audit.


Risks & Assumptions
Assumption: Org-level only in MVP.


Test Data
Early=5, Late=5, No-show=30.
Business Rules
Only Admin can edit.


Tasks
FE/BE/QA as per standard settings.




------------

As per latest updated document:
https://docs.google.com/document/d/1pY8DSCjFtWo3PUpYnW7WmiOaMG05Vp-0y_mdGNH56mQ/edit?tab=t.0 
EPIC GS1 — Weekly Groove Score Engine & Breakdown
Goal: Calculate one weekly Groove Score per staff member by combining Attendance, Task Efficiency, and Customer Reviews; finalize every Sunday 11:59 PM; show a clear breakdown to staff and managers; handle recalculation after approved disputes.
One unified weekly score per user (even across brands/locations).


Weekly scores finalize on Sunday 11:59 PM.


Minimum 1 completed shift required for scoring that week.



Customer Reviews are part of the live Groove Score calculation from MVP itself.
The system aggregates all 5-star Google Reviews per location per week, and all staff scheduled at that location during that week share the same review score as part of their weekly Groove Score.
This category contributes 20% of the final score, and even a single non–five-star review reduces the percentage proportionally.


US-GS1: Compute Weekly Groove Score (System) 
User Story
 As the System, I want to compute a weekly Groove Score for each staff member from four categories (Attendance 30%, Punctuality 30%, Customer Reviews 20%, Task Efficiency 20%) so performance is measured consistently.
Acceptance Criteria (Given/When/Then)
Given a staff member has ≥ 1 completed shift in the week, when the week ends (Sun 23:59 local), then the System computes and stores their one unified weekly score (aggregating across all brands/locations they worked in that week).


Given a staff member has 0 shifts, when the week ends, then they are excluded from that week’s score and leaderboard.


Given the four categories, when the week ends, then the System:


computes Attendance % = Scheduled Days Worked ÷ Scheduled Days,


computes Punctuality % = On-Time Clock-ins ÷ Total Shifts,


computes Customer Reviews % (location-wide) = 5-Star Reviews ÷ Total Reviews (that week), shared by all staff scheduled at that location that week, computes Task Efficiency % per spec (see US-GS3), and calculates Groove Score % = Σ(weight × category %) (rounded).


Given a staff member worked at multiple locations in a week, when applying the Customer Reviews category, then the System uses a location-aware blend (see US-GS4) to include review percentages from each location they worked at that week in their unified weekly score.


Definition of Done (DoD)
Provisional nightly calc (02:00) updates in-week widgets; finalization job runs Sun 23:59 with location-aware aggregation.


Read API for Staff/Manager dashboards.


Audit entry for each weekly run.


Dependencies
 ShiftIQ attendance & punches; TAMZEE task outcomes; Google Reviews uploaded by each user; brand/location mappings.
Risks & Assumptions
Assumption: For staff working at multiple locations, Customer Reviews are averaged across locations, weighted by how many days they worked at each location that week.
Test Data
Staff A: 2 completed shifts → Score computed.


Staff B: 0 shifts → No score.


Business Rules
Only published time/task events are used.


Tasks Breakdown
Backend: Score calculator; nightly + weekly schedulers; location-aware average; persistence; audit.


QA: Week boundary; zero-shift exclusion; multi-location average.



US-GS2: Attendance & Punctuality Contributions (ShiftIQ → Score) — UPDATED
User Story
 As the System, I want to compute Attendance % and Punctuality % each week from ShiftIQ so they can be weighed into Groove Score.
Acceptance Criteria
Given ShiftIQ provides schedules and punches, when the week ends, then compute and store:


Attendance % = Scheduled Days Worked ÷ Scheduled Days,


Punctuality % = On-Time Clock-ins ÷ Total Shifts.


Given the ≥1 completed shift rule, when a user has <1 completed shift, then Attendance/Punctuality contributions are not computed for that week.


DoD
Both metrics computed and stored alongside the weekly score
Dependencies
 ShiftIQ schedules & punches.
Risks & Assumptions
Assumption: Week timezone = Location timezone.


Test Data
4 shifts, 3 on-time → Punctuality 75%; Scheduled 5 days, worked 4 → Attendance 80%.


Business Rules
Week closes Sun 23:59.


Tasks
BE: Mapper from ShiftIQ → normalized Attendance & Punctuality.


QA: Edge cases: partial weeks, single shift.


US-GS3: Task Efficiency Contribution (TAMZEE → Score)
User Story
 As the System, I want to compute Task Efficiency % using pass-day logic with task scope (individual vs shift) so results are fair.
Acceptance Criteria
Given each task has a scope (individual | shift), when aggregating by day, then a staff member’s day is Pass only if all tasks applied to them that day (their individual tasks + any shift-scoped tasks during their on-shift time) are completed truthfully.


Given pass-day results across the week, when computing the metric, then Task Efficiency % = Pass Days ÷ Days Worked × 100


Given a false completion, when detected, then create a ScoreEvent (−5%), log a Write-Up, and flip the day to Fail for all affected users.


DoD
Nightly grouper by day & scope; join with punches for shift-scoped coverage; ScoreEvent writer; audit trail.


Dependencies
 TAMZEE task outcomes; ShiftIQ punches
Risks & Assumptions
Open item: handling partial-shift tasks where staff overlap mid-task


Test Data
Worked 4 days: pass-days=3 → Task Efficiency 75%; one false completion → ScoreEvent −5%.


Business Rules
No partial task credit; failures always log a reason (from manager review).


Tasks
BE: Aggregator; scope application; false completion hooks.


QA: Overlap & concurrency cases.


US-GS4: Customer Reviews Contribution (Google Reviews → Score)
User Story
 As the System, I want to compute the Customer Reviews % each week from the Google Reviews CSV (Uploaded by manager) so it contributes 20% to the weekly Groove Score.
Acceptance Criteria
Given the weekly Google Reviews CSV per location, when the week ends, then compute Reviews % (location-wide) = 5-Star Reviews ÷ Total Reviews for that week and store it for that location-week.


Given staff scheduled at a location that week, when computing their scores, then assign that location’s Reviews % as their review contribution for the days they worked there.


Given a staff member worked at multiple locations in the week, when deriving their unified weekly score, then average the per-location Reviews % using a work-weight (e.g., by days worked at each location) and include the averaged value in their weekly Groove Score.


Given review content (text, rating, timestamps), when ingesting, then duplicate data and persist for reporting and audit. (Note: Per-mention “$5 review” awards are handled in Bonus Engine, not here.)


DoD
Reviews ingestion; weekly location-level ratio; multi-location average for personal score; read API.


Dependencies
 Google Reviews CSV; location utilities.
Risks & Assumptions
Assumption: Default average weight = days worked.


Test Data
L1: 9 five-star / 10 total → 90%; L2: 5/5 → 100%; Staff worked 2 days at L1, 3 at L2 → blended ≈ 96%.


Business Rules
A single non-five-star review reduces the percentage proportionally.


All staff at a location share the same weekly Reviews % for that location.


Tasks
BE: CSV/API ingestion; dedupe; location-week rollups; blending logic.


QA: Duplicate; missing/late review entries.


Short Summary of GS-5 to GS-7:
GS5 — Reports & Exports
US-RE6 (Payroll Export — Bonus Line Items):
Replace: “disputes close Tues 11:59 PM” → “disputes close Wed 11:59 PM”


Add/confirm: “Payroll export runs Friday 08:00 (org/location timezone). Approvals after this time roll to the next export.”


GS6 — Disputes & Recalculation
US-DQ1 (Staff Raises Dispute):
Add: “Dispute window: Mon–Wed (closes Wed 11:59 PM local) for the week that finalized Sunday 11:59 PM.”


US-DQ2/US-DQ3 (Manager/Admin decisions):
Add note: “Approvals completed before Friday 08:00 affect the current payroll; later approvals roll to next payroll.”


US-DQ4 (Recalculation Pipeline):
Replace: “Payroll cadence Mon–Sun; disputes close Tue 11:59 PM” → “Payroll cadence Mon–Sun; disputes close Wed 11:59 PM; payroll export Fri 08:00”


Keep: “After lock, changes roll into next export.”


GS7 — System Settings & Admin Control
US-SET3 (Finalization & Dispute Window):
Replace: “dispute window end = Tue 11:59 PM” → “dispute window end = Wed 11:59 PM”


Add/confirm: “Payroll export time = Friday 08:00; approvals after export roll to next cycle.”
What this means in practice
Staff can file disputes starting Monday 12:00 AM through Wednesday 11:59 PM for the week that locked on Sunday.
Managers/Admins should aim to review/approve by Thursday to safely meet the Friday 8:00 AM payroll export.
If an approval lands after Friday 8:00 AM, the score still updates historically, but the payout (if any bonus is impacted) goes out in the next cycle.
US-GS5: Weekly Finalization & Recalculation on Approved Disputes 
User Story
 As the System, I want to finalize scores at Sun 23:59 and recalculate a user’s weekly score if a related event dispute (attendance/task) is later approved.
Acceptance Criteria
Given the weekly cutoff, when time reaches Sun 23:59, then scores finalize and are audit-logged; provisional nightly values stop overwriting.


Given a dispute is approved (events only), when the correction posts, then recompute the affected week and update the stored score.


Given mid-week disputes are disallowed, then disputes are accepted only after weekly finalization.


DoD
recalculation pipeline.


Dependencies
 Dispute decisions; event stores; score calculator.
Risks & Assumptions
Only event disputes affect recalculation.


Test Data
Approve “missed punch” for Week 36 → recompute Staff A score.


Business Rules
Weekly disputes window & export lock managed elsewhere (Settings/Bonus/Payroll).


Tasks
BE: Finalization scheduler; recompute service; audit.


QA: Recalc correctness; idempotency.



US-GS6: Staff “My Groove Score” (Breakdown & History)
User Story
 As Staff, I want to see my weekly score, the category breakdown (Attendance, Punctuality, Customer Reviews, Task Efficiency), and my last 8 weeks so I can track progress.
Acceptance Criteria
Given the current week is finalized, when I open My Groove Score, then I see my total % plus four sub-scores with the correct weights; Customer Reviews shows the location-aware value used for me that week (with a tooltip explaining location-wide reviews).


Given I open History, when I scroll, then I see up to 8 prior weeks with eligibility (scored/not scored).


Given I worked at multiple locations that week, when I expand details, then I see the per-location review % and the average value applied to me.


DoD
Responsive UI; tooltips for location-wide reviews; link to disputes page for that week.


Dependencies
 US-GS1–GS5 APIs.
Risks & Assumptions
No per-day drilldown in MVP.


Test Data
Week 36: 84% total (Att 92%, Punc 80%, Reviews 96%, Task 75%).


Business Rules
Staff see only their own data.


Tasks
FE: Score card, breakdown bars, 8-week trend; review tooltip; multi-location panel.


BE: Read API (by user/week).


QA: Access; multi-location cases.


US-GS7: Manager Score Breakdown (Team, Brand, Location Filter)
User Story
 As a Manager, I want to view my team’s weekly scores and drill down by Brand/Location to coach low performers.
Acceptance Criteria
Given my assigned locations, when I filter by Brand or Location, then the grid updates with scoped staff scores for the selected week.


Given a staff row, when I open details, then I see category breakdown including Attendance %, Punctuality %, Task Efficiency %, and Customer Reviews % (with a note: location-wide; show per-location review % if the staff worked at multiple locations).


DoD
Filterable grid; drill-down; CSV export


Dependencies
 RBAC & location mapping; score APIs.
Risks & Assumptions
Admin can view all brands/locations.


Test Data
Brand=“Craft Therapy Network”, Location=“Main St.” → 12 staff listed.


Business Rules
Manager scope enforced by assigned locations.


Tasks
FE: Filters (brand, location, week), sortable grid, CSV export.


BE: Scoped query; pagination.


QA: Scope matrix; filter combos.



US-GS8: Unified Score Across Locations (Correct Aggregation)
User Story
 As the System, I must aggregate a staff member’s events and category inputs across all locations/brands they worked in to produce one weekly score.
Acceptance Criteria
Given a user works in 2+ locations in the same week, when we compute the score, then their one weekly score includes all qualifying events from those locations (attendance, punctuality, task days, and the blended location-wide Reviews %).


Given manager views by location, when filtering, then they see only staff within scope, but each user’s score remains unified (with a per-location panel available in the details).


DoD
Aggregation covers cross-location events; tests prevent double counting.


Dependencies
 Location mapping; US-GS1; reviews location rollups.
Risks & Assumptions
Staff→location assignments kept current.


Test Data
Staff A works 2 shifts at L1, 1 at L2 → one score (with blended review %).


Business Rules
Score is unified regardless of number of locations.


Tasks
BE: Cross-location roll-up; unit tests.


QA: Multi-location scenarios.



Summary of what changed from previous User story that we created.
Reviews are live (20%) in MVP and location-wide; stories updated to compute, display, and blend for multi-location staff.


Punctuality is now explicitly its own category (30%) alongside Attendance (30%), Task Efficiency (20%), and Reviews (20%).


Task Efficiency now follows pass-day logic with task scope and false completion = −5% ScoreEvent + Write-Up.






























EPIC GS2 — Bonus Engine (Dynamic Rules, Claims, Automation & Payouts)
Goal: Let Admins create bonus programs with flexible rules (type, amount, trigger timing, payout timing, conditions). Support automatic awards from system data (Groove Score, Loyal Member boxes), and manual claims with evidence for anything not yet automated (e.g., Google review mentions). Show progress to staff, route approvals to managers, and feed payroll as separate line items.
Built-in rule templates (configurable examples):
High Weekly Score Bonus — $50; trigger: weekly finalization; condition: Groove Score ≥ 95%; payout: Friday payroll.


Perfect Streak Bonus — $50; trigger: when 4 consecutive 100% weeks occur within the same calendar month; payout: end-of-month payroll.


Google Review Mention Bonus — $5 per review; trigger: on claim approval (staff uploads screenshot/name match); payout: Friday payroll.


Membership Box Signup Bonus — $5 per box; trigger: real-time event from Loyal Member when a paid box is attributed to staff; payout: Friday payroll.


Custom Milestone Bonus — amount & conditions defined by Admin (e.g., 20 shifts/month, ≥10 reviews/month).


Part-Time Prorated Bonus — system scales rule amounts by FTE ratio where enabled.
 (These are editable rule records; Admin can add more at any time.)


US-BE1: Create / Edit / Archive Bonus Rules (Dynamic)
User Story
 As an Admin, I want to create/edit/disable bonus rules with fields for Bonus Type, Amount (fixed or formula), Trigger Timing (real-time / weekly / monthly / milestone), Payout Timing (weekly Friday / end-of-month / custom), and Trigger Conditions, so programs are flexible and scalable.
Acceptance Criteria
Given I open “New Bonus Rule”, when I enter Type, Amount, Trigger Timing, Payout Timing, and Conditions, then the rule saves as Draft with Effective From (default = today) and optional End Date.


Given a Draft rule, when I toggle Active, then it starts evaluating from Effective From; disabling moves it to Inactive and stops future awards.


Given scope options (Brand/Location/Role/Employment Type), when I choose scope, then only eligible users are evaluated under that rule.


Given built-in templates (High Weekly Score, Perfect Streak, Review Mention, Membership Box), when I pick one, then default fields pre-fill and I can edit amounts, caps, and scope.


Given caps (per-user per-period and global), when I set them, then awards stop once caps are reached and the report shows “Cap hit”.


Definition of Done (DoD)
CRUD UI + APIs; validation; versioned rule config; scope targeting; caps; audit log (who/when/diff).

 Dependencies: RBAC & Brand/Location mapping; weekly finalization time; payroll cadence.
 Risks & Assumptions


Assumption: Reviews aren’t auto-scraped; use staff claims with screenshot in MVP for mentions.
 Test Data
Rule: “High Weekly Score” → Amount $50; Trigger weekly; Payout Friday; Condition GS ≥ 95%.
  Business Rules
Changes apply prospectively; past awards remain unless explicitly reversed by Admin.
 Tasks
FE: Rule form (fields, scope, caps), list with state, duplicate rule.


BE: Rule model + versioning; validator; scope filter; audit.



US-BE2: Staff Bonus Claim 
User Story
 As Staff, I want to submit a bonus claim (e.g., Google Review mention) with screenshot/evidence, so my manager can approve it and I get paid.
Acceptance Criteria
Given an Active rule marked “Manual/Claim-based”, when I click Claim Bonus, then I select the rule, add notes + upload image/PDF proof, and submit → status Pending.



Given a rule with a time window (e.g., claim within 14 days of review), when I submit late, then I’m blocked with reason.


Given claim statuses, when Manager approves/denies with a note, then my claim updates to Approved/Denied and I’m notified.


DoD
Claim UI; file upload; duplicate guard (hash + text heuristics); SLA window check; notifications; audit.

 Dependencies: US-BE1; Approvals queue; Notifications.
 Risks & Assumptions


Risk: Fraudulent images → allow Manager to reject.
 Test Data
Claim: “Google Review – 5★ ‘Kayla was amazing’ (screenshot)” → Pending.
  Business Rules
Claims respect caps and scope; only visible rules can be claimed.
 Tasks


FE: “Claim Bonus” flow; my claims list.


BE: CreateClaim API; file store; duplicate check.


US-BE3: Manager Approvals & Queue (Bulk + Notes)
User Story
 As a Manager, I want an approvals queue to review evidence and approve/deny claims (with notes) so valid bonuses are paid.
Acceptance Criteria
Given my Location scope, when I open Bonus Approvals, then I see Pending claims (rule, staff, evidence preview, date).


Given I Approve, then an award record is created, the claim closes as Approved, and staff are notified.


Given I Deny, then I must enter a reason; staff are notified.


Given many claims, when I bulk approve/deny, then all actions succeed with audit entries.


DoD
Queue list; preview; bulk actions; notifications; audit.


 Dependencies: US-BE2; RBAC.
 Risks & Assumptions


Assumption: Manager sees only assigned locations.
 Test Data


10 review claims → bulk approve 8, deny 2.
 Business Rules


All decisions are audit-logged; Admin can override later.
 Tasks


FE: Queue UI; evidence modal; bulk toolbar.


BE: Approve/Deny APIs; audit writer.


US-BE4: Automatic Awards 
User Story
 As the System, I want to auto-award bonuses when rule conditions are met by first-party data (Groove Score, Loyal Member), without manual steps.
Acceptance Criteria
Given weekly finalization (Sun 23:59), when a staffer’s Groove Score ≥ 95%, then create a $50 award for that week (if the rule is active).


Given a Perfect Streak rule, when a user achieves 4 straight 100% weeks in the same calendar month, then create a $50 monthly award.


Given a Membership Box Signup event from Loyal Member tagged to a staff referrer, when a paid box posts, then create a $5 award per box in real-time.


Given an Inactive rule or cap reached, when condition occurs, then no award is created and a skipped reason is logged.


DoD
Evaluators for weekly, monthly, real-time; event consumers; idempotency; audit.

 Dependencies: GS weekly scores; Loyal Member event feed; calendar utility.
 Risks & Assumptions


Assumption: Boxes feed provides paid + staff attribution reliably.
 Test Data


Week W36: GS=96% → $50 award; Month Aug: weeks 1–4 = 100% → monthly $50.
  Business Rules


Awards stamped with source rule + period; one award per person per rule per period unless rule allows multiples.
 Tasks


BE: Evaluators; event listeners; dedupe keys; audit.



US-BE5: Proration Engine for Part-Time
User Story
 As the System, I want to prorate eligible bonuses for part-time staff so payouts reflect scheduled hours.
Acceptance Criteria
Given a rule has Prorate = ON, when a staffer’s FTE ratio for the period is 0.5, then a $50 award becomes $25.


Given a per-event rule like “$5 per review/box”, when Prorate = ON, then the per-event amount is not prorated unless explicitly configured.


DoD
FTE ( Full-Time Equivalent) ratio calculator (scheduled ÷ full-time baseline); amount scaler; per-rule override; audit.

 Dependencies: ShiftIQ scheduled hours feed.
 Risks & Assumptions


Assumption: Full-time baseline = 40h/week (configurable).
 Test Data


Staff at 20h → FTE 0.5 → $50 → $25.

 Business Rules


Proration happens at award time; stored as (base, factor, final).
 Tasks


BE: Proration service; config; unit tests.


QA: Edge cases: zero hours; cap + proration.


US-BE6: Bonus Preview & History (Staff)
User Story
 As Staff, I want to see earned/expected bonuses by week/month, with statuses and reasons, so I can track my earnings.
Acceptance Criteria
Given my Bonus page, when I choose a period, then I see Awards (Approved/Pending/Denied/Exported) with rule name, amount, and reason.


Given rules that evaluate weekly, when the nightlies run, then I see a Preview tile (“You’re on track for $50 for GS ≥ 95%”).


DoD
My bonuses grid; period filter; preview badges; CSV export (my data).
 Priority & SP: Medium, 5
 Dependencies: US-BE1/4; weekly provisional calc.
 Risks & Assumptions


Assumption: Preview is informational; real award only on trigger.
 Test Data


Week W36: Preview $50 → after finalization: Awarded $50.
 Business Rules


Staff can see only their own awards/claims.
 Tasks


FE: My bonuses page; filters; CSV.


BE: MyAwards/MyClaims endpoints.



US-BE7: Payout Timing Orchestration & Payroll Mapping
User Story
 As the System, I want to route awards to the correct payout window (weekly Friday payroll or monthly EOM), and keep an export status history.
Acceptance Criteria
Given weekly awards, when Friday payroll export runs, then all Approved awards from the prior Mon–Sun cycle are packaged as separate line items.


Given monthly awards, when EOM export runs, then monthly awards are included.


Given a closed export, when late approvals arrive, then they roll into the next export window; Export History shows each run and retry status.


DoD
Award → Payout window assignment; export flags (Pending/Exported/Failed); history screen.

 Dependencies: GS5 (Reports & Exports) pipeline.
 Risks & Assumptions


Assumption: Admin can re-run exports with warning on locked periods.
 Test Data


Weekly: 3 awards → 3 CSV line items. Monthly: 1 streak award → EOM CSV.
 Business Rules


Only Approved awards are exportable.
 Tasks


BE: Window router; export status model.


FE: Export history tab.


QA/DevOps: Retry/DLQ tests, monitoring.



US-BE8: Rule Versioning, Audit & Caps Report
User Story
 As an Admin, I want full audit history for rule changes and a Caps Report so I can govern usage.
Acceptance Criteria
Given any rule change, when saved, then record who/when/old→new and show diffs.


Given the Caps Report, when I select a period, then I see where caps stopped awards (users, rules, counts).


DoD
Append-only audit log; diff viewer; caps aggregation.
  Dependencies: US-BE1.
 Risks & Assumptions


Assumption: Retention = 12 months (configurable in Settings).
 Test Data


Edit “High Score” $40→$50 logs diff; Caps report shows 12 skips.

 Business Rules


Admin sees all; Managers see their scope.
 Tasks


FE: Audit viewer; caps table.


BE: Audit writer; caps rollup.



Epic-wide Business Rules
Weekly finalization: Sun 23:59; Friday payroll export; separate bonus line items.


Manual claims for review mentions (with screenshot) in MVP; automatic where data is present (GS, boxes).


RBAC & scope: Managers limited to assigned locations; Admin global.



Why this change from the initial U-S 
Client asked for dynamic creation of bonuses with type/amount/frequency/conditions (not fixed list).


Staff claim + screenshot for Google reviews; managers approve/deny in a queue.


Automate whenever possible; manual only when unavoidable (e.g., review scraping).




EPIC GS3 - Leaderboards & Manager Coaching
Goal: Give Managers/Admins a clear, filterable Leaderboard and Team Coaching view to spot top/bottom performers, see (Attendance, Punctuality, Task Efficiency, Customer Reviews (location-wide, 20%)), and export/share for action. Filters by Brand, Location, Week/Date range and respect RBAC (Managers limited to assigned locations; Admin sees all).
 Managers get Brand/Location/Week filters, top & bottom performers, staff needing coaching, visibility of failure reasons and review ratios. Inactive staff (0 shifts) are excluded; one unified weekly score per user (minimum 1 completed shift).

US-LB1: Leaderboard with Brand/Location/Week Filters
User Story
As a Manager, I want a Leaderboard filtered by Brand, Location, and Week/Date range so I can see my team’s performance and compare results.
Acceptance Criteria (Given/When/Then)
Given I’m scoped to specific locations, when I open Leaderboard, then I see only staff for my assigned locations.


Given filters for Brand/Location/Week, when I change any filter, then the grid updates to show the correct staff and scores.


Given a week where staff have 0 completed shifts, when I view the leaderboard, then those staff are excluded for that week.


Given users who worked across multiple locations/brands, when I view the week, then each user appears once with their unified weekly score (categories shown: Attendance, Punctuality, Task Efficiency, Customer Reviews).


Definition of Done (DoD)
Grid with server-driven pagination/sort; brand/location/week filters; RBAC scoping enforced.


Unified weekly score per user; inactive/no-shift users omitted for the selected period.



 Dependencies: GS1 (weekly scores finalized), RBAC/location mapping.
 Risks & Assumptions
Assumption: “Week” aligns with Sunday 11:59 PM cutoff used by GS1.
 Test Data


Week 36, Brand=A, Location=L1 → shows only assigned staff with ≥1 shift.
  Business Rules
Managers see only assigned locations; Admin sees all.
 Tasks Breakdown
Frontend: Leaderboard grid; filters (brand/location/week); empty states.
Backend: Scoped leaderboard query; pagination/sort; RBAC checks.
QA: Scope matrix; filter combinations; no-shift exclusion.
Designer: Table layout, filter affordances.



US-LB2: Top & Bottom Performers Badges
User Story
 As a Manager, I want to quickly identify top and bottom performers for a selected period so I can recognize strengths and coach weak areas.
Acceptance Criteria
Given leaderboard data, when I select a week, then the grid highlights the Top and Bottom.


Given ties at thresholds, when multiple users share the cutoff score, then include all tied users in the segment.


Given I change filters (brand/location/week), then segments recompute for the filtered.


DoD
Segmenting logic on the server; badges rendered in grid; tooltip with rank & score.



 Dependencies: US-LB1 (filtered list).

 Test Data
50 staff → top/bottom 5 or 10 staff
 Business Rules
Ranking uses unified weekly score.
 Tasks
FE: Badge UI with tooltip.


BE: Segmenting endpoint; tie handling.




US-LB3: Coaching Focus — “Why” Breakdown (Attendance, Punctuality, Tasks, Reviews 20%)
User Story
 As a Manager, I want to click a staff row and see why their score looks the way it does (Attendance %, Punctuality %, Task Efficiency %, and Customer Reviews %, which is location-wide) so I can coach effectively.
Acceptance Criteria
Given I open a staff detail drawer, when viewing the selected week, then I see:


Attendance % for the week,


Punctuality % for the week,


Task Efficiency % with failure reasons list (no partial credit in v1), and


Customer Reviews % actually used in the user’s score (with a tooltip: “Location-wide; all staff scheduled here share this weekly ratio”).


Given the user worked across multiple locations in the week, when I open Reviews, then I see per-location review ratios (5★/total) and the average value applied to the user.


Given task failures, when I expand Reasons, then I see each failure with timestamp and manager-entered reason.


DoD
Staff detail drawer with 4 sections: Attendance, Punctuality, Tasks (fail reasons), Reviews (ratio + blended note); links to disputes/events.

 Dependencies: GS1 data; TAMZEE fail reasons; Reviews rollup.
 Risks & Assumptions
Assumption: Reviews come from the Google Reviews CSV; text is available for spot checks.
 Test Data
80% Attendance; 78% Punctuality; 2 failed tasks (reasons); Reviews L1=90%, L2=100% → Average 96%.
 Business Rules
No partial task credit; failures must have a visible reason.
 Tasks
FE: Drawer UI; tabs; lazy-loading.


BE: Detail API aggregating attendance/punctuality/tasks/reviews.


QA: Data correctness; multi-location reviews.



US-LB4: “Staff Needing Coaching” Shortlist
User Story
 As a Manager, I want a shortlist of staff needing coaching (low score, negative trend, repeated failures) so I can prioritize 1:1s.
Acceptance Criteria
Given a selected week, when I open Coaching tab, then I see a prioritized list using rules (e.g., Score < 70%, or 2+ task fails this week, or 3-week downward trend in any core category).


Given I click a person, then I land in the Why Breakdown drawer (US-LB3) for that week.


DoD
Coaching tab; ranking rules implemented; link to detail drawer.



 Dependencies: US-LB3; performance alerts logic (inputs).
 Risks & Assumptions
Assumption: Thresholds configurable later; default score cutoff: 70%.
 Test Data
4 users under 70% → appear on shortlist.
 Business Rules
List includes only staff with ≥1 completed shift that week.
 Tasks
FE: Coaching tab/list, indicators (low score, trend, fails).
BE: Rule-based shortlist endpoint.
QA: Threshold/edge tests.



US-LB5: CSV Export - Leaderboard & Coaching Views
User Story
 As a Manager/Admin, I want to export CSV of the current leaderboard or coaching list so I can share and archive performance snapshots.
Acceptance Criteria
Given a filtered leaderboard, when I click Export CSV, then I get a CSV matching the grid (Brand, Location, Week, User, Attendance %, Punctuality %, Task %, Reviews %, Total Score).


Given the coaching list, when I export, then CSV includes the reason flags (low score / trend / failures) and a linkable user id.


DoD
Exports for leaderboard & coaching; respects RBAC scope; audit entry recorded.



 Dependencies: US-LB1/4; Reports module.

 Test Data


Brand=A, Location=L1, Week 36 → CSV with 25 rows.
  Business Rules
Admin can export all; Managers only scoped data.
 Tasks
FE: Export buttons & states.


BE: CSV generator; audit.


QA: Data parity with grid; permissions.



US-LB6: “Show Me the Events” - Drill-through to Attendance/Tasks/Reviews Panel
User Story
 As a Manager, I want to drill through from a week’s score to the actual events (attendance events; pass/fail tasks with reasons) and see the location-level reviews panel so I can verify and coach confidently.
Acceptance Criteria
Given I click a person’s weekly score, when I open Events, then I see:


Shift list with attendance signals (on-time/late/absent), and


Task list with pass/fail and failure reasons, and


a Reviews panel showing the location-week 5★/total count and review % used in that user’s score (if multi-location, show per-location values + blended note).


Given a data row, when I click View Dispute, then I jump to the dispute (if any) for that event.


DoD
Drill-through modal/table; links to disputes; Reviews panel; pagination.


Dependencies: Attendance events; Task outcomes; Reviews rollup; Disputes module.

 Test Data
4 shifts (1 late); 2 failed tasks (reasons); Reviews L1=88% for that week.
 Business Rules
Shows only events (and reviews panel) within the selected week/date range.
 Tasks
FE: Drill-through UI; tabs for attendance/tasks; reviews panel.


BE: Events-by-week API + location reviews join.


QA: Event-week alignment; pagination; multi-location blend.



US-LB7: RBAC & Scope Enforcement (Manager vs Admin)
User Story
 As the System, I must enforce that Managers only see data for their assigned locations, while Admins can see all brands/locations/teams.
Acceptance Criteria
Given a Manager user, when they open Leaderboard, then only staff for assigned locations are visible and selectable in filters.


Given an Admin user, when they open Leaderboard, then All Brands and All Locations are available, and all teams are visible.


DoD
Route guards + backend policy checks; unit/integration tests for scope.

 Dependencies: RBAC, location mapping.
 Risks & Assumptions
Assumption: Staff-to-location assignments are up to date.
 Test Data
Manager assigned to L1 only → cannot view L2 staff.
 Business Rules
Staff can only view their own data (not leaderboards).
 Tasks
FE: Hide non-scope filters; guard routes.


BE: Scope filters; policy middleware.


QA: Access-control matrix.



US-LB8: Manager Dashboard Cards
User Story
 As a Manager, I want quick dashboard cards (e.g., Avg Score, % under 70, Top performer, Bottom performer) that respect filters so I can get a fast snapshot before drilling in.
Acceptance Criteria
Given brand/location/week filters, when I view the dashboard, then I see cards computed from the filtered dataset.


Given I click a card (e.g., “Bottom performer”), then the Leaderboard auto-filters/highlights that subset.
DoD
Deep-link to filtered leaderboard.

 Dependencies: US-LB1/2.

 Test Data
Avg score 82%, 3 users <70%.
  Tasks


FE:  cards; click-through.


BE: Aggregation endpoints.


QA: Cross-check with leaderboard totals.



Epic-wide Business Rules
Managers: only assigned locations; Admins: all brands/locations.


Inactive staff (0 shifts) excluded from leaderboards for that period.


Each staff has one unified weekly score across locations/brands.


Customer Reviews contribute 20% and are location-wide; multi-location users get a blended review value in their unified weekly score.






















EPIC GS4 — Performance Alerts & Coaching Actions 
Goal: Automatically flag performance issues (e.g., Groove Score < 70%, Attendance % < 90%, Punctuality % < 90%, missed shifts, false task completions ≥ threshold, low customer review ratio at a location) and give Managers/Admins simple tools to review, snooze, resolve, or convert alerts into coaching notes. Alerts appear on the Manager dashboard and respect RBAC (Managers see only assigned locations; Admin sees all).
 Note: “Low Customer Reviews” is location-wide (one alert per location-week); other alerts are per user-week (except rolling “false task completions”).
US-AL1: Auto-Create Alerts
User Story
 As the System, I want to auto-create performance alerts when trigger rules are met so managers can review issues promptly.
Acceptance Criteria (Given/When/Then)
Low Score (user-week): Given weekly data exists, when a user’s Groove Score < Low Score cutoff (default 70%), then create a Low Score alert for that user/week.


Attendance (user-week): Given Attendance is computed, when Attendance % < 90%, then create an Attendance Low alert for that user/week.


Punctuality (user-week): Given Punctuality is computed, when Punctuality % < 90%, then create a Punctuality Low alert for that user/week.


Missed Shifts (user-week): Given missed shift count ≥ threshold (default ≥1), then create a Missed Shifts alert with the count.


False Task Completions (rolling 30 days, user-rolling): Given a user accrues ≥ N false completions within the configurable rolling window (default ≥2 in 30 days), then create a False Completions alert flagged for HR escalation.


Low Customer Reviews (location-week): Given location-week review ratio (5★ / total) < Reviews threshold (default 95%), then create a location-scoped Low Reviews alert and notify Store Manager + Ops (Slack/email).


Surfacing: Given an alert is created, when the Manager dashboard loads, then the alert appears in the Alerts panel with type, scope (user or location), period, counts/metrics, and links (to events, reviews panel, or HR escalation).


Definition of Done (DoD)
Server rule evaluators; idempotent writers; alert record contains: type, scope (user|location), period, metric payload, status, timestamps.


Notification for configured types.



 Dependencies: Final weekly score (GS1); ShiftIQ attendance/punctuality/missed shifts; TAMZEE false completion events; Reviews rollup (location-week); RBAC.
 Risks & Assumptions: Reviews are location-wide; false completion events are trusted signals.
 Test Data: GS=68% → Low Score; Att=85% → Attendance Low; Punc=88% → Punctuality Low; Missed=2 → Missed Shifts(2); FalseComp=2/30d → HR flag; L1 reviews 92% → Low Reviews(L1).
Business Rules: System triggers; Manager/Admin act; alerts shown on Manager dashboard.
 Tasks:
BE: Evaluators (weekly/rolling), scheduler, persistence, notifications.


QA: Threshold edges, duplicate, multi-location.



US-AL2: Manager Alerts Inbox (Review, Snooze, Resolve)
User Story
 As a Manager, I want an Alerts Inbox to filter and act on alerts so I can manage team performance efficiently.
Acceptance Criteria
Filters: Brand/Location/Week (and Type: Low Score / Attendance Low / Punctuality Low / Missed Shifts / False Completions / Low Reviews).


Resolve: Given an alert, when I click Resolve and add a note, then status = Resolved (audit-logged).


Snooze: Given an alert, when I Snooze (1w/2w), then it hides from default until expiry (visible under Snoozed).


RBAC: Managers see only assigned locations; Admin sees all.


DoD
Inbox grid; filters; actions (Resolve/Snooze) with notes; audit; pagination.

 Dependencies: US-AL1; RBAC.
 Risks & Assumptions: Snooze presets (1w/2w) in MVP.
 Test Data: 12 alerts @ L1; resolve 2 (notes), snooze 1.
 Business Rules: All actions audited.
 Tasks: FE list/filters/actions; BE list/actions APIs; QA scope & transitions.

US-AL3: Configure Alert Rules & Thresholds (Admin)
User Story
 As an Admin, I want to configure which alert types are on and set thresholds so alerts match policy.
Acceptance Criteria
Enable/disable types: Low Score, Attendance Low, Punctuality Low, Missed Shifts, False Completions (rolling), Low Customer Reviews (location-week).


Thresholds:


Low Score cutoff (default 70%),


Attendance % (default 90%),


Punctuality % (default 90%),


Missed Shifts count (default ≥1),


False Completions count & window (default ≥2 in 30 days),


Low Reviews % (default 95%).


Notifications: For Low Reviews, allow mapping per location/brand


DoD
Settings UI + store; validation; cache-bust; audit for all changes.



 Dependencies: US-AL1; Settings.
 Risks & Assumptions: Timezone follows Org/Location settings.
 Test Data: Set Low Score=72% → next week uses 72%; FalseComp=3/30d.
 NFRs: Save < 300 ms.
 Business Rules: Admin-only; versioned changes.
 Tasks: FE settings form; BE config endpoints; QA threshold toggles.

US-AL4: Export Alerts (CSV) & Weekly Summary
User Story
 As a Manager/Admin, I want to export alerts for a period (CSV) so I can archive/share coaching signals alongside weekly summaries.
Acceptance Criteria
Export current filters to CSV with: type, scope (user/location), week/period, brand/location, metric payload (e.g., GS=68%, Att=85%, Punc=88%, Missed=2, Reviews=92%), status, created/resolved timestamps.


From Reports, include an Alerts tab/file for the same filters.


DoD
CSV export endpoint; RBAC scope; export history (audit).


Priority & SP: Medium, 3
 Dependencies: Reports module.
 Risks & Assumptions: Timezone from Org/Location for labels.
 Test Data: Week 36, Brand=A, L1 → 18 alerts.
 Business Rules: Admin all data; Manager scoped.
 Tasks: FE export; BE generator; QA parity.

US-AL5: RBAC & Scope Enforcement for Alerts
User Story
 As the System, I must ensure Managers see alerts only for their assigned locations, while Admins see all brands/locations.
Acceptance Criteria
Managers: list & filters limited to assigned locations.


Admin: can choose All Brands/All Locations.


DoD
Policy middleware; scoped queries; tests.


Priority & SP: High, 3
 Dependencies: RBAC; location mapping.
 Risks & Assumptions: Assignments current.
 Test Data: Manager(L1) cannot view L2 alerts.
 Business Rules: Staff do not access alerts pages.
 Tasks: FE hide/guard; BE scope filters; QA matrix.

Epic-wide Business Rules
Customer Reviews alert is location-wide, based on weekly 5★ ratio; other alerts are user-centric (weekly or rolling).


System detects; Manager/Admin act; all actions and auto-changes are audit-logged.









EPIC GS5 - Reports & Exports (Groove Score + Bonuses + Alerts)
Goal: Provide Manager/Admin views to analyze weekly performance (Groove Score, Attendance/PTO, Punctuality, Task pass/fail, Customer Reviews) and export data to CSV/API. Respect RBAC scopes (Managers limited to assigned locations; Admin sees all). Include payroll-ready bonus line items.

US-RE1: Weekly Groove Score Report (Filters + CSV)
User Story
 As a Manager/Admin, I want a weekly Groove Score report with Brand/Location/Week filters and CSV export so I can review team performance and share snapshots.
Acceptance Criteria
Given I select Brand, Location, Week/Date range, when I apply filters, then the table shows staff with their unified weekly score (users with 0 shifts excluded).


Given multi-location workers, when viewing the row, then I see category columns: Attendance %, Punctuality %, Task Efficiency %, Customer Reviews % (blended), and Total Score %; hovering Reviews shows a tooltip “location-wide; blended across locations worked”.


Given I click Export CSV, when the file downloads, then columns match the grid (Brand, Location filter, Week, Staff, Attendance %, Punctuality %, Task %, Reviews % (blended), Total Score %).


Definition of Done (DoD)
 Server-side filtering/pagination; CSV generation; unified weekly score sourcing with review average; RBAC enforced.

 Dependencies: Weekly scoring finalized (GS1); location mapping & RBAC; reviews roll-ups.
 Risks & Assumptions: Blending default is by days worked (configurable to hours).
 Test Data: Week 36; Brand “Craft Therapy Network”; Location “Main St.” → 12 staff.

 Business Rules: Users with no shifts that week are excluded.
 Tasks
FE: Filters; table; review tooltip; CSV button.


BE: Query endpoints; blend logic; CSV stream; RBAC guards.


QA: Filter matrix; export parity; multi-location blend cases.



US-RE2: Attendance & PTO Summary (By Period + CSV)
User Story
 As a Manager/Admin, I want attendance/PTO summaries by week/pay period/custom range so I can monitor coverage and compliance, with CSV export.
Acceptance Criteria
Period pickers (Week / Pay Period / Custom) drive scoped results.


Export CSV returns rows with the same filters applied.


DoD
 Period pickers; scoped query; CSV export.

 Dependencies: ShiftIQ attendance/PTO feeds.
 Risks & Assumptions: PTO/attendance in ShiftIQ; surfaced here cross-module.
 Test Data: Pay Period Aug 1–15 → PTO hours vs attendance.

 Business Rules: RBAC scope applies.
 Tasks
FE: Period selector; table; CSV.


BE: Aggregation endpoints.


QA: Totals vs sample events.



US-RE3: Task Pass/Fail Summary with Reasons (Week Filter + CSV)
User Story
 As a Manager/Admin, I want a report of task pass/fail counts and failure reasons for a week so I can spot coaching needs.
Acceptance Criteria
Given a selected Week and Scope, when I run the report, then I see pass/fail counts per user and a drilldown of failure reasons (no partial credit).


Export includes counts and reasons.


DoD
 Report grid; reasons drilldown; CSV.

 Dependencies: TAMZEE task outcomes (with reasons).
 Risks & Assumptions: Pass-day logic used in GS (see GS3).
 Test Data: User X: 10 tasks, 2 fails (reasons logged).

 Business Rules: Reasons are required for fails.
 Tasks
FE: Grid + modal; CSV.


BE: Aggregation, reason join.


QA: Data correctness.



US-RE4: Alerts Summary (Low Score / Attendance Low / Punctuality Low / Missed Shifts / False Completions / Low Reviews)
User Story
 As a Manager/Admin, I want a summary of performance alerts by type and status for a period so I can triage and report.
Acceptance Criteria
Given Brand/Location/Period filters, when I run the report, then I see counts by type (Low Score / Attendance Low / Punctuality Low / Missed Shifts / False Completions / Low Reviews (location-week)) and by status (Open/Resolved/Snoozed).


Given I export CSV, then rows include scope (User or Location), user/location, week/period, type, status, and trigger metrics (e.g., GS=68%, Att=85%, Punc=88%, Missed=2, Reviews=92%).


DoD
 Summary + detail list; CSV export; scope column.

 Dependencies: Alerts engine (GS4).
 Risks & Assumptions: Low Reviews affects score 20% but the alert is location-wide.
 Test Data: Week 36 → 8 Low Score, 3 Missed Shifts, 2 Low Reviews(L1/L2).

 Business Rules: Actions handled in Alerts Inbox; RBAC enforced.
 Tasks
FE: Filters; grid; CSV.


BE: Query; export; RBAC scope.


QA: Types/status counts; scope=location vs user.



US-RE5: Bonus Awards Report (Weekly/Monthly/Milestone)
User Story
 As a Manager/Admin, I want a report of bonus awards (weekly/monthly/milestone) with proration flags so I can reconcile payouts and coach progress.
Acceptance Criteria
Given period & scope, when I view the report, then I see program name/type, staff, amount, proration applied (Y/N), and status (Pending export / Exported / Failed).


Given I export CSV, then each row carries separate line item details suitable for payroll mapping.


DoD
 Bonus awards grid; CSV export.

 Dependencies: Bonus Engine (dynamic rules).
 Risks & Assumptions: Proration applies to part-time staff when configured.
 Test Data: Weekly GS ≥ 95% → $50; Staff at 0.5 FTE → $25.
 NFRs: Query p95 < 1 s (≤1k rows).
 Business Rules: Awards appear after weekly finalization only.
 Tasks
FE: Grid; export.


BE: Read models; CSV.


QA: Proration flag/tests.



US-RE6: Payroll Export - Bonus Line Items (CSV/API + History)
User Story
 As the System, I want to export bonuses as separate line items via CSV or API, aligned to payroll cadence, and keep an export history with retry/audit.
Acceptance Criteria
Given Mon–Sun payroll and disputes close Tue 11:59 PM, when I run export, then approved bonus records for that cycle are packaged as separate line items (user, period, program, amount).


Given API delivery fails, when retry policy triggers, then the system retries and logs status; Admin can download the CSV from Export History.


Given an export is locked/complete, when late approvals occur, then those payouts roll into the next export window.


DoD
 Export formatter (CSV/API), export history UI, retries, audit log.

 Dependencies: Bonus awards; payroll settings.
 Risks & Assumptions: Admin triggers export; provider mapping configured.
 Test Data: 2 awards for Staff A → 2 CSV line items.

 Business Rules: Only approved/locked records are exportable.
 Tasks
BE: Generator, delivery client, retries, history.


FE: Export screen, history list, status.


QA: Contract tests; failure paths.


DevOps: Job scheduling; alerts on failures.



US-RE7: Report RBAC & Scope Enforcement
User Story
 As the System, I must ensure Managers only see reports for assigned locations, while Admins can view all brands/locations.
Acceptance Criteria
Manager views: filters & data show only assigned locations.


Admin views: “All Brands/All Locations” available.


DoD
 Backend policy middleware; scoped queries; unit/integration tests.

 Dependencies: RBAC; location mapping.
 Risks & Assumptions: Assignments current.
 Test Data: Manager L1 only → cannot query L2.

 Business Rules: Staff users do not access org-wide reports.
 Tasks
FE: Guard routes; hide non-scope filters.


BE: Policy checks; scope filters.


QA: Access-control matrix.



US-RE8: Exports & Reports Audit Trail
User Story
 As an Admin, I want audit logs for report views/exports and payroll runs so we have compliance history.
Acceptance Criteria
Given a CSV export, when it completes, then an audit entry captures who/when/filters/file id.


Given a payroll export, when success/failure occurs, then status and payload metadata are audit-logged.


DoD
 Append-only audit entries; searchable by user/date/object.

 Dependencies: Export endpoints; reports.
 Risks & Assumptions: Audit retention follows platform policy.
 Test Data: Export “Week 36 – L1” → audit row visible.

 Business Rules: Admin can view all audit entries.
 Tasks
BE: Audit writer; index; search.


QA: Integrity/order tests.


Epic-wide Business Rules
Managers limited to assigned locations; Admins have global access.


Reports include Groove Score (with Attendance, Punctuality, Task, Reviews 20%), PTO & attendance, task pass/fail; exports include bonus line items to payroll.


Customer Reviews are location-wide; multi-location staff get a blended Reviews % in their unified score and in the Weekly GS report.





EPIC GS6 - Disputes & Recalculation (Events → Score Updates) 
Goal: Let Staff dispute event-based issues (missed punch, incorrect/late punch, no-show, false task completion, etc.) after weekly finalization (Sun 11:59 PM). Route to Manager, then Admin for final decision. On approval (or manual corrections), auto-recalculate the affected week’s Groove Score (Attendance, Punctuality, Task Efficiency, and—if punch/location changes—rebalance the Customer Reviews (location-wide) blend), update bonuses, and alerts.
 Cadence: Payroll Mon–Sun; dispute window closes Tue 11:59 PM; exports use separate bonus line items; late approvals roll forward to next export.

US-DQ1: Staff Raises an Event Dispute (After Weekly Finalization)
User Story
 As Staff, I want to file a dispute after weekly scores finalize so incorrect event records (attendance/punctuality/task) can be reviewed and fixed.
Acceptance Criteria (Given/When/Then)
Given the week is finalized (Sun 11:59 PM), when I open Dispute on a qualifying event (missed punch, incorrect time, late punch, no-show, false task completion), then I can submit one dispute with a reason and optional evidence (image/PDF).


Given disputes are event-based only, when I try to dispute a metric (e.g., “my score is wrong”) or the week is still in progress, then I’m blocked with: “Only event disputes, after weekly finalization.”


Given I already disputed this event, when I try again, then the system prevents duplicates.


Definition of Done (DoD)
 Dispute form (event link, reason, attachments); server validation; duplicate prevention; submission → Manager queue; audit entry.

 Dependencies: GS weekly finalization; ShiftIQ (attendance/punches); TAMZEE (tasks).
 Risks & Assumptions: Allowed types = missed/incorrect/late punch, no-show, false task completion.
 Test Data: “Missed punch 2025-08-22 17:30” → reason “device down”, photo attached.
.
 Business Rules: No mid-week disputes; event-only disputes.
 Tasks: FE dispute modal; BE CreateDispute API + attachments + audit; QA duplicates & week-state guard.

US-DQ2: Manager Reviews & Decides (Approve / Deny)
User Story
 As a Manager, I want to review, approve/deny, and comment on disputes for my locations so issues are resolved quickly.
Acceptance Criteria
Given a new dispute in my scope, when I open it, then I see the event details (attendance/punctuality/task), staff note, and evidence preview; actions: Approve / Deny / Add comment.


Given I Approve, then the linked event is corrected (or flagged “no score impact”), and the weekly score is recalculated automatically (this may change Attendance, Punctuality, Task Efficiency, and—if the edit moves the user’s on-shift location/day—re-blend the Customer Reviews component for that user/week).


Given I Deny, then the dispute closes with my note; score unchanged.


Given RBAC, then I only see disputes for assigned locations; Admin sees all.


DoD
 Manager queue; event preview; approve/deny + notes; scope enforcement; audit.

 Dependencies: US-DQ1; RBAC/location mapping.
 Risks & Assumptions: Inconsistent decisions → Admin oversight via reports.
 Test Data: Approve “missed punch” → Attendance & Punctuality fix → score recomputed.
.
 Business Rules: Manager decision not final; Admin can override.
 Tasks: FE queue + decision modal; BE Review API + event corrections + audit; QA scope & flows.

US-DQ3: Admin Final Decision & Escalation
User Story
 As an Admin, I want to override manager decisions and resolve escalated disputes so outcomes are fair and final.
Acceptance Criteria
Given a dispute escalated by staff after a manager deny, when I Approve, then the event is corrected and the week’s score recalculates; staff/manager notified.


DoD
 Admin view; escalation path; override action; notifications; audit.

 Dependencies: US-DQ2; Notifications.
 Risks & Assumptions: Admin decision is final (no second appeal) in MVP.
 Test Data: Denied → escalated → Admin approves with note.

 Business Rules: Admin has global visibility & authority.
 Tasks: FE admin queue & override modal; BE Escalation API + audit; QA routing & finality.

US-DQ4: Recalculation Pipeline 
User Story
 As the System, I want to automatically recalculate a user’s weekly Groove Score (and derived bonuses) when disputes are approved or manual corrections are applied, and update related alerts.
Acceptance Criteria
Given an approved dispute or manual correction, when it posts, then recompute the affected week only; write the new score; version the prior score; audit the change.


Given payroll cadence (Mon–Sun) and dispute window until Tue 11:59 PM, when recomputation occurs before the window closes, then bonuses/exports for that cycle update; after lock, changes roll into the next export.


Given the new score changes alert eligibility (e.g., Low Score <→ ≥ cutoff, or rolling false-completion effects), then update/resolve related alerts automatically.


Given a correction that affects the on-shift location/day (e.g., punch fix), when recomputing, then re-derive the user’s blended Customer Reviews % for that week (location-wide ratios by location worked).


DoD
 Idempotent recompute job; bonus re-eval hook (e.g., High Weekly Score, Perfect Streak); alerts updater; audit.

 Dependencies: GS1 finalization; Bonus Engine; GS4 alerts; Payroll export.
 Risks & Assumptions: Only event disputes feed recalculation; review data changes come from feed corrections, not disputes.
 Test Data: Fix late punch → Punctuality↑; GS 68%→74% → Low Score alert auto-resolved.

 Business Rules: Weekly scope only; no cross-week cascades.
 Tasks: BE recompute service + bonus/alert hooks + history; QA idempotency & lock-window.

US-DQ5: Disputes Inbox & SLA (Manager/Admin)
User Story
 As a Manager/Admin, I want a Disputes Inbox with filters, statuses, and SLA timers so I can process disputes on time.
Acceptance Criteria
Filters: Brand/Location/Week/Status (Open, Pending Manager, Escalated, Resolved, Denied).


SLA: If a dispute is unanswered for 48h, mark SLA at risk and notify the Manager.


Admin view shows all locations and an SLA aging column.


DoD
 Inbox grid + filters; status transitions; SLA timers; notifications.

 Dependencies: RBAC; Notifications; US-DQ1/2/3.
 Risks & Assumptions: Avoid notification fatigue → daily digest option.
 Test Data: 3 disputes >48h → flagged.
.
 Business Rules: Manager scope enforced; Admin global.
 Tasks: FE grid/filters/status chips/timers; BE queries + SLA job + notify; QA status matrix.

US-DQ6: Manual Adjustment (No Dispute) - Manager/Admin
User Story
 As a Manager/Admin, I want to correct an event (e.g., adjust punch time/location, mark “no score impact”, flip task Fail→Pass with reason) without requiring the staff to file a dispute—so we can fix obvious errors fast.
Acceptance Criteria
Given an event in my scope, when I open Manual Adjustment, then I can choose: Fix data (e.g., correct punch/location), or Mark no score impact (reason required).


Given I save an adjustment, then the weekly score recomputes (including any Reviews blend change if the worked location/day changed) and an audit entry captures who/when/why.


Given abuse risk, then adjustments appear in a weekly Overrides report (Admin).


DoD
 Adjustment UI; validations; audit; recompute hook.

 Dependencies: US-DQ4 recompute; RBAC scope.
 Risks & Assumptions: Overuse of “no score impact” → reporting & alerts to Admin.
 Test Data: Mark task fail as no score impact (“system issue”) → GS unchanged.

 Business Rules: Reason required; Admin can revoke/override.
 Tasks: FE adjustment drawer + reason selector; BE Adjustment API + audit + recalc; QA abuse & scope checks.

US-DQ7: Notifications (Staff/Manager/Admin)
User Story
 As the System, I want to notify the right person at each step so disputes move promptly and outcomes are visible.
Acceptance Criteria
New dispute → notify Manager.


Manager decision → notify Staff; if Denied, show reason and escalate option.


Admin override → notify Staff and Manager (final outcome).


Recalculation completes and impacts bonus/export window → notify Admin.


DoD
 Event-based notifications with templates; delivery status; user prefs (email/push).

 Dependencies: US-DQ1-DQ4; Payroll export.
 Risks & Assumptions: Digest mode for low-priority updates.
 Test Data: Approve → “Your dispute was approved; score updated.”

 Business Rules: Respect RBAC; redact event details as needed.

Epic-wide Business Rules
Weekly finalization: Sun 11:59 PM; minimum 1 completed shift for a score.


Only event disputes; no mid-week disputes; approved disputes auto-update score.


Manual corrections (with reason + audit) are allowed for Managers/Admins.


Payroll: Mon–Sun, dispute window until Tue 11:59 PM; post-lock updates roll to next export.


Customer Reviews are not disputable; any impact occurs indirectly via punch/location corrections (which can change the user’s location blend).



EPIC GS7  System Settings & Admin Control
Goal: Give Admins a single, safe place to shape how Groove Score works: set category weights (Attendance, Punctuality, Task Efficiency, Customer Reviews), define cutoffs and alert thresholds, control finalization & dispute windows, manage feature flags (e.g., enable “$5 per review mention” claim program), enforce RBAC & scope, and keep a full audit history and retention policy. Changes should take effect quickly and be audit-logged.

US-SET1: Configure Category Weights & Score Formula
User Story
 As an Admin, I want to set the weights for score categories (Attendance %, Punctuality %, Customer Reviews %, Task Efficiency %) so the weekly Groove Score reflects our policy.
Acceptance Criteria
Given the Weights screen, when I set values that sum to 100 (e.g., default 30/30/20/20 for Att/Punc/Reviews/Task), then the settings save successfully.


Given I change weights, when I save, then the new weights apply to future weeks and any recalculation triggered after the change (past finalized weeks are not re-scored).


Given multi-location staff, when the score runs, then the Customer Reviews component uses the configured blend method (see below) to derive the user’s weekly review %.


Definition of Done (DoD)
Settings UI with validation (sum = 100), defaults shown.


Config stored centrally; cache invalidation; banner shows “effective from next run”.


Audit entry (who/when/old→new).



 Dependencies: GS1 calculator; GS4 alerts (consumes cutoffs).
 Risks & Assumptions
Assumption: Default weights start 30/30/20/20.
 Test Data
30/30/20/20 → OK; 35/35/20/20 → error (sum 110).

 Business Rules
Admin-only.


Tasks
FE: Weights form + helper text; validator.


BE: Config model; sum check; pub/sub cache bust.


QA: Sum/edges; restore defaults.



US-SET2: Low-Score Cutoff & Alert Thresholds
User Story
 As an Admin, I want to set the Low Score cutoff (e.g., 70%) and other alert thresholds so the Alerts engine matches policy.
Acceptance Criteria
Given I set Low Score cutoff (e.g., 72%), when next weekly finalization runs, then Low Score alerts use 72%.


Given I set Attendance % and Punctuality % thresholds (defaults 90/90), then alerts evaluate against those values.


Given I set Missed Shifts threshold (default ≥1), False Completions (rolling) threshold (default ≥2 in 30 days), and Low Reviews % (default 95%, location-week), then the engine uses them on the next cycle.


Given I save mid-week, then changes apply on the next evaluation cycle.


DoD
Settings UI; backend store; validations; audit; applied next run.



 Dependencies: GS4 Alerts engine.
 Risks & Assumptions
Timezone follows Org/Location.
 Test Data


Cutoff 70% → 4 Low Score alerts.
 Business Rules


Admin-only; versioned.


Tasks
FE: Threshold inputs + help.


BE: Config endpoints; cache bust.


QA: Before/after behavior.



US-SET3: Finalization & Dispute Window (Week Close + Lock Rules)
User Story
 As an Admin, I want to confirm weekly finalization (Sun 11:59 PM) and configure the dispute window (e.g., Tue 11:59 PM) so recalculations and exports follow a predictable cadence.
Acceptance Criteria
Given finalization time, when I view settings, then it is clearly shown (read-only if locked).
Given dispute window end = Tue 11:59 PM, when I save, then recomputes before the window update the current cycle’s export; recomputes after the window roll to next export.
Given a locked period, when I force re-export, then show warning and require reason.
DoD
Settings display; window editable; lock wired to export logic; audit.

Dependencies: GS1 finalize; GS6 recalcs; GS5 exports.
 Risks & Assumptions
Finalization fixed in MVP; window editable.
 Test Data


Tue 22:00 approval → included; Wed 09:00 → next cycle.
 Business Rules


Locks trump overrides unless Admin forces with reason.


Tasks
FE: Settings + tooltips; lock callouts.


BE: Window config; lock checks; export query effects.


QA: Edge times; force flow.



US-SET4: RBAC Policy Matrix & Scope Controls
User Story
 As an Admin, I want to adjust who can see/do what (Admin/Manager/Staff) across Groove Score pages (Leaderboards, Alerts, Bonuses, Reports) and ensure Managers are scoped to assigned locations.
Acceptance Criteria
Given a role matrix, when I update a permission (e.g., “Managers can export CSV: ON/OFF”), then it applies immediately and is audit-logged.


Given a Manager’s location scope, when I assign/unassign locations, then Leaderboards/Alerts/Reports update scope right away.


Given Staff, when they access Groove Score, then they see only their own score/bonus pages.


DoD
Permissions UI; policy middleware; scope filters; audit.



 Dependencies: RBAC foundation; Brand/Location mapping.
 Risks & Assumptions
Identity/roles exist; this maps policy.
 Test Data


Toggle Manager CSV OFF → button hidden + API blocked.
 Business Rules


Admin can see/modify all; versioned changes.


Tasks
FE: Matrix editor; scope editor.


BE: Policy store; middleware; scope cache.


QA: Access matrix; negative auth.
