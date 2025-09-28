import { type NextRequest, NextResponse } from "next/server"

interface Transaction {
  id: string | number;
  amount: number
  type: "income" | "expense"
  description: string
  category: string
  date: string
  notes?: string
}



export async function GET(request: NextRequest, context: { env: Env }) {
  try{
    const db = context.env.DB;
    const USER_ID = "DUMMY_USER_ID"; // Replace with actual user ID logic

    // execute sql select statement
    const { results } = await db.prepare(
      `SELECT id, amount, type, description, category, date, notes
       FROM transactions
       WHERE user_id = ?
       ORDER BY date DESC`
    ).bind(USER_ID).all();
    
    // returning
    return NextResponse.json({ transactions: results });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
}}


export async function POST(request: NextRequest, context: { env: Env }) {
  try {
    const body = await request.json()
    const { amount, type, description, category, date, notes } = body as Transaction

    // Validate required fields
    if (!amount || !type || !description || !category || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // sets up database again makes dummy user
    const db = context.env.DB;
    const USER_ID = "DUMMY_USER_ID" // Replace with actual user ID logic

    // execute sql insert statement
    const result = await db.prepare(
      `INSERT INTO transactions (user_id, amount, type, description, category, date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      USER_ID, amount, type, description, category, date, notes || null
      ).run();
      
      const newID = result.meta.last_row_id;

    return NextResponse.json({ 
      success: true,
      message: "Transaction created successfully",
      id: newID
    }, {status: 201})
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { env: Env }) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }

    const db = context.env.DB;
    const USER_ID = "DUMMY_USER_123"; 

    
    const result = await db.prepare(
      `DELETE FROM Transactions 
       WHERE id = ? AND user_id = ?`
    ).bind(id, USER_ID).run();

    //Check if a row was actually deleted
    if (result.meta.changes === 0) {
        return NextResponse.json({ error: "Transaction not found or unauthorized" }, { status: 404 });
    }

    //return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}
