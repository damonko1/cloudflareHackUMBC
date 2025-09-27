"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TransactionFormData {
  amount: string
  type: "income" | "expense" | ""
  description: string
  category: string
  date: string
  notes: string
}

const categories = {
  income: [
    { value: "salary", label: "Salary" },
    { value: "freelance", label: "Freelance" },
    { value: "investment", label: "Investment Returns" },
    { value: "business", label: "Business Income" },
    { value: "other-income", label: "Other Income" },
  ],
  expense: [
    { value: "food", label: "Food & Dining" },
    { value: "transport", label: "Transportation" },
    { value: "shopping", label: "Shopping" },
    { value: "bills", label: "Bills & Utilities" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health & Fitness" },
    { value: "education", label: "Education" },
    { value: "travel", label: "Travel" },
    { value: "other-expense", label: "Other Expense" },
  ],
}

export function TransactionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: "",
    type: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })
  const { toast } = useToast()

  const handleInputChange = (field: keyof TransactionFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset category when type changes
      ...(field === "type" && { category: "" }),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would typically send the data to your API
      console.log("Transaction data:", formData)

      toast({
        title: "Transaction added successfully",
        description: `${formData.type === "income" ? "Income" : "Expense"} of $${formData.amount} has been recorded.`,
      })

      // Reset form
      setFormData({
        amount: "",
        type: "",
        description: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableCategories = formData.type ? categories[formData.type as keyof typeof categories] : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Add Transaction
        </CardTitle>
        <CardDescription>Record a new income or expense transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder="e.g., Grocery shopping at Whole Foods"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                required
                disabled={!formData.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.type ? "Select category" : "Select type first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this transaction..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding Transaction..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
