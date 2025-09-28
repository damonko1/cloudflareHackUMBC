import { type NextRequest, NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  category: string;
  date: string;
  notes?: string;
  user_id: string;
}

interface TransactionRequestBody {
  amount: number;
  type: "income" | "expense";
  description: string;
  category: string;
  date: string;
  notes?: string;
}

interface Env {
  DB: D1Database;
}

// File-based persistence for development
const DATA_FILE = path.join(process.cwd(), 'transactions.json');

const loadTransactions = (): Transaction[] => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
  }
  return [];
};

const saveTransactions = (transactions: Transaction[]) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

// In-memory storage for local development - NOW PERSISTENT
let mockTransactions: Transaction[] = loadTransactions();

const mockDb = {
  prepare: (sql: string) => ({
    bind: (...params: any[]) => ({
      all: () => {
        mockTransactions = loadTransactions(); // Always load fresh data
        if (sql.includes('SELECT') && sql.includes('transactions')) {
          return Promise.resolve({ 
            results: mockTransactions.map(t => ({
              id: t.id,
              user_id: t.user_id,
              amount: t.amount,
              type: t.type,
              description: t.description,
              category: t.category,
              date: t.date,
              notes: t.notes || null,
              created_at: new Date().toISOString()
            }))
          });
        }
        return Promise.resolve({ results: [] });
      },
      run: () => {
        mockTransactions = loadTransactions(); // Load fresh data before modifying
        
        if (sql.includes('INSERT')) {
          const [userId, amount, type, description, category, date, notes] = params;
          const newTransaction: Transaction = {
            id: Date.now().toString(),
            user_id: userId,
            amount: parseFloat(amount),
            type: type,
            description: description,
            category: category,
            date: date,
            notes: notes
          };
          mockTransactions.push(newTransaction);
          saveTransactions(mockTransactions); // Save to file
          console.log("Added transaction:", newTransaction);
          return Promise.resolve({ 
            success: true, 
            meta: { 
              changes: 1,
              last_row_id: newTransaction.id
            }
          });
        }
        
        if (sql.includes('DELETE')) {
          const [transactionId, userId] = params;
          console.log("Attempting to delete transaction:", transactionId, "for user:", userId);
          const initialLength = mockTransactions.length;
          mockTransactions = mockTransactions.filter(t => !(t.id === transactionId && t.user_id === userId));
          const deleted = initialLength - mockTransactions.length;
          saveTransactions(mockTransactions); // Save to file
          console.log("Deleted", deleted, "transactions");
          return Promise.resolve({ 
            success: true, 
            meta: { changes: deleted }
          });
        }
        
        return Promise.resolve({ success: true, meta: { changes: 0 }});
      }
    })
  })
};

function getDb(context?: { env: Env }) {
  if (context?.env?.DB) {
    return context.env.DB;
  }
  
  console.log('Using persistent file-based mock database');
  return mockDb as any;
}

export async function GET(request: NextRequest, context?: { env: Env }) {
  try {
    const db = getDb(context);
    const USER_ID = "DUMMY_USER_ID";

    const { results } = await db.prepare(
      `SELECT id, user_id, amount, type, description, category, date, notes, created_at
       FROM transactions 
       WHERE user_id = ? 
       ORDER BY created_at DESC`
    ).bind(USER_ID).all();

    return NextResponse.json({ 
      transactions: results,
      count: results.length 
    });

  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context?: { env: Env }) {
  try {
    const db = getDb(context);
    const body = await request.json() as TransactionRequestBody;
    const USER_ID = "DUMMY_USER_ID";

    const { amount, type, description, category, date, notes } = body;

    if (!amount || !type || !description || !category || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json({ error: "Type must be 'income' or 'expense'" }, { status: 400 });
    }

    const result = await db.prepare(
      `INSERT INTO transactions (user_id, amount, type, description, category, date, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(USER_ID, amount, type, description, category, date, notes || null).run();

    if (!result.success) {
      throw new Error("Failed to insert transaction");
    }

    return NextResponse.json({ 
      message: "Transaction added successfully",
      id: result.meta?.last_row_id
    });

  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context?: { env: Env }) {
  try {
    const db = getDb(context);
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');
    const USER_ID = "DUMMY_USER_ID";

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const result = await db.prepare(
      `DELETE FROM transactions WHERE id = ? AND user_id = ?`
    ).bind(transactionId, USER_ID).run();

    if (result.meta?.changes === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });

  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}