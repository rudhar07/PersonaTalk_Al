"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { SuggestionChips } from "@/components/SuggestionChips";
import { TypingIndicator } from "@/components/TypingIndicator";
import { personas } from "@/lib/personas";
import { ChatMessage, PersonaId } from "@/lib/types";
import { uid } from "@/lib/utils";

function getFriendlyError(status: number, apiMessage?: string) {
  if (apiMessage) return apiMessage;
  if (status === 401) return "Gemini key is invalid. Please update environment variables.";
  if (status === 429) return "Quota exceeded. Please wait and try again.";
  if (status >= 500) return "AI service is temporarily unavailable. Please try again.";
  return "Could not complete the request. Please try again.";
}

export function ChatClient() {
  const [activePersona, setActivePersona] = useState<PersonaId>("anshuman");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const persona = useMemo(() => personas[activePersona], [activePersona]);

  async function sendMessage(raw: string) {
    const content = raw.trim();
    if (!content || loading) return;

    setError("");
    setLoading(true);
    setInput("");

    const userMessage: ChatMessage = { id: uid(), role: "user", content };
    const assistantId = uid();
    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: activePersona,
          messages: [...messages, userMessage].map(({ role, content: text }) => ({ role, content: text })),
        }),
      });

      if (!response.ok) {
        let apiMessage = "";
        try {
          const data = (await response.json()) as { error?: string };
          apiMessage = data.error ?? "";
        } catch {
          apiMessage = "";
        }
        throw new Error(getFriendlyError(response.status, apiMessage));
      }

      if (!response.body) {
        throw new Error("Could not stream response from server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedAnyText = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) receivedAnyText = true;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg))
        );
      }

      if (!receivedAnyText) {
        throw new Error("Model returned an empty response. Please try again.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(message || "The AI service is currently unavailable. Please try again.");
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void sendMessage(input);
  }

  function switchPersona(personaId: PersonaId) {
    setActivePersona(personaId);
    setMessages([]);
    setInput("");
    setError("");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-4 py-6 text-white sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-white/15 bg-black/35 p-4 backdrop-blur-xl sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/65">Persona Studio</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{persona.name}</h1>
            <p className="text-sm text-white/75">{persona.title}</p>
          </div>
          <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${persona.accent} p-[1px]`}>
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/50 text-lg font-bold">
              {persona.initials}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/80">{persona.quote}</p>
        <PersonaSwitcher activePersona={activePersona} onChange={switchPersona} />
      </header>

      <section className="grid gap-4 lg:grid-cols-[280px,1fr]">
        <aside className="rounded-3xl border border-white/15 bg-black/30 p-4 backdrop-blur-xl">
          <h2 className="text-sm font-semibold">Known For</h2>
          <ul className="mt-2 space-y-2 text-sm text-white/80">
            {persona.knownFor.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-white/70">{persona.bio}</p>
          <SuggestionChips items={persona.suggestions} onPick={(v) => setInput(v)} />
        </aside>

        <div className="flex min-h-[65vh] flex-col rounded-3xl border border-white/15 bg-black/30 p-4 backdrop-blur-xl">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/70">
                Start with a suggestion chip or ask your own question. Switching personas resets this thread by design.
              </p>
            ) : (
              messages.map((message) => <MessageBubble key={message.id} message={message} />)
            )}
            {loading && <TypingIndicator />}
          </div>

          {error && (
            <p className="mt-3 rounded-xl border border-red-300/30 bg-red-500/15 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit} className="mt-4 flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder={`Ask ${persona.name.split(" ")[0]} anything...`}
              className="flex-1 resize-none rounded-2xl border border-white/15 bg-black/35 px-3 py-2 text-sm outline-none focus:border-white/40"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
