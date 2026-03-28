const { GoogleGenAI } = require('@google/genai');

async function generateAnalytics(orders) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn("Using placeholder analytics because GEMINI_API_KEY is not configured.");
    return [
      "Configure your GEMINI_API_KEY in backend/.env to see real insights.",
      "Example insight: Maggi orders peak at 6 PM.",
      "Example insight: Dairy stock seems to be sufficient based on low sales today."
    ];
  }

  if (!orders || orders.length === 0) {
    return [
      "Your store currently has no order history.",
      "Get a customer to place an order to unlock intelligent AI purchasing predictions!",
      "Tip: Try adding a dummy product and ordering it yourself to test this widget."
    ];
  }

  const prompt = `
  You are an expert AI business analyst for a hyperlocal Kirana (grocery) store.
  I am going to provide you with the store's recent orders in JSON format.
  Analyze the data and provide exactly 3 clear, actionable insights for the shopkeeper.
  Examples of insights:
  - "Maggi noodles are selling fast, consider restocking soon."
  - "Most of your orders come in the evening, maybe extend closing time by 1 hour."
  - "Oil and long-lasting items are popular, consider running a bulk-buy discount."

  Orders Data:
  ${JSON.stringify(orders)}
  
  Format your response as exactly 3 plain text bullet points.
  Start each bullet with a dash (-) and put each on a new line.
  Example:
  - Insight 1
  - Insight 2
  - Insight 3
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 800,
      }
    });

    const text = response.text || "";
    const insights = text.split('\n')
      .map(line => line.replace(/^[\s*-]+/, '').replace(/^["']|["']$/g, '').trim())
      .filter(line => line.length > 0);
      
    return insights.length ? insights.slice(0, 3) : ["No insights could be generated."];
  } catch (err) {
    console.error("Gemini SDK error:", err);
    return ["AI Error: " + (err.message || "Failed to generate insights via SDK.")];
  }
}

module.exports = { generateAnalytics };
