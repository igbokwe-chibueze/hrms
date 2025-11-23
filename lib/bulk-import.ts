import type { Employee, BulkImportResult, ImportValidationRule } from "./types"

// Validation rules for employee import
export const EMPLOYEE_IMPORT_RULES: ImportValidationRule[] = [
  {
    field: "firstName",
    required: true,
    type: "string",
    minLength: 1,
    maxLength: 50,
    transform: (value: unknown) => String(value ?? "").trim(),
  },
  {
    field: "lastName",
    required: true,
    type: "string",
    minLength: 1,
    maxLength: 50,
    transform: (value: unknown) => String(value ?? "").trim(),
  },
  {
    field: "email",
    required: true,
    type: "email",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    transform: (value: unknown) => String(value ?? "").toLowerCase().trim(),
  },
  {
    field: "personalEmail",
    required: false,
    type: "email",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    transform: (value: unknown) =>
      value ? String(value).toLowerCase().trim() : undefined,
  },
  {
    field: "phone",
    required: false,
    type: "string",
    pattern: /^[+]?[1-9][\d]{0,15}$/,
    transform: (value: unknown) =>
      value ? String(value).replace(/\D/g, "") : undefined,
  },
  {
    field: "department",
    required: true,
    type: "select",
    options: [
      "Engineering",
      "Marketing",
      "Sales",
      "Human Resources",
      "Finance",
      "Operations",
      "Executive",
    ],
    transform: (value: unknown) => String(value ?? "").trim(),
  },
  {
    field: "position",
    required: true,
    type: "string",
    minLength: 1,
    maxLength: 100,
    transform: (value: unknown) => String(value ?? "").trim(),
  },
  {
    field: "hireDate",
    required: true,
    type: "date",
    transform: (value: unknown) => {
      if (value instanceof Date)
        return value.toISOString().split("T")[0]

      const date = new Date(String(value ?? ""))
      return isNaN(date.getTime())
        ? null
        : date.toISOString().split("T")[0]
    },
  },
  {
    field: "salary",
    required: false,
    type: "number",
    transform: (value: unknown) => {
      if (!value) return undefined
      const num = Number.parseFloat(String(value).replace(/[,$]/g, ""))
      return isNaN(num) ? null : num
    },
  },
  {
    field: "location",
    required: true,
    type: "string",
    minLength: 1,
    maxLength: 100,
    transform: (value: unknown) => String(value ?? "").trim(),
  },
  {
    field: "status",
    required: false,
    type: "select",
    options: ["active", "inactive", "terminated"],
    transform: (value: unknown) =>
      value ? String(value).toLowerCase().trim() : "active",
  },
  {
    field: "skills",
    required: false,
    type: "string",
    transform: (value: unknown) => {
      if (!value) return []
      return String(value)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    },
  },
]

// -------------------------------
// CSV Parsing
// -------------------------------
export function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/"/g, ""))

  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === 0) continue

    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] ?? ""
    })

    rows.push(row)
  }

  return rows
}

// Parse a single CSV line
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

