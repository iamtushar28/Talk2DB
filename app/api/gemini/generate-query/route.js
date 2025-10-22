import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The model we will use for code generation
const GEMINI_MODEL = "gemini-2.5-flash";

// Export a named function for the POST method
export async function POST(request) {
  // Use named export POST and access request directly
  try {
    // Read the request body as JSON
    const body = await request.json();

    // Destructure data sent from the client
    const { prompt, dbType, dbSchema } = body;

    if (!prompt || !dbType || !dbSchema) {
      return NextResponse.json(
        {
          error:
            "Missing prompt, dbType, dbName or dbSchema in the request body.",
        },
        { status: 400 }
      );
    }

    // Construct a clear, detailed prompt for Gemini
    const fullPrompt = `Generate a working ${dbType} Query Language (MQL) query for a database & schema ${dbSchema} that fulfills the request: "${prompt}". Output ONLY the raw MQL code.`;

    // Call the Gemini API
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: fullPrompt,
      config: {
        // temperature: 0.1, // Using a low temperature for code generation
      },
    });

    // Clean up the text: remove any markdown or excessive whitespace
    let generatedQuery = response.text.trim();
    if (generatedQuery.startsWith("```")) {
      generatedQuery = generatedQuery.substring(
        generatedQuery.indexOf("\n") + 1
      );
      generatedQuery = generatedQuery
        .substring(0, generatedQuery.lastIndexOf("```"))
        .trim();
    }

    // Send the generated query back to the client using NextResponse.json
    return NextResponse.json({ query: generatedQuery }, { status: 200 });
  } catch (error) {
    console.error("Gemini Query Generation Error:", error);

    // Return a 500 response using NextResponse.json
    return NextResponse.json(
      { error: "Failed to generate query. Check API key and server logs." },
      { status: 500 }
    );
  }
}
