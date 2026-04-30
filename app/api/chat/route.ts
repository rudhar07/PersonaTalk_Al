import { GoogleGenAI } from "@google/genai";
import { personas } from "@/lib/personas";
import { PersonaId } from "@/lib/types";

interface InputMessage {
  role: "user" | "assistant";
  content: string;
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function normalizeError(error: unknown) {
  return error instanceof Error ? error.message.toLowerCase() : "";
}

function isRetryableError(details: string) {
  return (
    details.includes("rate limit") ||
    details.includes("resource_exhausted") ||
    details.includes("unavailable") ||
    details.includes("deadline_exceeded") ||
    details.includes("internal")
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { persona?: PersonaId; messages?: InputMessage[] };
    const personaId = body.persona ?? "anshuman";
    const messages =
      body.messages?.filter((msg) => typeof msg.content === "string" && msg.content.trim().length > 0) ?? [];

    const profile = personas[personaId];
    if (!profile) {
      return errorResponse("Invalid persona selected.", 400);
    }

    if (messages.length === 0) {
      return errorResponse("Please send a non-empty message.", 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return errorResponse("Server is missing GEMINI_API_KEY.", 500);
    }

    const client = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    let response: Awaited<ReturnType<typeof client.models.generateContentStream>> | null = null;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        response = await client.models.generateContentStream({
          model,
          contents,
          config: {
            systemInstruction: profile.systemPrompt,
            temperature: 0.85,
          },
        });
        break;
      } catch (error) {
        lastError = error;
        const details = normalizeError(error);
        const canRetry = isRetryableError(details) && attempt < 2;
        if (!canRetry) break;
        await sleep(350 * (attempt + 1));
      }
    }

    if (!response) {
      throw lastError ?? new Error("Model did not return a stream.");
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text ?? "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : "";
    const normalized = details.toLowerCase();
    console.error("Chat route error:", details || error);

    if (normalized.includes("api key") || normalized.includes("permission_denied")) {
      return errorResponse("Gemini API key is invalid or not authorized.", 401);
    }

    if (
      normalized.includes("quota") ||
      normalized.includes("rate limit") ||
      normalized.includes("resource_exhausted")
    ) {
      return errorResponse("Gemini quota exceeded. Please try again later.", 429);
    }

    return errorResponse("Failed to process chat request. Please try again.", 500);
  }
}
