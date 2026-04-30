import { GoogleGenAI } from "@google/genai";
import { personas } from "@/lib/personas";
import { PersonaId } from "@/lib/types";

interface InputMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { persona?: PersonaId; messages?: InputMessage[] };
    const personaId = body.persona ?? "anshuman";
    const messages = body.messages ?? [];

    const profile = personas[personaId];
    if (!profile) {
      return new Response("Invalid persona", { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response("Missing GEMINI_API_KEY", { status: 500 });
    }

    const client = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    const response = await client.models.generateContentStream({
      model,
      contents: messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      config: {
        systemInstruction: profile.systemPrompt,
        temperature: 0.85,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.text ?? "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response("Failed to process chat request", { status: 500 });
  }
}
