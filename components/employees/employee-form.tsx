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
import { DUMMY_ORGANIZATIONS } from "@/lib/dummy-data"
import type { Employee, EmergencyContact } from "@/lib/types"
import { DEFAULT_ROLES } from "@/lib/permissions"

const CURRENT_ORGANIZATION = DUMMY_ORGANIZATIONS[0]

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
}

export function EmployeeForm({ open, onOpenChange, employee, onSave }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    personalEmail: "",
    orgEmail: "",
    employeeId: "",
    jobTitle: "",
    department: "",
    roleId: DEFAULT_ROLES[0]?.id || "",
    employmentType: "full-time" as Employee["employmentType"],
    workLocation: "on-site" as Employee["workLocation"],
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
      setFormData((prev) => ({
        ...prev,
        roleId: DEFAULT_ROLES[0]?.id || "",
        employmentType: "full-time",
        workLocation: "on-site",
        startDate: new Date(),
        endDate: undefined,
        currency: CURRENT_ORGANIZATION.settings.currency,
        emergencyContact: initialEmergencyContact,
        skills: [],
        notes: "",
      }))
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
      status: employee?.status || "active",
      joinedAt: employee?.joinedAt || new Date(),
      updatedAt: new Date(),
      user: {
        id: employee?.user.id || `user-${Date.now()}`,
        name: formData.name,
        email: formData.orgEmail, // ✅ User.email maps to orgEmail
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
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-scroll">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl">{employee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>
            {employee ? "Update employee information" : "Add a new employee to your organization"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* ---- Personal Information ---- */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Details about the employee</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Full Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <Label>Personal Email</Label>
                  <Input
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Organization Email</Label>
                  <Input
                    type="email"
                    value={formData.orgEmail}
                    onChange={(e) => setFormData({ ...formData, orgEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Employee ID</Label>
                  <Input value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* ---- Job Details ---- */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Job Title</Label>
                  <Input value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
                </div>
                <div>
                  <Label>Department</Label>
                  <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={formData.roleId} onValueChange={(value) => setFormData({ ...formData, roleId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_ROLES.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                      {/* {DEFAULT_ROLES.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Employment Type</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value: Employee["employmentType"]) => setFormData({ ...formData, employmentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Work Location</Label>
                  <Select
                    value={formData.workLocation}
                    onValueChange={(value: Employee["workLocation"]) => setFormData({ ...formData, workLocation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-site">On-site</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* ---- Start & End Dates ---- */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Dates</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Start Date</Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* ---- Skills ---- */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Enter skill" />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
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
          <Button type="submit" form="">{employee ? "Update Employee" : "Add Employee"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
