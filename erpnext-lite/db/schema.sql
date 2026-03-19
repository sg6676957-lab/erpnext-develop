CREATE DATABASE IF NOT EXISTS erpnext_lite;
USE erpnext_lite;

CREATE TABLE IF NOT EXISTS hrm_employees (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  notes TEXT,
  amount DECIMAL(12,2),
  event_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hrm_attendance LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS hrm_leaves LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS hrm_recruitment LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS hrm_payroll LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS hrm_performance LIKE hrm_employees;

CREATE TABLE IF NOT EXISTS crm_leads LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS crm_opportunities LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS crm_contacts LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS crm_activities LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS crm_reports LIKE hrm_employees;

CREATE TABLE IF NOT EXISTS pm_projects LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS pm_tasks LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS pm_time_logs LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS pm_milestones LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS pm_reports LIKE hrm_employees;

CREATE TABLE IF NOT EXISTS asset_inventory LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS asset_allocation LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS asset_maintenance LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS asset_depreciation LIKE hrm_employees;
CREATE TABLE IF NOT EXISTS asset_disposal LIKE hrm_employees;
