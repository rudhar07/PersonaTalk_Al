export function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm border border-white/15 bg-white/8 px-3 py-2">
      <span className="sr-only">Typing</span>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80" />
    </div>
  );
}
