"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
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
  const [isSwitchingPersona, setIsSwitchingPersona] = useState(false);
  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const personaSwitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persona = useMemo(() => personas[activePersona], [activePersona]);

  useEffect(() => {
    const viewport = messageViewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (personaSwitchTimerRef.current) clearTimeout(personaSwitchTimerRef.current);
    };
  }, []);

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

  function onInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    void sendMessage(input);
  }

  function switchPersona(personaId: PersonaId) {
    if (personaSwitchTimerRef.current) clearTimeout(personaSwitchTimerRef.current);
    setIsSwitchingPersona(true);
    setActivePersona(personaId);
    setMessages([]);
    setInput("");
    setError("");
    personaSwitchTimerRef.current = setTimeout(() => setIsSwitchingPersona(false), 220);
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 overflow-hidden px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className={`absolute -right-16 top-24 h-64 w-64 rounded-full bg-gradient-to-br ${persona.accent} opacity-20 blur-3xl`} />
      </div>

      <header className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/15 to-white/5 p-5 shadow-[0_14px_50px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-2xl sm:p-7">
        <p className="text-xs uppercase tracking-[0.24em] text-white/60">Persona Studio</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{persona.name}</h1>
            <p className="mt-1 text-sm text-white/75 sm:text-base">{persona.title}</p>
          </div>
          <div
            className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${persona.accent} p-[1px] shadow-[0_8px_32px_-12px_rgba(255,255,255,0.6)]`}
          >
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/55 text-lg font-bold">
              {persona.initials}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">{persona.quote}</p>
        <div className="mt-5">
          <PersonaSwitcher activePersona={activePersona} onChange={switchPersona} />
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[300px,1fr]">
        <aside className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-[0_14px_50px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-2xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/85">Known For</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-white/80">
            {persona.knownFor.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/55" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-white/70">{persona.bio}</p>
          <SuggestionChips items={persona.suggestions} onPick={(v) => setInput(v)} />
        </aside>

        <div className="flex min-h-[68vh] flex-col rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-[0_14px_50px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-2xl">
          <div
            ref={messageViewportRef}
            className={`flex-1 space-y-3.5 overflow-y-auto pr-1 transition-opacity duration-200 [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin] ${
              isSwitchingPersona ? "opacity-40" : "opacity-100"
            }`}
          >
            {messages.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-sm leading-relaxed text-white/70">
                Start with a suggestion chip or ask your own question. Switching personas resets this thread by design.
              </p>
            ) : (
              messages.map((message) => <MessageBubble key={message.id} message={message} />)
            )}
            {loading && <TypingIndicator />}
          </div>

          {error && (
            <p className="mt-4 rounded-2xl border border-red-200/35 bg-gradient-to-r from-red-500/20 to-red-400/10 px-4 py-3 text-sm text-red-100 shadow-[0_10px_24px_-16px_rgba(239,68,68,0.8)]">
              {error}
            </p>
          )}

          <form
            onSubmit={onSubmit}
            className="mt-5 rounded-2xl border border-white/20 bg-black/35 p-2 shadow-[0_18px_34px_-24px_rgba(0,0,0,0.95)] ring-1 ring-white/10 backdrop-blur-xl"
          >
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                rows={2}
                placeholder={`Ask ${persona.name.split(" ")[0]} anything...`}
                className="flex-1 resize-none rounded-xl border border-transparent bg-transparent px-3 py-2.5 text-sm leading-relaxed outline-none transition-all duration-200 placeholder:text-white/45 focus:border-white/35 focus:bg-white/[0.02]"
              />
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex min-w-24 items-center justify-center gap-1 rounded-xl border border-white/25 bg-gradient-to-br ${persona.accent} px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_-16px_rgba(255,255,255,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <span>Send</span>
                <span className="text-base leading-none">→</span>
              </button>
            </div>
            <p className="px-3 pb-1 pt-2 text-[11px] text-white/45">Shift + Enter for new line</p>
          </form>
        </div>
      </section>
    </main>
  );
}
