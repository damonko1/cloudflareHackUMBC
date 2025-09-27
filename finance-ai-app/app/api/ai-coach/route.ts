import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Create context from user's financial data (in a real app, this would come from the database)
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

Recent Transactions:
- Salary - Tech Corp: +$2,500
- Grocery shopping at Whole Foods: -$85.32
- Gas station fill-up: -$45.00
- Monthly gym membership: -$120.00
- Coffee shop - morning latte: -$28.75
`

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-5) // Keep last 5 messages for context
      .map((msg: Message) => `${msg.role}: ${msg.content}`)
      .join("\n")

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert AI financial coach helping users manage their personal finances. You provide personalized, actionable advice based on their financial data.

${financialContext}

Previous conversation:
${conversationContext}

User's new question: ${message}

Provide a helpful, personalized response that:
1. References their specific financial situation when relevant
2. Gives actionable advice
3. Is encouraging and supportive
4. Keeps responses concise but informative (2-3 paragraphs max)
5. Uses specific numbers from their data when helpful
6. Suggests concrete next steps when appropriate

Respond as their personal financial coach in a friendly, professional tone.`,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in AI coach:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
