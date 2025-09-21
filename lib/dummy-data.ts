// lib/dummy-data.ts
import type { User, Organization, OrganizationMember, Employee } from "./types";

// Users with personal emails
export const DUMMY_USERS: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@acmecorp.com",
    personalEmail: "john.doe.personal@gmail.com",
    avatar: "/generic-person.png",
    role: "hr_manager",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@acmecorp.com",
    personalEmail: "jane.smith.personal@gmail.com",
    avatar: "/jane-smith-portrait.png",
    role: "manager",
    createdAt: new Date("2024-01-02T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z"),
  },
  {
    id: "user-3",
    name: "Mike Johnson",
    email: "mike.johnson@techstartup.io",
    personalEmail: "mike.johnson.personal@gmail.com",
    avatar: "/mike-johnson-speaker.png",
    role: "super_admin",
    createdAt: new Date("2024-01-03T00:00:00Z"),
    updatedAt: new Date("2024-01-03T00:00:00Z"),
  },
  {
    id: "user-4",
    name: "Sarah Wilson",
    email: "sarah.wilson@globalenterprises.com",
    personalEmail: "sarah.wilson.personal@gmail.com",
    avatar: "/sarah-wilson-portrait.png",
    role: "hr_manager",
    createdAt: new Date("2024-01-04T00:00:00Z"),
    updatedAt: new Date("2024-01-04T00:00:00Z"),
  },
  {
    id: "user-5",
    name: "David Brown",
    email: "david.brown@acmecorp.com",
    personalEmail: "david.brown.personal@gmail.com",
    avatar: "/david-brown-portrait.png",
    role: "employee",
    createdAt: new Date("2024-01-05T00:00:00Z"),
    updatedAt: new Date("2024-01-05T00:00:00Z"),
  },
];

// Organizations with different settings
export const DUMMY_ORGANIZATIONS: Organization[] = [
  {
    id: "org-1",
    name: "Acme Corporation",
    domain: "acmecorp.com",
    logo: "/generic-company-logo.png",
    settings: {
      allowPersonalEmails: true,
      requireTwoFactor: false,
      maxEmployees: 500,
      currency: "USD",
    },
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "org-2",
    name: "Tech Startup Inc",
    domain: "techstartup.io",
    logo: "/tech-startup-logo.png",
    settings: {
      allowPersonalEmails: false,
      requireTwoFactor: true,
      maxEmployees: 100,
      currency: "USD",
    },
    createdAt: new Date("2024-01-02T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z"),
  },
  {
    id: "org-3",
    name: "Global Enterprises",
    domain: "globalenterprises.com",
    logo: "/placeholder-9bsuu.png",
    settings: {
      allowPersonalEmails: true,
      requireTwoFactor: true,
      maxEmployees: 1000,
      currency: "EUR",
    },
    createdAt: new Date("2024-01-03T00:00:00Z"),
    updatedAt: new Date("2024-01-03T00:00:00Z"),
  },
];

// Organization memberships (cross-organization support)
export const DUMMY_ORGANIZATION_MEMBERS: OrganizationMember[] = [
  // John Doe - Member of Acme Corp (HR Manager)
  {
    id: "member-1",
    userId: "user-1",
    organizationId: "org-1",
    role: "hr_manager",
    joinedAt: new Date("2024-01-01T00:00:00Z"),
    status: "active",
  },
  // Jane Smith - Member of Acme Corp (Manager)
  {
    id: "member-2",
    userId: "user-2",
    organizationId: "org-1",
    role: "manager",
    joinedAt: new Date("2024-01-02T00:00:00Z"),
    status: "active",
  },
  // Mike Johnson - Member of Tech Startup (Super Admin)
  {
    id: "member-3",
    userId: "user-3",
    organizationId: "org-2",
    role: "super_admin",
    joinedAt: new Date("2024-01-03T00:00:00Z"),
    status: "active",
  },
  // Sarah Wilson - Member of Global Enterprises (HR Manager)
  {
    id: "member-4",
    userId: "user-4",
    organizationId: "org-3",
    role: "hr_manager",
    joinedAt: new Date("2024-01-04T00:00:00Z"),
    status: "active",
  },
  // David Brown - Member of Acme Corp (Employee)
  {
    id: "member-5",
    userId: "user-5",
    organizationId: "org-1",
    role: "employee",
    joinedAt: new Date("2024-01-05T00:00:00Z"),
    status: "active",
  },
  // Cross-organization membership: John Doe also consultant at Tech Startup
  {
    id: "member-6",
    userId: "user-1",
    organizationId: "org-2",
    role: "manager",
    joinedAt: new Date("2024-01-10T00:00:00Z"),
    status: "active",
  },
];

// Dummy data for roles
export const DUMMY_ROLES = [
  { id: "role-1", name: "HR Manager" },
  { id: "role-2", name: "Engineering Manager" },
  { id: "role-3", name: "Senior Developer" },
  { id: "role-4", name: "CEO" },
  { id: "role-5", name: "Lead Developer" },
  { id: "role-6", name: "VP of HR" },
];

