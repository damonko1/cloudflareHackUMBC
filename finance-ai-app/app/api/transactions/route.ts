import { type NextRequest, NextResponse } from "next/server"

interface Transaction {
  id: string
  amount: number
  type: "income" | "expense"
  description: string
  category: string
  date: string
  notes?: string
  createdAt: string
}

// Mock database - in a real app, this would be a proper database
const transactions: Transaction[] = [
  {
    id: "1",
    amount: 2500.0,
    type: "income",
    description: "Salary - Tech Corp",
    category: "salary",
    date: "2024-01-15",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    amount: 85.32,
    type: "expense",
    description: "Grocery shopping at Whole Foods",
    category: "food",
    date: "2024-01-14",
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    // Sort transactions by date (newest first)
    const sortedTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({ transactions: sortedTransactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, type, description, category, date, notes } = body

    // Validate required fields
    if (!amount || !type || !description || !category || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: Number.parseFloat(amount),
      type,
      description,
      category,
      date,
      notes: notes || "",
      createdAt: new Date().toISOString(),
    }

    transactions.push(newTransaction)

    return NextResponse.json({ transaction: newTransaction }, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }

    const transactionIndex = transactions.findIndex((t) => t.id === id)

    if (transactionIndex === -1) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    transactions.splice(transactionIndex, 1)

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}