// -------------------------------
// VALIDATION
// -------------------------------
export function validateEmployeeData(
  rawData: Record<string, unknown>[],
  organizationId: string,
  rules: ImportValidationRule[] = EMPLOYEE_IMPORT_RULES,
): BulkImportResult {
  const result: BulkImportResult = {
    success: false,
    totalRows: rawData.length,
    successfulRows: 0,
    failedRows: 0,
    errors: [],
    warnings: [],
    data: [],
  }

  rawData.forEach((row, index) => {
    const rowNumber = index + 1

    const employee: Partial<Employee> = {
      id: `emp-${Date.now()}-${index}`,
      employeeId: `EMP${String(Date.now()).slice(-6)}${String(index).padStart(3, "0")}`,
      organizationId,
      updatedAt: new Date(),
    }

    let hasErrors = false

    // Apply rule validations
    rules.forEach((rule) => {
      const value = row[rule.field]

      // Required
      if (rule.required && (!value || String(value).trim() === "")) {
        result.errors.push({
          row: rowNumber,
          field: rule.field,
          message: `${rule.field} is required`,
          value,
        })
        hasErrors = true
        return
      }

      // Optional empty → skip
      if (!rule.required && (!value || String(value).trim() === "")) return

      // Transform
      let transformedValue = value
      if (rule.transform) {
        try {
          transformedValue = rule.transform(value)
        } catch {
          result.errors.push({
            row: rowNumber,
            field: rule.field,
            message: `Invalid format for ${rule.field}`,
            value,
          })
          hasErrors = true
          return
        }
      }

      // Type validation
      switch (rule.type) {
        case "email":
          if (rule.pattern && !rule.pattern.test(String(transformedValue))) {
            result.errors.push({
              row: rowNumber,
              field: rule.field,
              message: `Invalid email format for ${rule.field}`,
              value,
            })
            hasErrors = true
          }
          break

        case "number":
          if (
            transformedValue !== undefined &&
            transformedValue !== null &&
            isNaN(Number(transformedValue))
          ) {
            result.errors.push({
              row: rowNumber,
              field: rule.field,
              message: `${rule.field} must be a valid number`,
              value,
            })
            hasErrors = true
          }
          break

        case "date":
          if (transformedValue === null) {
            result.errors.push({
              row: rowNumber,
              field: rule.field,
              message: `Invalid date format for ${rule.field}`,
              value,
            })
            hasErrors = true
          }
          break

        case "select":
          if (
            rule.options &&
            !rule.options.includes(String(transformedValue))
          ) {
            result.errors.push({
              row: rowNumber,
              field: rule.field,
              message: `${rule.field} must be one of: ${rule.options.join(", ")}`,
              value,
            })
            hasErrors = true
          }
          break

        case "string":
          const str = String(transformedValue)

          if (rule.minLength && str.length < rule.minLength) {
            result.errors.push({
              row: rowNumber,
              field: rule.field,
              message: `${rule.field} must be at least ${rule.minLength} characters`,
              value,
            })
            hasErrors = true
          }

          if (rule.maxLength && str.length > rule.maxLength) {
            result.errors.push({
              row: rowNumber,
              field: rule.field,
              message: `${rule.field} must be no more than ${rule.maxLength} characters`,
              value,
            })
            hasErrors = true
          }

          if (rule.pattern && !rule.pattern.test(str)) {
            result.errors.push({
              row: rowNumber,
              field: rule.field,
              message: `Invalid format for ${rule.field}`,
              value,
            })
            hasErrors = true
          }
          break
      }

      if (!hasErrors || !rule.required) {
        (employee as Record<string, unknown>)[rule.field] = transformedValue
      }
    })

    // More validations
    if (!hasErrors) {
      // Duplicate emails
      const duplicateEmail = result.data.find((emp) => emp.orgEmail === employee.orgEmail)
      if (duplicateEmail) {
        result.warnings.push({
          row: rowNumber,
          field: "email",
          message: "Duplicate email found in import data",
          value: employee.orgEmail,
        })
      }

      // Manager validation
      const managerEmail = typeof row.manager === "string" ? row.manager.trim() : ""
      if (managerEmail) {
        const managerExists = result.data.find((emp) => emp.orgEmail === managerEmail)
        if (!managerExists) {
          result.warnings.push({
            row: rowNumber,
            field: "manager",
            message: "Manager email not found in import",
            value: managerEmail,
          })
        }
      }
    }

    if (hasErrors) {
      result.failedRows++
    } else {
      result.successfulRows++
      result.data.push(employee as Employee)
    }
  })

  result.success = result.failedRows === 0
  return result
}

// ------------------------------------
// Sample CSV
// ------------------------------------
export function generateSampleCSV(): string {
  const headers = [
    "firstName",
    "lastName",
    "email",
    "personalEmail",
    "phone",
    "department",
    "position",
    "hireDate",
    "salary",
    "location",
    "status",
    "skills",
    "manager",
  ]

  const sampleData = [
    [
      "John",
      "Doe",
      "john.doe@company.com",
      "john.doe@gmail.com",
      "+1-555-0123",
      "Engineering",
      "Senior Developer",
      "2024-01-15",
      "95000",
      "San Francisco, CA",
      "active",
      "React, Node.js, TypeScript",
      "jane.smith@company.com",
    ],
    [
      "Jane",
      "Smith",
      "jane.smith@company.com",
      "jane.smith@gmail.com",
      "+1-555-0124",
      "Engineering",
      "Engineering Manager",
      "2024-01-10",
      "120000",
      "San Francisco, CA",
      "active",
      "Team Leadership, Architecture",
      "",
    ],
    [
      "Mike",
      "Johnson",
      "mike.johnson@company.com",
      "",
      "+1-555-0125",
      "Marketing",
      "Marketing Specialist",
      "2024-01-20",
      "65000",
      "New York, NY",
      "active",
      "Digital Marketing, SEO",
      "",
    ],
  ]

  const csvContent = [
    headers.join(","),
    ...sampleData.map((row) =>
      row.map((cell) =>
        cell.includes(",") || cell.includes('"')
          ? `"${cell.replace(/"/g, '""')}"`
          : cell,
      ).join(","),
    ),
  ].join("\n")

  return csvContent
}

// ------------------------------------
// Simulate processing
// ------------------------------------
export async function processBulkImport(
  employees: Employee[],
  organizationId: string,
): Promise<{ success: boolean; message: string; importedCount: number }> {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    console.log(
      `Processing bulk import of ${employees.length} employees for organization ${organizationId}`,
    )

    const successRate = 0.9
    const importedCount = Math.floor(employees.length * successRate)

    return {
      success: true,
      message: `Successfully imported ${importedCount} out of ${employees.length} employees`,
      importedCount,
    }
  } catch {
    return {
      success: false,
      message: "Failed to process bulk import",
      importedCount: 0,
    }
  }
}
