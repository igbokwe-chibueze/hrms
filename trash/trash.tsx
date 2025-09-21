"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ROLES, CURRENT_ORGANIZATION } from "@/lib/dummy-data"
import type { Employee, EmergencyContact } from "@/lib/types"

interface EmployeeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: Employee | null
  onSave: (employee: Employee) => void
}

const initialEmergencyContact: EmergencyContact = {
  name: "",
  phone: "",
  relationship: "",
};

export function EmployeeForm({ open, onOpenChange, employee, onSave }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    personalEmail: "",
    orgEmail: "",
    employeeId: "",
    jobTitle: "",
    department: "",
    roleId: "employee",
    employmentType: "full-time" as const,
    workLocation: "on-site" as const,
    startDate: new Date(),
    endDate: undefined as Date | undefined,
    salary: "",
    currency: CURRENT_ORGANIZATION.settings.currency,
    managerId: "",
    emergencyContact: initialEmergencyContact,
    skills: [] as string[],
    notes: "",
  })

  const [newSkill, setNewSkill] = useState("")
  const [startDateOpen, setStartDateOpen] = useState(false)

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.user.name,
        personalEmail: employee.user.personalEmail || "",
        orgEmail: employee.orgEmail,
        employeeId: employee.employeeId,
        jobTitle: employee.jobTitle,
        department: employee.department,
        roleId: employee.roleId,
        employmentType: employee.employmentType,
        workLocation: employee.workLocation,
        startDate: employee.startDate,
        endDate: employee.endDate,
        salary: employee.salary?.toString() || "",
        currency: employee.currency || CURRENT_ORGANIZATION.settings.currency,
        managerId: employee.managerId || "",
        emergencyContact: employee.emergencyContact || initialEmergencyContact,
        skills: employee.skills || [],
        notes: employee.notes || "",
      })
    } else {
      setFormData({
        name: "",
        personalEmail: "",
        orgEmail: "",
        employeeId: "",
        jobTitle: "",
        department: "",
        roleId: "employee",
        employmentType: "full-time",
        workLocation: "on-site",
        startDate: new Date(),
        endDate: undefined,
        salary: "",
        currency: CURRENT_ORGANIZATION.settings.currency,
        managerId: "",
        emergencyContact: initialEmergencyContact,
        skills: [],
        notes: "",
      })
    }
  }, [employee, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const employeeData: Employee = {
      id: employee?.id || `emp-${Date.now()}`,
      userId: employee?.userId || `user-${Date.now()}`,
      organizationId: CURRENT_ORGANIZATION.id,
      orgEmail: formData.orgEmail,
      roleId: formData.roleId,
      status: "active",
      joinedAt: employee?.joinedAt || new Date(),
      updatedAt: new Date(),
      user: {
        id: employee?.user.id || `user-${Date.now()}`,
        name: formData.name,
        personalEmail: formData.personalEmail || undefined,
        createdAt: employee?.user.createdAt || new Date(),
        updatedAt: new Date(),
      },
      organization: CURRENT_ORGANIZATION,
      employeeId: formData.employeeId,
      jobTitle: formData.jobTitle,
      department: formData.department,
      managerId: formData.managerId || undefined,
      employmentType: formData.employmentType,
      workLocation: formData.workLocation,
      startDate: formData.startDate,
      endDate: formData.endDate,
      salary: formData.salary ? Number(formData.salary) : undefined,
      currency: formData.currency,
      emergencyContact: formData.emergencyContact.name ? formData.emergencyContact : undefined,
      skills: formData.skills,
      notes: formData.notes || undefined,
    }

    onSave(employeeData)
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl">{employee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>
            {employee ? "Update employee information" : "Add a new employee to your organization"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>Basic employee details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="personalEmail">Personal Email</Label>
                    <Input
                      id="personalEmail"
                      type="email"
                      value={formData.personalEmail}
                      onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgEmail">Organization Email *</Label>
                    <Input
                      id="orgEmail"
                      type="email"
                      value={formData.orgEmail}
                      onChange={(e) => setFormData({ ...formData, orgEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Information</CardTitle>
                <CardDescription>Role, department, and employment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="roleId">Role *</Label>
                    <Select
                      value={formData.roleId}
                      onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managerId">Manager ID</Label>
                    <Input
                      id="managerId"
                      value={formData.managerId}
                      onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type *</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value: any) => setFormData({ ...formData, employmentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workLocation">Work Location *</Label>
                    <Select
                      value={formData.workLocation}
                      onValueChange={(value: any) => setFormData({ ...formData, workLocation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => {
                            setFormData({ ...formData, startDate: date || new Date() })
                            setStartDateOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compensation</CardTitle>
                <CardDescription>Salary and compensation details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Annual Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contact</CardTitle>
                <CardDescription>Emergency contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, name: e.target.value },
                        }))
                      }
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone Number</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, phone: e.target.value },
                        }))
                      }
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, relationship: e.target.value },
                        }))
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
                <CardDescription>Employee skills and competencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addSkill} size="sm" className="flex-shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <span className="truncate max-w-[120px]">{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-600 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
                <CardDescription>Any additional information about the employee</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes..."
                  rows={3}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </form>
        </ScrollArea>

        <div className="flex justify-end gap-2 p-6 border-t flex-shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {employee ? "Update Employee" : "Add Employee"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}