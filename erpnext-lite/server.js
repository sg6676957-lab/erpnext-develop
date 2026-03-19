require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { pool } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const RESOURCES = {
  hrm_employees: { label: "Employee Management", module: "HRM" },
  hrm_attendance: { label: "Attendance Management", module: "HRM" },
  hrm_leaves: { label: "Leave Management", module: "HRM" },
  hrm_recruitment: { label: "Recruitment Management", module: "HRM" },
  hrm_payroll: { label: "Payroll Management", module: "HRM" },
  hrm_performance: { label: "Performance Management", module: "HRM" },

  crm_leads: { label: "Lead Management", module: "CRM" },
  crm_opportunities: { label: "Opportunity Management", module: "CRM" },
  crm_contacts: { label: "Contact Management", module: "CRM" },
  crm_activities: { label: "Activity & Follow-up Management", module: "CRM" },
  crm_reports: { label: "Sales Reporting & Dashboard", module: "CRM" },

  pm_projects: { label: "Project Creation", module: "Project Management" },
  pm_tasks: { label: "Task Management", module: "Project Management" },
  pm_time_logs: { label: "Time Tracking", module: "Project Management" },
  pm_milestones: { label: "Milestone Tracking", module: "Project Management" },
  pm_reports: { label: "Reporting", module: "Project Management" },

  asset_inventory: { label: "Asset Inventory", module: "Asset Management" },
  asset_allocation: { label: "Asset Allocation", module: "Asset Management" },
  asset_maintenance: { label: "Asset Maintenance", module: "Asset Management" },
  asset_depreciation: { label: "Asset Depreciation", module: "Asset Management" },
  asset_disposal: { label: "Asset Disposal", module: "Asset Management" }
};

const RESOURCE_FIELDS = ["title", "status", "notes", "amount", "event_date"];

function getResource(name) {
  if (!RESOURCES[name]) return null;
  return { name, ...RESOURCES[name] };
}

app.get("/api/meta", (req, res) => {
  const modules = {};
  for (const [name, info] of Object.entries(RESOURCES)) {
    if (!modules[info.module]) modules[info.module] = [];
    modules[info.module].push({ name, label: info.label, fields: RESOURCE_FIELDS });
  }
  res.json({ modules, fields: RESOURCE_FIELDS });
});

app.get("/api/:resource", async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).json({ error: "Unknown resource" });
  try {
    const [rows] = await pool.query(
      `SELECT id, title, status, notes, amount, event_date, created_at, updated_at
       FROM ${resource.name}
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/:resource", async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).json({ error: "Unknown resource" });
  const payload = {};
  for (const field of RESOURCE_FIELDS) payload[field] = req.body[field] ?? null;
  if (!payload.title || typeof payload.title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO ${resource.name} (title, status, notes, amount, event_date)
       VALUES (?, ?, ?, ?, ?)`,
      [payload.title, payload.status, payload.notes, payload.amount, payload.event_date]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/:resource/:id", async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).json({ error: "Unknown resource" });
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
  const payload = {};
  for (const field of RESOURCE_FIELDS) payload[field] = req.body[field] ?? null;
  if (!payload.title || typeof payload.title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }
  try {
    await pool.query(
      `UPDATE ${resource.name}
       SET title = ?, status = ?, notes = ?, amount = ?, event_date = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [payload.title, payload.status, payload.notes, payload.amount, payload.event_date, id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/:resource/:id", async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) return res.status(404).json({ error: "Unknown resource" });
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    await pool.query(`DELETE FROM ${resource.name} WHERE id = ?`, [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`ERPNext-lite running on http://localhost:${PORT}`);
});
