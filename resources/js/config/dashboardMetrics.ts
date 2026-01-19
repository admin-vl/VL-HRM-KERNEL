import { DashboardMetricConfig } from './dashboardMetricsConfig';

export const DASHBOARD_METRICS: DashboardMetricConfig[] = [
  {
    key: 'total_employees',
    label: 'Total Employees',
    aggregate: 'count',
    roles: ['company', 'superadmin'],
  },
  {
    key: 'new_employees_this_month',
    label: 'New Employees (This Month)',
    aggregate: 'count',
    roles: ['company', 'superadmin'],
  },
  {
    key: 'new_employees_today',
    label: 'New Employees (Today)',
    aggregate: 'count',
    roles: ['company', 'superadmin'],
  },
  {
    key: 'total_departments',
    label: 'Total Departments',
    aggregate: 'count',
    roles: ['company', 'superadmin'],
  },
  {
    key: 'total_roles',
    label: 'Total Roles',
    aggregate: 'count',
    roles: ['company', 'superadmin'],
  },
  {
    key: 'total_branches',
    label: 'Total Branches',
    aggregate: 'count',
    roles: ['company', 'superadmin'],
  },
  {
    key: 'attendance_rate',
    label: 'Attendance Rate (%)',
    aggregate: 'calculated',
    roles: ['company', 'superadmin'],
  },
  {
    key: 'present_today',
    label: 'Present Today',
    aggregate: 'count',
    roles: ['company'],
  },
  {
    key: 'absent_today',
    label: 'Absent Today',
    aggregate: 'count',
    roles: ['company'],
  },
  {
    key: 'pending_leaves',
    label: 'Pending Leaves',
    aggregate: 'count',
    roles: ['company', 'employee'],
  },
  {
    key: 'approved_leaves',
    label: 'Approved Leaves',
    aggregate: 'count',
    roles: ['company'],
  },
  {
    key: 'on_leave_today',
    label: 'On Leave Today',
    aggregate: 'count',
    roles: ['company'],
  },
  {
    key: 'active_job_postings',
    label: 'Active Job Postings',
    aggregate: 'count',
    roles: ['company'],
  },
  {
    key: 'total_candidates',
    label: 'Total Candidates',
    aggregate: 'count',
    roles: ['company'],
  },
  {
    key: 'candidates_this_month',
    label: 'Candidates (This Month)',
    aggregate: 'count',
    roles: ['company'],
  },
  {
    key: 'total_announcements',
    label: 'Total Announcements',
    aggregate: 'count',
    roles: ['company'],
  },
  {
    key: 'upcoming_meetings',
    label: 'Upcoming Meetings',
    aggregate: 'count',
    roles: ['company'],
  },
];
