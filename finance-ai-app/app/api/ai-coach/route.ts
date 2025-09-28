import { type NextRequest, NextResponse } from "next/server"

interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
    const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim()

    if (!accountId || !apiToken) {
      return NextResponse.json({ error: "Missing Cloudflare credentials" }, { status: 500 })
    }

    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const financialContext = `
User's Financial Profile:
- Monthly Income: $6,500
- Monthly Expenses: $2,216
- Current Savings: $12,847
- Emergency Fund Goal: $15,000 (68% complete)
- Recent spending categories: Food & Dining ($680), Transportation ($420), Shopping ($350), Bills ($520), Entertainment ($246)
- Budget status: Over budget on Transportation by $20, under budget on Food by $120
- Savings rate: 66% of income
- Top expense category: Food & Dining
- Recent trend: Expenses decreased by 3.1% from last month
`

    const messagesArray = Array.isArray(conversationHistory) ? conversationHistory : []
    const conversationContext = messagesArray
      .slice(-5)
      .map((msg: Message) => `${msg.role}: ${msg.content}`)
      .join("\n")

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-70b-instruct`

    const cfRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a concise AI financial coach for a user. This is their data:

${financialContext}

Previous conversation:
${conversationContext}

Keep responses SHORT (2-3 sentences max). Be helpful but concise. Only talk about relevant things for what the user is asking. BE AN EXPERT OF ALL FINANCIAL ADVICE INCLUDING HOW TO BUILD WEALTH AND MUCH MORE AND BE MORE DETAILED IN RESPONSES. DO NOT ANSWERS ANYTHING NOT FINANCIALLY RELEVANT`
          },
          { role: "user", content: message }
        ],
        max_tokens: 100,  // Limits response to ~75 words
        temperature: 0.7  // Optional: controls creativity (0-1)
      }),
    })

    const data = await cfRes.json()
    if (!cfRes.ok) {
      return NextResponse.json({ 
        error: `Cloudflare API ${cfRes.status}`, 
        details: data 
      }, { status: 500 })
    }

    return NextResponse.json({ response: data.result.response })
  } catch (error) {
    console.error("Error in AI coach:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}