const OpenAI = require("openai");

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey && apiKey !== "your_key_here" ? new OpenAI({ apiKey }) : null;

function buildLocalSummary(expense) {
  const amount = expense.amount != null ? `₹${expense.amount}` : "an unknown amount";
  const category = expense.category ? `${expense.category}` : "uncategorized";
  const description = expense.description ? `${expense.description}` : "No description provided";
  const receipt = expense.receipt_amount != null ? `OCR total ₹${expense.receipt_amount}` : "no receipt OCR";
  const status = expense.status ? expense.status.replace(/_/g, " ") : "pending";
  const verification = expense.verification_status ? `(${expense.verification_status.replace(/_/g, " ")})` : "";

  return `Expense for ${amount} in ${category}. ${description}. ${receipt}. Current status is ${status} ${verification}`.trim();
}

function extractText(output) {
  if (!output) return null;
  if (Array.isArray(output)) {
    return output
      .map((item) => extractText(item?.content))
      .filter(Boolean)
      .join(" ");
  }
  if (typeof output === "string") return output;
  if (output?.text) return output.text;
  if (output?.content) return extractText(output.content);
  return null;
}

async function summarizeExpense(expense) {
  const fallback = buildLocalSummary(expense);
  if (!openai) {
    return fallback;
  }

  try {
    const prompt = `You are an expense assistant. Summarize this expense record in one sentence:\n\nExpense: ${JSON.stringify(expense)}\n\nSummary:`;
    const response = await openai.responses.create({
      model: "gpt-3.5-turbo",
      input: prompt,
      max_output_tokens: 80
    });

    const text = extractText(response.output)?.trim();
    return text || fallback;
  } catch (err) {
    console.log("AI summary failed:", err.message || err);
    return fallback;
  }
}

function generateAssistantInsights(expenses = [], query = "") {
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const large = expenses.filter((exp) => Number(exp.amount) > 1000).length;
  const missingOCR = expenses.filter((exp) => exp.receipt_amount == null).length;

  const categoryCounts = expenses.reduce((counts, exp) => {
    const category = exp.category ? exp.category.toLowerCase() : "uncategorized";
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, count]) => `${cat} (${count})`)
    .join(", ");

  const summary = expenses.length
    ? `AI Assistant review: ${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"} totaling ₹${total}. ${large} ${large === 1 ? "item is" : "items are"} above ₹1000 and ${missingOCR} ${missingOCR === 1 ? "item is" : "items are"} missing OCR totals. Top categories: ${topCategories || "none"}.`
    : query
    ? `No search results found for “${query}”. Try a different keyword or amount.`
    : "No pending expenses available right now.";

  const suggestion = expenses.length
    ? "Focus first on large claims and items without OCR receipts. Use the search box to find employees, categories, or receipts quickly."
    : "No items to review right now.";

  return { summary, suggestion };
}

module.exports = {
  summarizeExpense,
  generateAssistantInsights
};
