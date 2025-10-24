import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// --- Configuration and Initialization ---

// Initialize the Gemini AI client using the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Destructure the models object for direct access to methods.
const { generateContent } = ai.models;

// The model chosen for reliable, fast code generation.
const GEMINI_MODEL = "gemini-2.5-flash";

/**
 * @fileoverview Next.js API route to generate MongoDB Query Language (MQL)
 * queries using the Gemini API, based on a natural language prompt and a database schema.
 */
export async function POST(request) {
  try {
    // 1. Input Parsing and Validation
    const body = await request.json();
    const { prompt, dbType, dbSchema } = body;

    if (!prompt || !dbType || !dbSchema) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (prompt, dbType, or dbSchema) in the request body.",
        },
        { status: 400 }
      );
    }

    // 2. Prompt Construction
    // Construct a clear, detailed system prompt that instructs Gemini to act as a code generator.
    // The prompt is minimized and the schema is compact (no pretty-printing) to save tokens.
    const fullPrompt = `Generate a working ${dbType} Query (MQL) query. SCHEMA: ${JSON.stringify(
      dbSchema
    )} PROMPT: "${prompt}". Output ONLY raw MQL code, no explanation or markdown.`;

    // 3. Call the Gemini API for Query Generation
    const response = await generateContent({
      model: GEMINI_MODEL,
      contents: fullPrompt,
      config: {
        // Use a low temperature for deterministic, reliable code generation.
        temperature: 0.1,
      },
    });

    // 4. Post-processing and Cleanup
    let generatedQuery = response.text.trim();

    // Aggressively clean up output: remove markdown code block wrappers
    if (generatedQuery.startsWith("```")) {
      // Find the end of the language identifier line (e.g., '```javascript')
      const firstNewlineIndex = generatedQuery.indexOf("\n");
      // Find the last triple backtick sequence
      const lastTripleBacktickIndex = generatedQuery.lastIndexOf("```");

      if (
        firstNewlineIndex !== -1 &&
        lastTripleBacktickIndex !== -1 &&
        lastTripleBacktickIndex > firstNewlineIndex
      ) {
        // Extract the content between the first newline and the final ```
        generatedQuery = generatedQuery
          .substring(firstNewlineIndex + 1, lastTripleBacktickIndex)
          .trim();
      } else {
        // Simple cleanup if structure is unexpected (e.g., '```query')
        generatedQuery = generatedQuery
          .replace(/```[a-z]*\s*|\s*```/g, "")
          .trim();
      }
    }

    // 5. Success Response
    return NextResponse.json({ query: generatedQuery }, { status: 200 });
  } catch (error) {
    // 6. Error Handling
    console.error("Gemini Query Generation Error:", error);

    return NextResponse.json(
      {
        error:
          "Failed to generate query. Check API key, environment variables, and server logs.",
      },
      { status: 500 }
    );
  }
}
