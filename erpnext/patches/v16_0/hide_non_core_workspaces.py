import frappe


ALLOWED_MODULES = {"CRM", "Projects", "Assets", "HR", "Payroll"}
ALLOWED_ERPNext_WORKSPACES = {"CRM", "Projects", "Assets"}
ALLOWED_HRMS_WORKSPACES = {
	"People",
	"Shift & Attendance",
	"Leaves",
	"Recruitment",
	"Performance",
	"Payroll",
}
ALLOWED_ERPNext_DESKTOP_ICONS = {"ERPNext", "CRM", "Projects", "Assets"}
ALLOWED_HRMS_DESKTOP_ICONS = {
	"Frappe HR",
	"People",
	"Shift & Attendance",
	"Leaves",
	"Recruitment",
	"Performance",
	"Payroll",
}

ERPNext_MODULES = {
	"Accounts",
	"CRM",
	"Buying",
	"Projects",
	"Selling",
	"Setup",
	"Manufacturing",
	"Stock",
	"Support",
	"Utilities",
	"Assets",
	"Portal",
	"Maintenance",
	"Regional",
	"ERPNext Integrations",
	"Quality Management",
	"Communication",
	"Telephony",
	"Bulk Transaction",
	"Subcontracting",
	"EDI",
}

ERPNext_WORKSPACES = {
	"Financial Reports",
	"Invoicing",
	"Assets",
	"Buying",
	"CRM",
	"Manufacturing",
	"Projects",
	"Quality",
	"Selling",
	"ERPNext Settings",
	"Home",
	"Stock",
	"Subcontracting",
	"Support",
}

HRMS_MODULES = {"HR", "Payroll"}

HRMS_WORKSPACES = {
	"Expenses",
	"Leaves",
	"People",
	"Performance",
	"Recruitment",
	"Shift & Attendance",
	"Tenure",
	"Payroll",
	"Tax & Benefits",
}


def execute():
	hide_non_core_workspaces()
	hide_non_core_modules()
	hide_erpnext_desktop_icons()
	if "hrms" in frappe.get_installed_apps():
		hide_hrms_workspaces()
		hide_hrms_modules()
		hide_hrms_desktop_icons()


def hide_non_core_workspaces():
	if not frappe.db.table_exists("tabWorkspace"):
		return

	existing = set(
		frappe.get_all("Workspace", filters={"name": ("in", list(ERPNext_WORKSPACES))}, pluck="name")
	)
	for name in existing:
		frappe.db.set_value(
			"Workspace",
			name,
			"is_hidden",
			0 if name in ALLOWED_ERPNext_WORKSPACES else 1,
			update_modified=False,
		)


def hide_non_core_modules():
	if not frappe.db.table_exists("tabModule Def"):
		return

	meta = frappe.get_meta("Module Def")
	if not meta.has_field("hidden"):
		return

	existing = set(
		frappe.get_all("Module Def", filters={"name": ("in", list(ERPNext_MODULES))}, pluck="name")
	)
	for name in existing:
		frappe.db.set_value(
			"Module Def", name, "hidden", 0 if name in ALLOWED_MODULES else 1, update_modified=False
		)


def hide_erpnext_desktop_icons():
	hide_desktop_icons("erpnext", ALLOWED_ERPNext_DESKTOP_ICONS)


def hide_hrms_workspaces():
	if not frappe.db.table_exists("tabWorkspace"):
		return

	existing = set(
		frappe.get_all("Workspace", filters={"name": ("in", list(HRMS_WORKSPACES))}, pluck="name")
	)
	for name in existing:
		frappe.db.set_value(
			"Workspace",
			name,
			"is_hidden",
			0 if name in ALLOWED_HRMS_WORKSPACES else 1,
			update_modified=False,
		)


def hide_hrms_modules():
	if not frappe.db.table_exists("tabModule Def"):
		return

	meta = frappe.get_meta("Module Def")
	if not meta.has_field("hidden"):
		return

	existing = set(
		frappe.get_all("Module Def", filters={"name": ("in", list(HRMS_MODULES))}, pluck="name")
	)
	for name in existing:
		frappe.db.set_value(
			"Module Def", name, "hidden", 0 if name in ALLOWED_MODULES else 1, update_modified=False
		)


def hide_hrms_desktop_icons():
	hide_desktop_icons("hrms", ALLOWED_HRMS_DESKTOP_ICONS)


def hide_desktop_icons(app_name, allowed_icons):
	if not frappe.db.table_exists("tabDesktop Icon"):
		return

	meta = frappe.get_meta("Desktop Icon")
	if not meta.has_field("hidden"):
		return

	icons = frappe.get_all("Desktop Icon", filters={"app": app_name}, pluck="name")
	for name in icons:
		frappe.db.set_value(
			"Desktop Icon", name, "hidden", 0 if name in allowed_icons else 1, update_modified=False
		)
