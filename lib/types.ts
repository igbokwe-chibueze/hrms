// lib/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  personalEmail?: string;
  avatar?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// EmergencyContact type for clarity
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  settings: {
    allowPersonalEmails: boolean;
    requireTwoFactor: boolean;
    maxEmployees: number;
    currency: string; // Add currency setting
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  joinedAt: Date;
  status: "active" | "inactive" | "pending";
}

export interface Employee {
  id: string;
  userId: string;
  organizationId: string;
  orgEmail: string;
  roleId: string; // Matches the form's roleId
  status: "active" | "inactive" | "terminated";
  joinedAt: Date; // Changed to Date
  updatedAt: Date; // Changed to Date
  user: {
    id: string;
    name: string;
    email: string;
    personalEmail?: string;
    avatar?: string,
    createdAt: Date;
    updatedAt: Date;
  };
  organization?: Organization; // Add a reference to the organization
  employeeId: string;
  jobTitle: string;
  department: string;
  managerId?: string; // Matches the form's managerId
  employmentType: "full-time" | "part-time" | "contract" | "intern";
  workLocation: "remote" | "on-site" | "hybrid"; // Renamed from location to workLocation
  startDate: Date;
  endDate?: Date;
  salary?: number;
  currency?: string;
  emergencyContact?: EmergencyContact;
  skills: string[];
  notes?: string;
}

export interface BulkImportResult {
  success: boolean;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value: unknown;
  }>;
  warnings: Array<{
    row: number;
    field: string;
    message: string;
    value: unknown;
  }>;
  data: Employee[];
}

export interface ImportValidationRule {
  field: string;
  required: boolean;
  type: "string" | "number" | "email" | "date" | "select";
  options?: string[];
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  transform?: (value: unknown) => unknown;
}
