# App Workflow (Limited to 4 Pages)

This workflow describes exactly what happens after each step in the app, and it only covers these four pages/modules:
1. HRM
2. CRM
3. Project Management
4. Asset Management

All other ERPNext pages/modules are intentionally out of scope and should remain hidden or unused.

## Global Flow (All Pages)
1. User opens the app URL.
2. User logs in as `Administrator` or a permitted user.
3. The user sees only the four module pages listed above.
4. The user selects a module page and follows its step-by-step workflow below.

## 1) HRM
### 1.1 Employee Management
1. Create Employee record.
2. Assign Employee ID, department, role, and reporting manager.
3. Link the employee to a system user (if login access is needed).
4. Save the record.
5. Result: Employee is active and appears in HR lists and HR reports.

### 1.2 Attendance Management
1. Configure attendance settings (if not already set).
2. Record attendance (manual entry or import).
3. Submit attendance for approval (if approvals are enabled).
4. Result: Attendance data is stored and available for payroll/HR reporting.

### 1.3 Leave Management
1. Create Leave Type (if not already created).
2. Assign Leave Allocation to employees.
3. Employee applies for leave.
4. Manager approves/rejects leave.
5. Result: Leave balances update and are reflected in HR reporting.

### 1.4 Recruitment Management
1. Create a Job Opening.
2. Add candidates/applications.
3. Schedule and record interviews.
4. Update candidate status (shortlist, reject, offer).
5. Result: Recruitment status is tracked to closure.

### 1.5 Payroll Management
1. Configure salary structures.
2. Assign salary structures to employees.
3. Run payroll for a period.
4. Review and submit payroll entries.
5. Result: Payroll is generated and recorded.

### 1.6 Performance Management
1. Define appraisal cycle and templates.
2. Assign appraisals to employees.
3. Collect self/manager reviews.
4. Finalize appraisal results.
5. Result: Performance records are updated.

## 2) CRM
### 2.1 Lead Management
1. Create a new Lead.
2. Fill in contact details and lead source.
3. Qualify or disqualify the lead.
4. Result: Lead status is tracked in CRM lists and dashboards.

### 2.2 Opportunity Management
1. Convert or create an Opportunity from a Lead.
2. Add expected value, probability, and close date.
3. Update stage as the deal progresses.
4. Result: Opportunity pipeline is updated and visible in reports.

### 2.3 Contact Management
1. Create or update Contact records.
2. Link contacts to Leads/Opportunities.
3. Result: Contacts are centralized and reusable across CRM.

### 2.4 Activity & Follow-up Management
1. Log calls, meetings, or tasks linked to Leads/Opportunities.
2. Assign follow-up actions to owners.
3. Mark activities complete when done.
4. Result: Activity history is preserved and follow-ups are tracked.

### 2.5 Sales Reporting & Dashboard
1. Open CRM dashboard/reporting page.
2. Filter by time range, owner, or status.
3. Result: CRM pipeline and performance metrics are visible.

## 3) Project Management
### 3.1 Project Creation
1. Create a new Project.
2. Define project scope, timelines, and owner.
3. Result: Project is created and visible in project lists.

### 3.2 Task Management
1. Create tasks under the project.
2. Assign owners and deadlines.
3. Update task status as work progresses.
4. Result: Task progress is visible and traceable.

### 3.3 Time Tracking
1. Log time against tasks or projects.
2. Review and approve time logs if required.
3. Result: Time is recorded for reporting and billing analysis.

### 3.4 Milestone Tracking
1. Define milestones.
2. Mark milestones complete as achieved.
3. Result: Milestone progress is visible in the project timeline.

### 3.5 Reporting
1. Open project reports/dashboard.
2. Filter by project, owner, or status.
3. Result: Project health and progress are visible.

## 4) Asset Management
### 4.1 Asset Inventory
1. Create Asset records with category and identifiers.
2. Result: Assets appear in inventory lists.

### 4.2 Asset Allocation
1. Allocate an asset to an employee or location.
2. Track allocation history.
3. Result: Asset ownership/usage is visible.

### 4.3 Asset Maintenance
1. Log maintenance requests for an asset.
2. Track maintenance status and completion.
3. Result: Maintenance history is recorded.

### 4.4 Asset Depreciation
1. Configure depreciation settings.
2. Run depreciation for a period.
3. Result: Asset values are updated.

### 4.5 Asset Disposal
1. Initiate asset disposal.
2. Record disposal method and date.
3. Result: Asset is retired and reflected in reports.

## Out of Scope
Only the four pages/modules above are intended to be visible and used. All other ERPNext pages, modules, and menus are intentionally excluded from this workflow.
