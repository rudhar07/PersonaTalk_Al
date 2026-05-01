export function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/15 bg-gradient-to-b from-white/10 to-black/20 px-3 py-2 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.9)]">
      <span className="sr-only">Typing</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">Assistant</span>
      <span className="h-1 w-1 rounded-full bg-white/35" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80" />
    </div>
  );
}
