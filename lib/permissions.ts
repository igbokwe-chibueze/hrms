export interface Permission {
  id: string
  name: string
  description: string
  category: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface Attribute {
  id: string
  name: string
  type: "text" | "number" | "date" | "select" | "boolean"
  options?: string[]
  required: boolean
  category: string
}

export const PERMISSION_CATEGORIES = {
  EMPLOYEE_MANAGEMENT: "Employee Management",
  ATTENDANCE: "Attendance",
  LEAVE_MANAGEMENT: "Leave Management",
  PAYROLL: "Payroll",
  PERFORMANCE: "Performance",
  RECRUITMENT: "Recruitment",
  REPORTS: "Reports",
  SYSTEM_ADMIN: "System Administration",
} as const

export const ALL_PERMISSIONS: Permission[] = [
  // Employee Management
  {
    id: "employee.view",
    name: "View Employees",
    description: "View employee profiles and basic information",
    category: PERMISSION_CATEGORIES.EMPLOYEE_MANAGEMENT,
  },
  {
    id: "employee.create",
    name: "Create Employees",
    description: "Add new employees to the system",
    category: PERMISSION_CATEGORIES.EMPLOYEE_MANAGEMENT,
  },
  {
    id: "employee.edit",
    name: "Edit Employees",
    description: "Modify employee information and profiles",
    category: PERMISSION_CATEGORIES.EMPLOYEE_MANAGEMENT,
  },
  {
    id: "employee.delete",
    name: "Delete Employees",
    description: "Remove employees from the system",
    category: PERMISSION_CATEGORIES.EMPLOYEE_MANAGEMENT,
  },
  {
    id: "employee.bulk_import",
    name: "Bulk Import Employees",
    description: "Import multiple employees via CSV or other formats",
    category: PERMISSION_CATEGORIES.EMPLOYEE_MANAGEMENT,
  },

  // Attendance
  {
    id: "attendance.view",
    name: "View Attendance",
    description: "View attendance records and reports",
    category: PERMISSION_CATEGORIES.ATTENDANCE,
  },
  {
    id: "attendance.mark",
    name: "Mark Attendance",
    description: "Mark attendance for employees",
    category: PERMISSION_CATEGORIES.ATTENDANCE,
  },
  {
    id: "attendance.edit",
    name: "Edit Attendance",
    description: "Modify attendance records",
    category: PERMISSION_CATEGORIES.ATTENDANCE,
  },
  {
    id: "attendance.reports",
    name: "Attendance Reports",
    description: "Generate and view attendance reports",
    category: PERMISSION_CATEGORIES.ATTENDANCE,
  },

  // Leave Management
  {
    id: "leave.view",
    name: "View Leave Requests",
    description: "View leave requests and balances",
    category: PERMISSION_CATEGORIES.LEAVE_MANAGEMENT,
  },
  {
    id: "leave.apply",
    name: "Apply for Leave",
    description: "Submit leave requests",
    category: PERMISSION_CATEGORIES.LEAVE_MANAGEMENT,
  },
  {
    id: "leave.approve",
    name: "Approve Leave",
    description: "Approve or reject leave requests",
    category: PERMISSION_CATEGORIES.LEAVE_MANAGEMENT,
  },
  {
    id: "leave.manage_policies",
    name: "Manage Leave Policies",
    description: "Configure leave types and policies",
    category: PERMISSION_CATEGORIES.LEAVE_MANAGEMENT,
  },

  // Payroll
  {
    id: "payroll.view",
    name: "View Payroll",
    description: "View payroll information and reports",
    category: PERMISSION_CATEGORIES.PAYROLL,
  },
  {
    id: "payroll.process",
    name: "Process Payroll",
    description: "Run payroll calculations and processing",
    category: PERMISSION_CATEGORIES.PAYROLL,
  },
  {
    id: "payroll.edit",
    name: "Edit Payroll",
    description: "Modify payroll data and calculations",
    category: PERMISSION_CATEGORIES.PAYROLL,
  },
  {
    id: "payroll.settings",
    name: "Payroll Settings",
    description: "Configure payroll settings and tax information",
    category: PERMISSION_CATEGORIES.PAYROLL,
  },

  // Performance
  {
    id: "performance.view",
    name: "View Performance",
    description: "View performance reviews and ratings",
    category: PERMISSION_CATEGORIES.PERFORMANCE,
  },
  {
    id: "performance.conduct_reviews",
    name: "Conduct Reviews",
    description: "Create and conduct performance reviews",
    category: PERMISSION_CATEGORIES.PERFORMANCE,
  },
  {
    id: "performance.set_goals",
    name: "Set Goals",
    description: "Set and manage employee goals",
    category: PERMISSION_CATEGORIES.PERFORMANCE,
  },
  {
    id: "performance.view_analytics",
    name: "Performance Analytics",
    description: "View performance analytics and trends",
    category: PERMISSION_CATEGORIES.PERFORMANCE,
  },

  // Recruitment
  {
    id: "recruitment.view",
    name: "View Recruitment",
    description: "View job postings and applications",
    category: PERMISSION_CATEGORIES.RECRUITMENT,
  },
  {
    id: "recruitment.post_jobs",
    name: "Post Jobs",
    description: "Create and publish job postings",
    category: PERMISSION_CATEGORIES.RECRUITMENT,
  },
  {
    id: "recruitment.manage_applications",
    name: "Manage Applications",
    description: "Review and manage job applications",
    category: PERMISSION_CATEGORIES.RECRUITMENT,
  },
  {
    id: "recruitment.schedule_interviews",
    name: "Schedule Interviews",
    description: "Schedule and manage interviews",
    category: PERMISSION_CATEGORIES.RECRUITMENT,
  },

  // Reports
  {
    id: "reports.view",
    name: "View Reports",
    description: "View standard reports and analytics",
    category: PERMISSION_CATEGORIES.REPORTS,
  },
  {
    id: "reports.create",
    name: "Create Reports",
    description: "Create custom reports and dashboards",
    category: PERMISSION_CATEGORIES.REPORTS,
  },
  {
    id: "reports.export",
    name: "Export Reports",
    description: "Export reports in various formats",
    category: PERMISSION_CATEGORIES.REPORTS,
  },
  {
    id: "reports.schedule",
    name: "Schedule Reports",
    description: "Schedule automated report generation",
    category: PERMISSION_CATEGORIES.REPORTS,
  },

  // System Administration
  {
    id: "admin.user_management",
    name: "User Management",
    description: "Manage system users and their access",
    category: PERMISSION_CATEGORIES.SYSTEM_ADMIN,
  },
  {
    id: "admin.role_management",
    name: "Role Management",
    description: "Create and manage user roles and permissions",
    category: PERMISSION_CATEGORIES.SYSTEM_ADMIN,
  },
  {
    id: "admin.system_settings",
    name: "System Settings",
    description: "Configure system-wide settings",
    category: PERMISSION_CATEGORIES.SYSTEM_ADMIN,
  },
  {
    id: "admin.audit_logs",
    name: "Audit Logs",
    description: "View system audit logs and activity",
    category: PERMISSION_CATEGORIES.SYSTEM_ADMIN,
  },
  {
    id: "admin.backup_restore",
    name: "Backup & Restore",
    description: "Manage system backups and restoration",
    category: PERMISSION_CATEGORIES.SYSTEM_ADMIN,
  },
]

export const DEFAULT_ROLES: Role[] = [
  {
    id: "super_admin",
    name: "Super Administrator",
    description: "Full system access with all permissions",
    permissions: ALL_PERMISSIONS.map((p) => p.id),
    isSystem: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "hr_manager",
    name: "HR Manager",
    description: "Full HR management capabilities",
    permissions: [
      "employee.view",
      "employee.create",
      "employee.edit",
      "employee.bulk_import",
      "attendance.view",
      "attendance.edit",
      "attendance.reports",
      "leave.view",
      "leave.approve",
      "leave.manage_policies",
      "payroll.view",
      "payroll.process",
      "performance.view",
      "performance.conduct_reviews",
      "performance.set_goals",
      "recruitment.view",
      "recruitment.post_jobs",
      "recruitment.manage_applications",
      "recruitment.schedule_interviews",
      "reports.view",
      "reports.create",
      "reports.export",
    ],
    isSystem: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "manager",
    name: "Manager",
    description: "Team management and basic HR functions",
    permissions: [
      "employee.view",
      "attendance.view",
      "attendance.reports",
      "leave.view",
      "leave.approve",
      "performance.view",
      "performance.conduct_reviews",
      "performance.set_goals",
      "reports.view",
    ],
    isSystem: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "employee",
    name: "Employee",
    description: "Basic employee self-service access",
    permissions: [
      "employee.view",
      "attendance.view",
      "attendance.mark",
      "leave.view",
      "leave.apply",
      "performance.view",
    ],
    isSystem: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const DEFAULT_ATTRIBUTES: Attribute[] = [
  // Personal Information
  {
    id: "attr_phone",
    name: "Phone Number",
    type: "text",
    required: true,
    category: "Personal Information",
  },
  {
    id: "attr_address",
    name: "Address",
    type: "text",
    required: false,
    category: "Personal Information",
  },
  {
    id: "attr_emergency_contact",
    name: "Emergency Contact",
    type: "text",
    required: true,
    category: "Personal Information",
  },
  {
    id: "attr_date_of_birth",
    name: "Date of Birth",
    type: "date",
    required: false,
    category: "Personal Information",
  },

  // Employment Details
  {
    id: "attr_employee_id",
    name: "Employee ID",
    type: "text",
    required: true,
    category: "Employment Details",
  },
  {
    id: "attr_hire_date",
    name: "Hire Date",
    type: "date",
    required: true,
    category: "Employment Details",
  },
  {
    id: "attr_employment_type",
    name: "Employment Type",
    type: "select",
    options: ["Full-time", "Part-time", "Contract", "Intern"],
    required: true,
    category: "Employment Details",
  },
  {
    id: "attr_work_location",
    name: "Work Location",
    type: "select",
    options: ["Office", "Remote", "Hybrid"],
    required: true,
    category: "Employment Details",
  },

  // Professional Information
  {
    id: "attr_skills",
    name: "Skills",
    type: "text",
    required: false,
    category: "Professional Information",
  },
  {
    id: "attr_certifications",
    name: "Certifications",
    type: "text",
    required: false,
    category: "Professional Information",
  },
  {
    id: "attr_education",
    name: "Education",
    type: "text",
    required: false,
    category: "Professional Information",
  },
  {
    id: "attr_experience_years",
    name: "Years of Experience",
    type: "number",
    required: false,
    category: "Professional Information",
  },

  // Benefits & Compensation
  {
    id: "attr_salary_band",
    name: "Salary Band",
    type: "select",
    options: ["Band 1", "Band 2", "Band 3", "Band 4", "Band 5"],
    required: false,
    category: "Benefits & Compensation",
  },
  {
    id: "attr_health_insurance",
    name: "Health Insurance Enrolled",
    type: "boolean",
    required: false,
    category: "Benefits & Compensation",
  },
  {
    id: "attr_retirement_plan",
    name: "Retirement Plan Enrolled",
    type: "boolean",
    required: false,
    category: "Benefits & Compensation",
  },
]