// Sample employees for each organization
export const DUMMY_EMPLOYEES: Employee[] = [
  // Acme Corporation employees
  {
    id: "emp-1",
    userId: "user-1",
    orgEmail: "john.doe@acmecorp.com",
    employeeId: "ACME001",
    jobTitle: "HR Manager",
    department: "Human Resources",
    managerId: undefined,
    employmentType: "full-time",
    workLocation: "on-site",
    startDate: new Date("2024-01-01T00:00:00Z"),
    joinedAt: new Date("2024-01-01T00:00:00Z"),
    status: "active",
    salary: 85000,
    currency: "USD",
    skills: ["HR Management", "Recruitment", "Employee Relations"],
    organizationId: "org-1",
    updatedAt: new Date("2024-01-01T00:00:00Z"),
    roleId: "role-1",
    user: DUMMY_USERS.find((user) => user.id === "user-1")!,
  },
  {
    id: "emp-2",
    userId: "user-2",
    orgEmail: "jane.smith@acmecorp.com",
    employeeId: "ACME002",
    jobTitle: "Engineering Manager",
    department: "Engineering",
    managerId: "emp-1",
    employmentType: "full-time",
    workLocation: "on-site",
    startDate: new Date("2024-01-02T00:00:00Z"),
    joinedAt: new Date("2024-01-02T00:00:00Z"),
    status: "active",
    salary: 120000,
    currency: "USD",
    skills: ["Team Leadership", "Software Architecture", "Project Management"],
    organizationId: "org-1",
    updatedAt: new Date("2024-01-02T00:00:00Z"),
    roleId: "role-2",
    user: DUMMY_USERS.find((user) => user.id === "user-2")!,
  },
  {
    id: "emp-3",
    userId: "user-5",
    orgEmail: "david.brown@acmecorp.com",
    employeeId: "ACME003",
    jobTitle: "Senior Developer",
    department: "Engineering",
    managerId: "emp-2",
    employmentType: "full-time",
    workLocation: "on-site",
    startDate: new Date("2024-01-05T00:00:00Z"),
    joinedAt: new Date("2024-01-05T00:00:00Z"),
    status: "active",
    salary: 95000,
    currency: "USD",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    organizationId: "org-1",
    updatedAt: new Date("2024-01-05T00:00:00Z"),
    roleId: "role-3",
    user: DUMMY_USERS.find((user) => user.id === "user-5")!,
  },

  // Tech Startup employees
  {
    id: "emp-4",
    userId: "user-3",
    orgEmail: "mike.johnson@techstartup.io",
    employeeId: "TECH001",
    jobTitle: "CEO",
    department: "Executive",
    managerId: undefined,
    employmentType: "full-time",
    workLocation: "on-site",
    startDate: new Date("2024-01-03T00:00:00Z"),
    joinedAt: new Date("2024-01-03T00:00:00Z"),
    status: "active",
    salary: 200000,
    currency: "USD",
    skills: ["Leadership", "Strategy", "Fundraising", "Product Vision"],
    organizationId: "org-2",
    updatedAt: new Date("2024-01-03T00:00:00Z"),
    roleId: "role-4",
    user: DUMMY_USERS.find((user) => user.id === "user-3")!,
  },
  {
    id: "emp-5",
    userId: "user-1", // Cross-organization employee
    orgEmail: "john.doe@techstartup.io",
    employeeId: "TECH002",
    jobTitle: "Lead Developer",
    department: "Engineering",
    managerId: "emp-4",
    employmentType: "full-time",
    workLocation: "remote",
    startDate: new Date("2024-01-10T00:00:00Z"),
    joinedAt: new Date("2024-01-10T00:00:00Z"),
    status: "active",
    salary: 110000,
    currency: "USD",
    skills: ["Python", "Machine Learning", "Data Science", "AI"],
    organizationId: "org-2",
    updatedAt: new Date("2024-01-10T00:00:00Z"),
    roleId: "role-5",
    user: DUMMY_USERS.find((user) => user.id === "user-1")!,
  },

  // Global Enterprises employees
  {
    id: "emp-6",
    userId: "user-4",
    orgEmail: "sarah.wilson@globalenterprises.com",
    employeeId: "GLOBAL001",
    jobTitle: "VP of HR",
    department: "Human Resources",
    managerId: undefined,
    employmentType: "full-time",
    workLocation: "on-site",
    startDate: new Date("2024-01-04T00:00:00Z"),
    joinedAt: new Date("2024-01-04T00:00:00Z"),
    status: "active",
    salary: 150000,
    currency: "EUR",
    skills: ["Strategic HR", "Organizational Development", "Change Management"],
    organizationId: "org-3",
    updatedAt: new Date("2024-01-04T00:00:00Z"),
    roleId: "role-6",
    user: DUMMY_USERS.find((user) => user.id === "user-4")!,
  },
];

// Helper functions to get data for current user/organization
export function getCurrentUser(): User {
  // In a real app, this would come from authentication context
  return DUMMY_USERS[0]; // John Doe
}

export function getUserOrganizations(userId: string): Array<Organization & { role: string }> {
  const memberships = DUMMY_ORGANIZATION_MEMBERS.filter((m) => m.userId === userId && m.status === "active");
  return memberships.map((membership) => {
    const org = DUMMY_ORGANIZATIONS.find((o) => o.id === membership.organizationId)!;
    return {
      ...org,
      role: membership.role,
    };
  });
}

export function getOrganizationEmployees(organizationId: string): Employee[] {
  return DUMMY_EMPLOYEES.filter((emp) => emp.organizationId === organizationId);
}

export function getCurrentOrganization(): Organization {
  // In a real app, this would come from user context/selection
  return DUMMY_ORGANIZATIONS[0]; // Acme Corporation
}

export function getUserRoleInOrganization(userId: string, organizationId: string): string {
  const membership = DUMMY_ORGANIZATION_MEMBERS.find(
    (m) => m.userId === userId && m.organizationId === organizationId && m.status === "active",
  );
  return membership?.role || "employee";
}

export function getRoleById(roleId: string) {
  return DUMMY_ROLES.find((role) => role.id === roleId);
}
