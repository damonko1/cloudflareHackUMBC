import { type NextRequest, NextResponse } from "next/server"

interface Transaction {
  id: string | number;
  amount: number
  type: "income" | "expense"
  description: string
  category: string
  date: string
  notes?: string
  user_id?: string
}

interface Env {
  DB: D1Database;
}

// In-memory storage for local development
let mockTransactions: Transaction[] = [];

// Enhanced mock database that actually stores data
const mockDb = {
  prepare: (sql: string) => ({
    bind: (...params: any[]) => ({
      all: () => {
        if (sql.includes('SELECT')) {
          console.log('Mock DB: Returning transactions:', mockTransactions);
          return Promise.resolve({ 
            results: mockTransactions.map(t => ({
              id: t.id,
              amount: t.amount,
              type: t.type,
              description: t.description,
              category: t.category,
              date: t.date,
              notes: t.notes
            }))
          });
        }
        return Promise.resolve({ results: [] });
      },
      run: () => {
        if (sql.includes('INSERT')) {
          const [userId, amount, type, description, category, date, notes] = params;
          const newTransaction: Transaction = {
            id: Date.now(),
            amount: Number(amount),
            type,
            description,
            category,
            date,
            notes,
            user_id: userId
          };
          mockTransactions.push(newTransaction);
          console.log('Mock DB: Added transaction:', newTransaction);
          console.log('Mock DB: Total transactions:', mockTransactions.length);
          
          return Promise.resolve({ 
            meta: { 
              last_row_id: newTransaction.id,
              changes: 1 
            } 
          });
        }
        
        if (sql.includes('DELETE')) {
          const [id, userId] = params;
          const initialLength = mockTransactions.length;
          mockTransactions = mockTransactions.filter(t => 
            !(t.id.toString() === id.toString() && t.user_id === userId)
          );
          const changes = initialLength - mockTransactions.length;
          console.log('Mock DB: Deleted transaction, changes:', changes);
          
          return Promise.resolve({ 
            meta: { 
              changes 
            } 
          });
        }
        
        return Promise.resolve({ 
          meta: { 
            last_row_id: Date.now(),
            changes: 1 
          } 
        });
      }
    })
  })
};

function getDb(context?: { env: Env }) {
  if (context?.env?.DB) {
    return context.env.DB;
  }
  
  console.log('Using mock database for local development');
  return mockDb as any;
}

export async function GET(request: NextRequest, context?: { env: Env }) {
  try {
    const db = getDb(context);
    const USER_ID = "DUMMY_USER_ID";

    const { results } = await db.prepare(
      `SELECT id, amount, type, description, category, date, notes
       FROM transactions
       WHERE user_id = ?
       ORDER BY date DESC`
    ).bind(USER_ID).all();
    
    console.log('GET: Returning results:', results);
    return NextResponse.json({ transactions: results });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context?: { env: Env }) {
  try {
    const body = await request.json()
    console.log('POST: Received body:', body);
    
    const { amount, type, description, category, date, notes } = body as Transaction

    if (!amount || !type || !description || !category || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getDb(context);
    const USER_ID = "DUMMY_USER_ID";

    const result = await db.prepare(
      `INSERT INTO transactions (user_id, amount, type, description, category, date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(USER_ID, amount, type, description, category, date, notes || null).run();
      
    const newID = result.meta.last_row_id;
    console.log('POST: Created transaction with ID:', newID);

    return NextResponse.json({ 
      success: true,
      message: "Transaction created successfully",
      id: newID
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context?: { env: Env }) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }

    const db = getDb(context);
    const USER_ID = "DUMMY_USER_ID"; // Fixed: should be same as other methods
    
    const result = await db.prepare(
      `DELETE FROM transactions 
       WHERE id = ? AND user_id = ?`
    ).bind(id, USER_ID).run();

    if (result.meta.changes === 0) {
      return NextResponse.json({ error: "Transaction not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}