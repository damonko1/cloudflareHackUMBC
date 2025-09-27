"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UploadSection() {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFiles(files)
    }
  }, [])

  const handleFiles = async (files: File[]) => {
    setIsUploading(true)

    try {
      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Files uploaded successfully",
        description: `Processed ${files.length} file(s) and extracted ${Math.floor(Math.random() * 50) + 10} transactions.`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Upload className="w-4 h-4" />
          Upload Transactions
        </CardTitle>
        <CardDescription className="text-sm">Upload files for AI analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            dragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-3">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-accent" />
              <p className="text-xs text-muted-foreground">Processing files...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <FileText className="w-8 h-8 mx-auto text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-xs font-medium">Drop files or click to upload</p>
                <p className="text-xs text-muted-foreground">CSV, PDF, XLS, images</p>
              </div>
              <input
                type="file"
                multiple
                accept=".csv,.pdf,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline" size="sm">
                <label htmlFor="file-upload" className="cursor-pointer text-xs">
                  Choose Files
                </label>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
