import { type NextRequest, NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest{
  message: string; 
  conversationHistory?: Message[]; 
}

interface CloudflareResponse {
  result: {
    response: string;
  };
  success: boolean;
  errors?: any[];
}

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

export async function POST(request: NextRequest) {
  try {
    console.log("=== AI Coach Starting ===");
    
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
    const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim()

    if (!accountId || !apiToken) {
      return NextResponse.json({ error: "Missing Cloudflare credentials" }, { status: 500 })
    }

    const { message, conversationHistory = [] } = await request.json() as ChatRequest

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Read transaction data directly from file (much faster)
    let financialContext = "No financial data available.";
    
    try {
      console.log("Reading transactions directly from file...");
      const DATA_FILE = path.join(process.cwd(), 'transactions.json');
      
      if (fs.existsSync(DATA_FILE)) {
        const fileData = fs.readFileSync(DATA_FILE, 'utf8');
        const transactions: Transaction[] = JSON.parse(fileData);
        
        console.log("Number of transactions found:", transactions.length);
        
        if (transactions.length > 0) {
          const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          const totalBalance = totalIncome - totalExpenses;

          // Get recent transactions for context
          const recentTransactions = transactions
            .slice(-5)
            .map(t => `${t.type} $${t.amount} for ${t.description}`)
            .join(', ');

          financialContext = `User has ${transactions.length} transactions. Balance: $${totalBalance.toFixed(2)}, Total Income: $${totalIncome.toFixed(2)}, Total Expenses: $${totalExpenses.toFixed(2)}. Recent transactions: ${recentTransactions}.`;
          
          console.log("Financial context created:", financialContext);
        } else {
          console.log("No transactions found in file");
          financialContext = "User has no transactions recorded yet. Encourage them to add some transactions first.";
        }
      } else {
        console.log("No transactions file found");
        financialContext = "User has no transactions recorded yet. Encourage them to add some transactions first.";
      }
    } catch (error) {
      console.error("Error reading transaction file:", error);
      financialContext = "Unable to access financial data at the moment.";
    }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-70b-instruct`

    const requestBody = {
      messages: [
        {
          role: "system",
          content: `You are a concise AI financial coach for a user. 
Keep responses SHORT (2-3 sentences max). Be helpful but concise. Only talk about relevant things for what the user is asking. BE AN EXPERT OF ALL FINANCIAL and MONEY ADVICE INCLUDING HOW TO BUILD WEALTH AND MUCH MORE AND BE MORE DETAILED IN RESPONSES. DO NOT ANSWERS ANYTHING NOT FINANCIALLY RELEVANT. This is their data: ${financialContext} `
        },
        { role: "user", content: message }
      ],
      max_tokens: 120,
      temperature: 0.2
    };

    console.log("Sending to AI with context:", financialContext);
    
    const cfRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(15000)
    })

    const data = await cfRes.json() as CloudflareResponse

    if (!cfRes.ok) {
      return NextResponse.json({ 
        error: `AI service temporarily unavailable`, 
        details: data 
      }, { status: 500 })
    }

    return NextResponse.json({ response: data.result.response })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: "Request timeout - please try again" }, { status: 408 })
    }
    return NextResponse.json({ 
      error: "AI service error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}