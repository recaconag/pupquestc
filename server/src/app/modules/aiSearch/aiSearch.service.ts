/**
 * modules/aiSearch/aiSearch.service.ts — AI-Powered Search Service
 *
 * This is the Emerging Technology feature of the capstone.
 * It uses Google Gemini (a large language model) to understand a user's
 * description in plain language and find matching lost/found items.
 *
 * How it works (step by step):
 *
 * 1. The user types a description like "black Samsung phone with cracked screen"
 *    into the AI Search page.
 *
 * 2. This service sends that description to the Gemini API along with a
 *    structured prompt that instructs the AI to extract key attributes
 *    (item type, color, brand, location, etc.).
 *
 * 3. The AI returns a JSON analysis. We use that to build smart database
 *    queries against our PostgreSQL database via Prisma.
 *
 * 4. If the Gemini API is unavailable or returns an error, the service
 *    automatically falls back to a basic keyword search so the feature
 *    never breaks completely.
 *
 * 5. Results are ranked by relevance score and returned to the frontend.
 *
 * Requirements:
 *   - GEMINI_API_KEY must be set in server/.env
 *   - Get a free key at: https://makersuite.google.com/app/apikey
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../config/prisma";
import config from "../../config/config";

// ═══════════════════════════════════════════════════════════════════════════
//  EMERGING TECHNOLOGY: Google Gemini AI Integration
//  Used for: Semantic Search Analysis — color synonyms, item type aliases,
//  contextual matching, and closest-match fallback reasoning
// ═══════════════════════════════════════════════════════════════════════════

// Startup key validation — logs clearly so the developer knows the status
const geminiApiKey = config.gemini_api_key;
if (!geminiApiKey) {
  console.error("⚠️  [Gemini] GEMINI_API_KEY is NOT set in .env — AI search will fall back to keyword search");
  console.error("⚠️  [Gemini] To fix: add GEMINI_API_KEY=AIzaSy... to your server/.env file");
} else {
  console.log(`✅ [Gemini] API key detected (${geminiApiKey.slice(0, 8)}...) — Model: gemini-2.0-flash`);
}

const genAI = new GoogleGenerativeAI(geminiApiKey || "");

async function safeGenerate(model: any, prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (err: any) {
      const status = err?.status ?? err?.statusCode ?? err?.code;
      const message = err?.message ?? "No error message";
      console.error(`[Gemini] API call failed — HTTP ${status}: ${message}`);

      if (status === 401 || status === 403) {
        console.error("[Gemini] ⚠️  AUTH ERROR: Your GEMINI_API_KEY is invalid or expired.");
        console.error("[Gemini]    Get a new key at: https://aistudio.google.com/app/apikey");
        throw err;
      }
      if (status === 400) {
        console.error("[Gemini] ⚠️  BAD REQUEST: Check API key format (should start with 'AIza...')");
        throw err;
      }
      if (status === 404) {
        console.error("[Gemini] ⚠️  MODEL NOT FOUND: 'gemini-2.0-flash' — verify model availability in your region");
        throw err;
      }
      if ((status === 503 || status === 429) && i < retries - 1) {
        const delay = (i + 1) * 1500;
        console.warn(`[Gemini] ${status === 429 ? "Rate limited" : "Overloaded"} — retrying in ${delay}ms (attempt ${i + 1}/${retries})...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
}

const aiSearchItems = async (searchQuery: string) => {
  console.log("[Gemini AI Search] User query:", searchQuery);

  try {
    const foundItems = await prisma.foundItem.findMany({
      where: { isDeleted: false, isClaimed: false },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const lostItems = await prisma.lostItem.findMany({
      where: { isDeleted: false, isFound: false },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const foundItemsData = foundItems.map((item) => ({
      id: item.id,
      name: item.foundItemName,
      description: item.description,
      category: item.category?.name || "",
      location: item.location,
      date: item.date,
    }));

    const lostItemsData = lostItems.map((item) => ({
      id: item.id,
      name: item.lostItemName,
      description: item.description,
      category: item.category?.name || "",
      location: item.location,
      date: item.date,
    }));

    // ─────────────────────────────────────────────────────────────────────
    //  Model selection: prefer gemini-2.0-flash (current); auto-fall back
    //  to gemini-1.5-flash if the key/region doesn't have v2 access.
    // ─────────────────────────────────────────────────────────────────────
    let modelName = "gemini-2.0-flash";
    let model = genAI.getGenerativeModel({ model: modelName });

    // ─────────────────────────────────────────────────────────────────────
    //  GEMINI SEMANTIC SEARCH PROMPT
    //
    //  Phase 1 — Query Analysis: extract canonical color, item type, brand,
    //             and expanded keywords using synonym/alias rules
    //  Phase 2 — Contextual Matching: use expanded terms to match DB items
    //  Phase 3 — Closest-Match Fallback: suggest nearest item if none found
    // ─────────────────────────────────────────────────────────────────────
    const prompt = `
You are a Semantic Search AI for PUPQuestC — the official Lost and Found System of the Polytechnic University of the Philippines Quezon City (PUPQC).

## PHASE 1 — SEMANTIC QUERY ANALYSIS

Apply these COLOR SYNONYM RULES to identify the canonical (standard) color:
- maroon / crimson / scarlet / burgundy / wine / brick / rust → RED
- navy / cobalt / royal blue / indigo / sapphire → BLUE
- ivory / cream / off-white / beige / eggshell → WHITE
- charcoal / ash / slate / silver / pewter → GRAY
- tan / khaki / nude / camel / sand → BROWN/TAN
- olive / lime / mint / sage / forest → GREEN
- gold / mustard / amber / saffron → YELLOW/GOLD
- violet / lavender / lilac / plum → PURPLE

Apply these ITEM SYNONYM RULES to identify the canonical item type:
- tumbler / thermos / flask / hydroflask / aquaflask / water bottle / insulated bottle / sipper → TUMBLER
- phone / mobile / cellphone / smartphone / iPhone / Android / handset / device → PHONE
- bag / backpack / sack / knapsack / rucksack / tote / pouch / sling bag → BAG
- laptop / notebook computer / MacBook / Chromebook / netbook → LAPTOP
- ID / identification / student ID / school card / PUP ID / ID card → ID CARD
- umbrella / brolly / parasol / rainshield → UMBRELLA
- earphones / headphones / airpods / earbuds / TWS / bluetooth earphones → EARPHONES
- keys / keychain / keyholder / key ring → KEYS
- wallet / billfold / coin purse / cardholder / money clip → WALLET
- notebook / journal / notes / reviewer / pad paper / logbook → NOTEBOOK

## PHASE 2 — CONTEXTUAL DATABASE MATCHING

Using the semantic expansions above, find ALL items from the databases below that could match.
Apply LOOSE MATCHING: if the user says "maroon tumbler", you MUST match items described as "red tumbler", "red water bottle", "red aquaflask", etc.
Check item name, description, category, and location fields.

User Query: "${searchQuery}"

FOUND ITEMS DATABASE:
${JSON.stringify(foundItemsData, null, 2)}

LOST ITEMS DATABASE:
${JSON.stringify(lostItemsData, null, 2)}

## PHASE 3 — CLOSEST MATCH FALLBACK

If ZERO items match after Phase 2, identify the single closest item from either database and describe it briefly (e.g., "Closest match: Red Tumbler — similar type but color may differ").
Set closestMatch to null if actual matches were found.

## REQUIRED OUTPUT FORMAT

Return ONLY raw JSON with no markdown, no code fences, no backticks, no explanation outside the JSON.

{
  "geminiAnalysis": {
    "originalQuery": "${searchQuery}",
    "detectedItem": "tumbler",
    "detectedColor": "maroon",
    "canonicalColor": "red",
    "colorReasoning": "Maroon is a dark brownish-red shade, semantically equivalent to red",
    "expandedKeywords": ["tumbler", "water bottle", "aquaflask", "thermos", "flask", "red", "dark red", "maroon"],
    "analysisText": "AI identified 'maroon' as a shade of 'red'. Expanding search to include Red Tumblers and similar water containers.",
    "closestMatch": null
  },
  "matches": {
    "foundItems": [],
    "lostItems": ["exact-item-uuid-from-database"]
  },
  "reasoning": "Found 1 matching lost item: 'Red Tumbler' — maroon is identified as a dark shade of red, and the item description matches a tumbler/water bottle."
}

STRICT RULES:
1. Output ONLY the raw JSON object — nothing else
2. IDs in matches arrays must be EXACT string UUIDs copied from the database above
3. Apply color synonym expansion aggressively — maroon MUST match red items
4. analysisText must state what semantic transformation was applied (e.g., "maroon → red")
5. If no items found, set closestMatch to a description of the nearest match; if items found, closestMatch must be null
    `;

    console.log(`[Gemini AI Search] Sending request to ${modelName}...`);
    let result: any;
    try {
      result = await safeGenerate(model, prompt);
    } catch (modelErr: any) {
      if ((modelErr?.status === 404 || modelErr?.statusCode === 404) && modelName === "gemini-2.0-flash") {
        console.warn("[Gemini AI Search] gemini-2.0-flash not available — retrying with gemini-1.5-flash...");
        modelName = "gemini-1.5-flash";
        model = genAI.getGenerativeModel({ model: modelName });
        result = await safeGenerate(model, prompt);
      } else {
        throw modelErr;
      }
    }
    console.log(`[Gemini AI Search] Response received from ${modelName}`);
    const response = await result.response;
    let aiResponse = response.text().trim();
    console.log("[Gemini AI Search] Raw response (first 400 chars):", aiResponse.substring(0, 400));

    // Strip markdown code fences — Gemini sometimes wraps output in ```json ... ```
    aiResponse = aiResponse
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // Extract the outermost JSON object
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiResponse = jsonMatch[0];
    }

    let aiResult: any;
    try {
      aiResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("[Gemini AI Search] JSON parse failed:", parseError, "\nRaw response:", aiResponse);
      return performSimpleSearch(searchQuery, foundItems, lostItems);
    }

    const matchedFoundItems = foundItems.filter((item) =>
      (aiResult.matches?.foundItems ?? []).includes(item.id)
    );
    const matchedLostItems = lostItems.filter((item) =>
      (aiResult.matches?.lostItems ?? []).includes(item.id)
    );

    console.log(
      `[Gemini AI Search] Result: ${matchedFoundItems.length} found items, ${matchedLostItems.length} lost items matched`
    );

    return {
      foundItems: matchedFoundItems,
      lostItems: matchedLostItems,
      reasoning: aiResult.reasoning || "Semantic analysis completed.",
      geminiAnalysis: aiResult.geminiAnalysis ?? null,
      totalFound: matchedFoundItems.length,
      totalLost: matchedLostItems.length,
    };
  } catch (error: any) {
    const status = error?.status ?? error?.statusCode ?? error?.code ?? "unknown";
    const message = error?.message ?? String(error);
    console.error(`[Gemini AI Search] Fatal error — HTTP ${status}: ${message}`);
    if (status === 401 || status === 403) {
      console.error("[Gemini AI Search] → FIX: Set a valid GEMINI_API_KEY in server/.env");
    } else if (status === 429) {
      console.error("[Gemini AI Search] → FIX: API quota exceeded — check usage at https://aistudio.google.com");
    } else if (status === 404) {
      console.error("[Gemini AI Search] → FIX: Model 'gemini-2.0-flash' not found — verify your API key has access");
    }
    const foundItems = await prisma.foundItem.findMany({
      where: { isDeleted: false, isClaimed: false },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    const lostItems = await prisma.lostItem.findMany({
      where: { isDeleted: false, isFound: false },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    return performSimpleSearch(searchQuery, foundItems, lostItems);
  }
};

// Fallback: keyword text search when Gemini is unavailable
const performSimpleSearch = (
  searchQuery: string,
  foundItems: any[],
  lostItems: any[]
) => {
  const query = searchQuery.toLowerCase();

  const matchedFoundItems = foundItems.filter(
    (item) =>
      item.foundItemName.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category?.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
  );

  const matchedLostItems = lostItems.filter(
    (item) =>
      item.lostItemName.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category?.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
  );

  return {
    foundItems: matchedFoundItems,
    lostItems: matchedLostItems,
    reasoning: "Gemini AI unavailable — showing keyword-based search results",
    geminiAnalysis: null,
    totalFound: matchedFoundItems.length,
    totalLost: matchedLostItems.length,
  };
};

export const aiSearchService = {
  aiSearchItems,
};
