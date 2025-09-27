import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { transactions } = await request.json()

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "Invalid transactions data" }, { status: 400 })
    }

    const transactionSummary = transactions
      .map((t) => `${t.date}: ${t.description} - $${t.amount} (${t.category})`)
      .join("\n")

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze these financial transactions and provide insights:

${transactionSummary}

Please provide:
1. Spending patterns analysis
2. Budget recommendations
3. Potential savings opportunities
4. Financial health assessment

Keep the response concise and actionable.`,
    })

    return NextResponse.json({ insights: text })
  } catch (error) {
    console.error("Error analyzing transactions:", error)
    return NextResponse.json({ error: "Failed to analyze transactions" }, { status: 500 })
  }
}
