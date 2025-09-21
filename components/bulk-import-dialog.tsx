// components/bulk-import-dialog.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BulkImportResult } from "@/lib/types"

interface BulkImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (result: BulkImportResult) => void   // 🔄 return full result now
  organizationId: string
}

export function BulkImportDialog({ open, onOpenChange, onImportComplete, organizationId, }: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    if (!file) return
    setIsImporting(true)

    try {
      // simulate parsing
      const text = await file.text()
      const rows = text.split("\n").filter(Boolean)

      const importResult: BulkImportResult = {

          success: true,
          totalRows: rows.length,
          successfulRows: rows.length,
          failedRows: 0,
          errors: [],
          warnings: [],
          data: rows.map((r, i) => ({
              id: `emp-${Date.now()}-${i}`,
              userId: `user-${Date.now()}-${i}`,
              organizationId,
              orgEmail: r.split(",")[2] || `user${i}@example.com`,
              roleId: "",
              status: "active",
              joinedAt: new Date(),
              updatedAt: new Date(),
              user: {
              id: `user-${Date.now()}-${i}`,
              name: `${r.split(",")[0] || "Unknown"} ${r.split(",")[1] || "Unknown"}`,
              email: r.split(",")[2] || `user${i}@example.com`,
              createdAt: new Date(),
              updatedAt: new Date(),
              },
              employeeId: `EMP-${i + 1}`,
              jobTitle: "Unassigned",
              department: "Unassigned",
              employmentType: "full-time",
              workLocation: "on-site",
              startDate: new Date(),
              skills: [],
          })),
        }

      onImportComplete(importResult)
      onOpenChange(false)
    } catch (error) {
      console.error("Import failed:", error)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Import Employees</DialogTitle>
          <DialogDescription>Upload a CSV file containing employees.</DialogDescription>
        </DialogHeader>

        <Input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isImporting}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || isImporting}>
            {isImporting ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
