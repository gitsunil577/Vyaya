export async function getSpendingInsight({ total, categoryBreakdown, previousMonths }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return "";
  }

  const prompt = `You are a calm, practical personal finance assistant.
Given a user's monthly spending, write a 2-3 sentence plain-language
observation and one concrete, specific suggestion for better balance.
No preamble, no markdown, just the sentences.

This month's total: ₹${total}
By category: ${JSON.stringify(categoryBreakdown)}
Last 3 months of totals: ${JSON.stringify(previousMonths)}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const text = data.content?.find((c) => c.type === "text")?.text;
  return text || "";
}
