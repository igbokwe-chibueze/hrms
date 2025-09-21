// components/bulk-import-dialog.tsx
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, FileText, CheckCircle, XCircle, AlertTriangle, Users } from "lucide-react"
import { processImport, generateSampleCSV, type BulkImportResult } from "@/lib/bulk-import"
import type { Employee } from "@/lib/types"

interface BulkImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (employees: Employee[]) => void
}

export function BulkImportDialog({ open, onOpenChange, onImportComplete }: BulkImportDialogProps) {
  const [currentStep, setCurrentStep] = useState<"upload" | "preview" | "validation" | "import" | "complete">("upload")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvContent, setCsvContent] = useState<string>("")
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCsvContent(content)
        setCurrentStep("preview")
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCsvContent(content)
        setCurrentStep("preview")
      }
      reader.readAsText(file)
    }
  }

  const handleValidation = async () => {
    if (!csvContent) return
    
    setCurrentStep("validation")
    setIsProcessing(true)
    setProgress(0)

    // Simulate validation progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Simulate a mock organizationId for the validation function
      const result = await processImport(csvContent, "org-12345")
      setImportResult(result)
      setProgress(100)
      
      setTimeout(() => {
        setIsProcessing(false)
        if (result.success || result.errors.every(e => e.severity !== "error")) {
          setCurrentStep("import")
        }
      }, 500)
    } catch (error) {
      setIsProcessing(false)
      setImportResult({
        success: false,
        totalRows: 0,
        successfulRows: 0,
        failedRows: 0,
        errors: [{ row: 1, message: "Validation failed" }],
        data: []
      })
    }
  }

  const handleImport = async () => {
    if (!importResult?.data) return

    setIsProcessing(true)
    setProgress(0)
    setCurrentStep("import")

    const totalToImport = importResult.data.length
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.ceil(100 / totalToImport)
      })
    }, 100)

    try {
      // Assuming you have a processBulkImport function in your bulk-import.ts
      // We'll mock it for now since the original code didn't have it
      const importResponse = await new Promise((resolve) => setTimeout(() => {
        resolve({ success: true, message: "Import completed", importedCount: totalToImport })
      }, 2000))
      
      clearInterval(interval)
      setProgress(100)
      setIsProcessing(false)
      onImportComplete(importResult.data)
      setCurrentStep("complete")
    } catch (error) {
      clearInterval(interval)
      setIsProcessing(false)
      // Handle import error state
      console.error("Import failed:", error)
      // Maybe set a custom error state here
    }
  }

  const handleDownloadSample = () => {
    const csvContent = generateSampleCSV()
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "employee_import_sample.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetDialog = () => {
    setCurrentStep("upload")
    setCsvFile(null)
    setCsvContent("")
    setImportResult(null)
    setIsProcessing(false)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getStepNumber = (step: string) => {
    const steps = ["upload", "preview", "validation", "import", "complete"]
    return steps.indexOf(step) + 1
  }

  const parseCSVPreview = (content: string) => {
    const lines = content.trim().split("\n")
    if (lines.length < 2) return { headers: [], rows: [] }

    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""))
    const rows = lines.slice(1, 6).map(line => 
      line.split(",").map(cell => cell.trim().replace(/"/g, ""))
    )

    return { headers, rows }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetDialog()
      onOpenChange(newOpen)
    }}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Import Employees
          </DialogTitle>
          <DialogDescription>
            Import multiple employees from a CSV file - Step {getStepNumber(currentStep)} of 5
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-5 mx-6 mt-4 flex-shrink-0">
            <TabsTrigger value="upload" disabled={currentStep !== "upload"} className="text-xs">
              Upload
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!csvContent} className="text-xs">
              Preview
            </TabsTrigger>
            <TabsTrigger value="validation" disabled={!csvContent} className="text-xs">
              Validation
            </TabsTrigger>
            <TabsTrigger value="import" disabled={!importResult?.success} className="text-xs">
              Import
            </TabsTrigger>
            <TabsTrigger value="complete" disabled={currentStep !== "complete"} className="text-xs">
              Complete
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="upload" className="h-full m-0 p-6 overflow-y-auto">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload CSV File</CardTitle>
                    <CardDescription>
                      Select a CSV file containing employee data to import
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          {csvFile ? csvFile.name : "Drop your CSV file here"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {csvFile ? "File selected successfully" : "or click to browse files"}
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Need a Template?</CardTitle>
                    <CardDescription>
                      Download our sample CSV file to see the expected format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleDownloadSample} variant="outline" className="w-full bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Download Sample CSV
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Required Fields</CardTitle>
                    <CardDescription>
                      Make sure your CSV includes these required columns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                        <span>name</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                        <span>org_email</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                        <span>employee_id</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                        <span>job_title</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                        <span>department</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                        <span>start_date</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="h-full m-0 p-6 overflow-y-auto">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Preview</CardTitle>
                    <CardDescription>
                      Review the first few rows of your CSV file
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {csvContent && (() => {
                      const { headers, rows } = parseCSVPreview(csvContent)
                      return (
                        <div className="border rounded-lg overflow-hidden">
                          <ScrollArea className="h-64">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {headers.map((header, index) => (
                                    <TableHead key={index} className="min-w-[120px] font-medium">
                                      {header}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {rows.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                      <TableCell key={cellIndex} className="max-w-[200px] truncate">
                                        {cell || "-"}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                    Back
                  </Button>
                  <Button onClick={handleValidation}>
                    Validate Data
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="validation" className="h-full m-0 p-6 overflow-y-auto">
              <div className="space-y-6">
                {isProcessing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Validating Data...</CardTitle>
                      <CardDescription>
                        Please wait while we validate your CSV data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground text-center">
                          {progress < 30 && "Parsing CSV structure..."}
                          {progress >= 30 && progress < 60 && "Validating required fields..."}
                          {progress >= 60 && progress < 90 && "Checking data formats..."}
                          {progress >= 90 && "Finalizing validation..."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : importResult ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {importResult.success ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          Validation {importResult.success ? "Completed" : "Failed"}
                        </CardTitle>
                        <CardDescription>
                          {importResult.success 
                            ? "Your data is ready for import"
                            : "Please fix the errors below before proceeding"
                          }
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold">{importResult.totalRows}</div>
                            <div className="text-sm text-muted-foreground">Total Rows</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">{importResult.successfulRows}</div>
                            <div className="text-sm text-muted-foreground">Valid Rows</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-red-600">{importResult.failedRows}</div>
                            <div className="text-sm text-muted-foreground">Invalid Rows</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {importResult.errors.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Validation Issues</CardTitle>
                          <CardDescription>
                            {importResult.errors.filter(e => e.severity === "error").length} errors, {" "}
                            {importResult.errors.filter(e => e.severity === "warning").length} warnings
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-64">
                            <div className="space-y-2">
                              {importResult.errors.map((error, index) => (
                                <Alert key={index} variant={error.severity === "error" ? "destructive" : "default"}>
                                  {error.severity === "error" ? (
                                    <XCircle className="h-4 w-4" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4" />
                                  )}
                                  <AlertDescription>
                                    <span className="font-medium">Row {error.row}</span>
                                    {error.field && <span className="text-muted-foreground"> ({error.field})</span>}
                                    : {error.message}
                                  </AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep("preview")}>
                        Back to Preview
                      </Button>
                      {importResult.success && (
                        <Button onClick={() => setCurrentStep("import")}>
                          Proceed to Import
                        </Button>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </TabsContent>

            {/* Import Step */}
            <TabsContent value="import" className="h-full m-0 p-6 overflow-y-auto flex items-center justify-center">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5" />
                    Ready to Import
                  </CardTitle>
                  <CardDescription>
                    {importResult?.successfulRows || 0} employees will be added to your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {isProcessing ? (
                    <>
                      <Progress value={progress} className="w-full" />
                      <p className="text-sm text-muted-foreground">Importing data...</p>
                    </>
                  ) : (
                    <Button onClick={handleImport} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Confirm & Import
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Complete Step */}
            <TabsContent value="complete" className="h-full m-0 p-6 overflow-y-auto flex items-center justify-center">
              <div className="text-center space-y-6">
                <CheckCircle className="mx-auto h-16 w-16 text-green-600 animate-in fade-in zoom-in" />
                <h2 className="text-2xl font-bold">Import Complete!</h2>
                <p className="text-muted-foreground">
                  Successfully added {importResult?.successfulRows || 0} employees to your organization.
                </p>
                <Button onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}