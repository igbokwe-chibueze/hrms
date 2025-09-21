"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, Shield, Users, Settings, AlertTriangle } from "lucide-react"
import {
  ALL_PERMISSIONS,
  DEFAULT_ROLES,
  PERMISSION_CATEGORIES,
  type Role,
  type Permission,
  type Attribute,
  DEFAULT_ATTRIBUTES,
} from "@/lib/permissions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES)
  const [attributes, setAttributes] = useState<Attribute[]>(DEFAULT_ATTRIBUTES)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    type: "text" as const,
    options: [] as string[],
    required: false,
    category: "",
  })

  // Bulk selection state and handlers
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [isBulkPermissionDialogOpen, setIsBulkPermissionDialogOpen] = useState(false)
  const [bulkPermissions, setBulkPermissions] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<"add" | "remove" | "replace">("add")

  const handleCreateRole = () => {
    if (!newRole.name.trim()) return

    const role: Role = {
      id: `role-${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setRoles([...roles, role])
    setNewRole({ name: "", description: "", permissions: [] })
    setIsRoleDialogOpen(false)
  }

  const handleUpdateRole = () => {
    if (!editingRole) return

    setRoles(
      roles.map((role) =>
        role.id === editingRole.id ? { ...editingRole, updatedAt: new Date().toISOString() } : role,
      ),
    )
    setEditingRole(null)
    setIsRoleDialogOpen(false)
  }

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    if (role?.isSystem) {
      alert("Cannot delete system roles")
      return
    }

    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((r) => r.id !== roleId))
    }
  }

  const handleCreateAttribute = () => {
    if (!newAttribute.name.trim()) return

    const attribute: Attribute = {
      id: `attr-${Date.now()}`,
      name: newAttribute.name,
      type: newAttribute.type,
      options: newAttribute.options,
      required: newAttribute.required,
      category: newAttribute.category,
    }

    setAttributes([...attributes, attribute])
    setNewAttribute({ name: "", type: "text", options: [], required: false, category: "" })
    setIsAttributeDialogOpen(false)
  }

  const handlePermissionToggle = (permissionId: string, isRole = true) => {
    if (isRole) {
      if (editingRole) {
        const permissions = editingRole.permissions.includes(permissionId)
          ? editingRole.permissions.filter((p) => p !== permissionId)
          : [...editingRole.permissions, permissionId]
        setEditingRole({ ...editingRole, permissions })
      } else {
        const permissions = newRole.permissions.includes(permissionId)
          ? newRole.permissions.filter((p) => p !== permissionId)
          : [...newRole.permissions, permissionId]
        setNewRole({ ...newRole, permissions })
      }
    }
  }

  const openRoleDialog = (role?: Role) => {
    if (role) {
      setEditingRole({ ...role })
    } else {
      setNewRole({ name: "", description: "", permissions: [] })
      setEditingRole(null)
    }
    setIsRoleDialogOpen(true)
  }

  const openAttributeDialog = (attribute?: Attribute) => {
    if (attribute) {
      setEditingAttribute({ ...attribute })
    } else {
      setNewAttribute({ name: "", type: "text", options: [], required: false, category: "" })
      setEditingAttribute(null)
    }
    setIsAttributeDialogOpen(true)
  }

  const handleBulkPermissionUpdate = () => {
    if (selectedRoles.length === 0) return

    setRoles(
      roles.map((role) => {
        if (!selectedRoles.includes(role.id) || role.isSystem) return role

        let updatedPermissions = [...role.permissions]

        switch (bulkAction) {
          case "add":
            bulkPermissions.forEach((permission) => {
              if (!updatedPermissions.includes(permission)) {
                updatedPermissions.push(permission)
              }
            })
            break
          case "remove":
            updatedPermissions = updatedPermissions.filter((p) => !bulkPermissions.includes(p))
            break
          case "replace":
            updatedPermissions = [...bulkPermissions]
            break
        }

        return {
          ...role,
          permissions: updatedPermissions,
          updatedAt: new Date().toISOString(),
        }
      }),
    )

    setSelectedRoles([])
    setBulkPermissions([])
    setIsBulkPermissionDialogOpen(false)
  }

  const handleSelectAllRoles = (checked: boolean) => {
    if (checked) {
      setSelectedRoles(roles.filter((r) => !r.isSystem).map((r) => r.id))
    } else {
      setSelectedRoles([])
    }
  }

  const handleRoleSelection = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, roleId])
    } else {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId))
    }
  }

  const handleBulkPermissionToggle = (permissionId: string) => {
    if (bulkPermissions.includes(permissionId)) {
      setBulkPermissions(bulkPermissions.filter((p) => p !== permissionId))
    } else {
      setBulkPermissions([...bulkPermissions, permissionId])
    }
  }

  const groupedPermissions = ALL_PERMISSIONS.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  const groupedAttributes = attributes.reduce(
    (acc, attribute) => {
      if (!acc[attribute.category]) {
        acc[attribute.category] = []
      }
      acc[attribute.category].push(attribute)
      return acc
    },
    {} as Record<string, Attribute[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Roles & Permissions Management</h1>
          <p className="text-muted-foreground">Configure user roles, permissions, and employee attributes</p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="roles" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Roles & Permissions</span>
            <span className="sm:hidden">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="attributes" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Employee Attributes</span>
            <span className="sm:hidden">Attributes</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">System Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5" />
                  User Roles
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage user roles and their associated permissions
                </CardDescription>
              </div>
              <Button onClick={() => openRoleDialog()} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create Role</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="space-y-4">
                {selectedRoles.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedRoles.length} roles selected</Badge>
                      <span className="text-sm text-muted-foreground">(System roles excluded from bulk actions)</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsBulkPermissionDialogOpen(true)}
                        disabled={selectedRoles.length === 0}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Bulk Permissions
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedRoles([])}>
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                )}

                <div className="min-w-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedRoles.length === roles.filter((r) => !r.isSystem).length &&
                              roles.filter((r) => !r.isSystem).length > 0
                            }
                            onCheckedChange={handleSelectAllRoles}
                            aria-label="Select all roles"
                          />
                        </TableHead>
                        <TableHead>Role Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRoles.includes(role.id)}
                              onCheckedChange={(checked) => handleRoleSelection(role.id, !!checked)}
                              disabled={role.isSystem}
                              aria-label={`Select ${role.name}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <div>{role.name}</div>
                              <div className="text-xs text-muted-foreground sm:hidden">{role.description}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{role.description}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {role.permissions.length} permissions
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={role.isSystem ? "default" : "outline"} className="text-xs">
                              {role.isSystem ? "System" : "Custom"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" onClick={() => openRoleDialog(role)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              {!role.isSystem && (
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteRole(role.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attributes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  Employee Attributes
                </CardTitle>
                <CardDescription className="text-sm">
                  Define custom fields and attributes for employee profiles
                </CardDescription>
              </div>
              <Button onClick={() => openAttributeDialog()} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Attribute</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedAttributes).map(([category, attrs]) => (
                  <div key={category}>
                    <h3 className="text-base sm:text-lg font-semibold mb-3">{category}</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {attrs.map((attribute) => (
                        <Card key={attribute.id}>
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-sm">{attribute.name}</h4>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" onClick={() => openAttributeDialog(attribute)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <p>Type: {attribute.type}</p>
                              {attribute.required && (
                                <Badge variant="secondary" className="text-xs">
                                  Required
                                </Badge>
                              )}
                              {attribute.options && attribute.options.length > 0 && (
                                <p className="truncate">Options: {attribute.options.join(", ")}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roles.length}</div>
                <p className="text-xs text-muted-foreground">
                  {roles.filter((r) => r.isSystem).length} system, {roles.filter((r) => !r.isSystem).length} custom
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ALL_PERMISSIONS.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across {Object.keys(PERMISSION_CATEGORIES).length} categories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employee Attributes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attributes.length}</div>
                <p className="text-xs text-muted-foreground">
                  {attributes.filter((a) => a.required).length} required fields
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Permission Categories</CardTitle>
              <CardDescription className="text-sm">
                Overview of all permission categories and their usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <Card key={category}>
                    <CardContent className="p-3 sm:p-4">
                      <h4 className="font-medium mb-2 text-sm">{category}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{permissions.length} permissions</p>
                      <div className="space-y-1">
                        {permissions.slice(0, 3).map((permission) => (
                          <p key={permission.id} className="text-xs text-muted-foreground truncate">
                            • {permission.name}
                          </p>
                        ))}
                        {permissions.length > 3 && (
                          <p className="text-xs text-muted-foreground">... and {permissions.length - 3} more</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Creation/Edit Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="w-[95vw] max-w-6xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl">
              {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingRole ? "Modify role details and permissions" : "Define a new role with specific permissions"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6 pr-4">
              {/* Basic Info Section */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roleName" className="text-sm font-medium">
                    Role Name
                  </Label>
                  <Input
                    id="roleName"
                    value={editingRole ? editingRole.name : newRole.name}
                    onChange={(e) =>
                      editingRole
                        ? setEditingRole({ ...editingRole, name: e.target.value })
                        : setNewRole({ ...newRole, name: e.target.value })
                    }
                    placeholder="Enter role name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Role Type</Label>
                  <div className="flex items-center pt-2">
                    <Badge variant={editingRole?.isSystem ? "default" : "outline"} className="text-xs">
                      {editingRole?.isSystem ? "System Role" : "Custom Role"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleDescription" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="roleDescription"
                  value={editingRole ? editingRole.description : newRole.description}
                  onChange={(e) =>
                    editingRole
                      ? setEditingRole({ ...editingRole, description: e.target.value })
                      : setNewRole({ ...newRole, description: e.target.value })
                  }
                  placeholder="Describe the role and its responsibilities"
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              {editingRole?.isSystem && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-sm">
                    This is a system role. Modifying permissions may affect core functionality.
                  </AlertDescription>
                </Alert>
              )}

              {/* Permissions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Permissions</Label>
                  <Badge variant="secondary" className="text-xs">
                    {editingRole ? editingRole.permissions.length : newRole.permissions.length} selected
                  </Badge>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <ScrollArea className="h-[40vh]">
                    <div className="p-4 space-y-6">
                      {Object.entries(groupedPermissions).map(([category, permissions]) => (
                        <div key={category} className="space-y-3">
                          <div className="sticky top-0 bg-white pb-2 border-b">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                              {category}
                            </h4>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50"
                              >
                                <Checkbox
                                  id={permission.id}
                                  checked={
                                    editingRole
                                      ? editingRole.permissions.includes(permission.id)
                                      : newRole.permissions.includes(permission.id)
                                  }
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                  className="mt-0.5 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <label
                                    htmlFor={permission.id}
                                    className="text-sm font-medium leading-none cursor-pointer block"
                                  >
                                    {permission.name}
                                  </label>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="border-t p-6 flex flex-col sm:flex-row gap-2 sm:justify-end flex-shrink-0">
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={editingRole ? handleUpdateRole : handleCreateRole} className="w-full sm:w-auto">
              {editingRole ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attribute Creation/Edit Dialog */}
      <Dialog open={isAttributeDialogOpen} onOpenChange={setIsAttributeDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-lg">
              {editingAttribute ? "Edit Attribute" : "Create New Attribute"}
            </DialogTitle>
            <DialogDescription className="text-sm">Define a custom field for employee profiles</DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="attributeName" className="text-sm font-medium">
                  Attribute Name
                </Label>
                <Input
                  id="attributeName"
                  value={editingAttribute ? editingAttribute.name : newAttribute.name}
                  onChange={(e) =>
                    editingAttribute
                      ? setEditingAttribute({ ...editingAttribute, name: e.target.value })
                      : setNewAttribute({ ...newAttribute, name: e.target.value })
                  }
                  placeholder="Enter attribute name"
                  className="w-full"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="attributeType" className="text-sm font-medium">
                    Type
                  </Label>
                  <Select
                    value={editingAttribute ? editingAttribute.type : newAttribute.type}
                    onValueChange={(value) => {
                      const type = value as any
                      editingAttribute
                        ? setEditingAttribute({ ...editingAttribute, type })
                        : setNewAttribute({ ...newAttribute, type })
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attributeCategory" className="text-sm font-medium">
                    Category
                  </Label>
                  <Input
                    id="attributeCategory"
                    value={editingAttribute ? editingAttribute.category : newAttribute.category}
                    onChange={(e) =>
                      editingAttribute
                        ? setEditingAttribute({ ...editingAttribute, category: e.target.value })
                        : setNewAttribute({ ...newAttribute, category: e.target.value })
                    }
                    placeholder="e.g., Personal, Professional"
                    className="w-full"
                  />
                </div>
              </div>

              {((editingAttribute && editingAttribute.type === "select") ||
                (!editingAttribute && newAttribute.type === "select")) && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Options (comma-separated)</Label>
                  <Input
                    value={
                      editingAttribute ? editingAttribute.options?.join(", ") || "" : newAttribute.options.join(", ")
                    }
                    onChange={(e) => {
                      const options = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                      editingAttribute
                        ? setEditingAttribute({ ...editingAttribute, options })
                        : setNewAttribute({ ...newAttribute, options })
                    }}
                    placeholder="Option 1, Option 2, Option 3"
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={editingAttribute ? editingAttribute.required : newAttribute.required}
                  onCheckedChange={(checked) =>
                    editingAttribute
                      ? setEditingAttribute({ ...editingAttribute, required: !!checked })
                      : setNewAttribute({ ...newAttribute, required: !!checked })
                  }
                />
                <Label htmlFor="required" className="text-sm">
                  Required field
                </Label>
              </div>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="border-t p-6 flex flex-col sm:flex-row gap-2 sm:justify-end flex-shrink-0">
            <Button variant="outline" onClick={() => setIsAttributeDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleCreateAttribute} className="w-full sm:w-auto">
              {editingAttribute ? "Update Attribute" : "Create Attribute"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Permission Management Dialog */}
      <Dialog open={isBulkPermissionDialogOpen} onOpenChange={setIsBulkPermissionDialogOpen}>
        <DialogContent className="w-[95vw] max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl">Bulk Permission Management</DialogTitle>
            <DialogDescription className="text-sm">
              Apply permission changes to {selectedRoles.length} selected roles
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6 pr-4">
              {/* Action Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Action Type</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="add"
                      name="bulkAction"
                      value="add"
                      checked={bulkAction === "add"}
                      onChange={(e) => setBulkAction(e.target.value as "add")}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="add" className="text-sm cursor-pointer">
                      <div>
                        <div className="font-medium">Add Permissions</div>
                        <div className="text-xs text-muted-foreground">Add selected permissions to roles</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="remove"
                      name="bulkAction"
                      value="remove"
                      checked={bulkAction === "remove"}
                      onChange={(e) => setBulkAction(e.target.value as "remove")}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="remove" className="text-sm cursor-pointer">
                      <div>
                        <div className="font-medium">Remove Permissions</div>
                        <div className="text-xs text-muted-foreground">Remove selected permissions from roles</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="replace"
                      name="bulkAction"
                      value="replace"
                      checked={bulkAction === "replace"}
                      onChange={(e) => setBulkAction(e.target.value as "replace")}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="replace" className="text-sm cursor-pointer">
                      <div>
                        <div className="font-medium">Replace Permissions</div>
                        <div className="text-xs text-muted-foreground">Replace all permissions with selected ones</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Selected Roles Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selected Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedRoles.map((roleId) => {
                    const role = roles.find((r) => r.id === roleId)
                    return role ? (
                      <Badge key={roleId} variant="outline" className="text-xs">
                        {role.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>

              {/* Permission Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Select Permissions</Label>
                  <Badge variant="secondary" className="text-xs">
                    {bulkPermissions.length} selected
                  </Badge>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <ScrollArea className="h-[40vh]">
                    <div className="p-4 space-y-6">
                      {Object.entries(groupedPermissions).map(([category, permissions]) => (
                        <div key={category} className="space-y-3">
                          <div className="sticky top-0 bg-white pb-2 border-b">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                {category}
                              </h4>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const categoryPermissions = permissions.map((p) => p.id)
                                  const allSelected = categoryPermissions.every((p) => bulkPermissions.includes(p))
                                  if (allSelected) {
                                    setBulkPermissions(bulkPermissions.filter((p) => !categoryPermissions.includes(p)))
                                  } else {
                                    setBulkPermissions([...new Set([...bulkPermissions, ...categoryPermissions])])
                                  }
                                }}
                                className="text-xs"
                              >
                                {permissions.every((p) => bulkPermissions.includes(p.id))
                                  ? "Deselect All"
                                  : "Select All"}
                              </Button>
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50"
                              >
                                <Checkbox
                                  id={`bulk-${permission.id}`}
                                  checked={bulkPermissions.includes(permission.id)}
                                  onCheckedChange={() => handleBulkPermissionToggle(permission.id)}
                                  className="mt-0.5 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <label
                                    htmlFor={`bulk-${permission.id}`}
                                    className="text-sm font-medium leading-none cursor-pointer block"
                                  >
                                    {permission.name}
                                  </label>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="border-t p-6 flex flex-col sm:flex-row gap-2 sm:justify-end flex-shrink-0">
            <Button variant="outline" onClick={() => setIsBulkPermissionDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={handleBulkPermissionUpdate}
              className="w-full sm:w-auto"
              disabled={bulkPermissions.length === 0}
            >
              Apply Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
