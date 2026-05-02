import { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={cn(
        "flex items-end gap-2 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <span className="mb-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-semibold uppercase tracking-wide text-white/80">
          AI
        </span>
      )}
      <div
        className={cn(
          "group max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-[0_8px_24px_-16px_rgba(0,0,0,0.9)] transition-all duration-200 hover:-translate-y-0.5",
          isUser
            ? "rounded-br-md border border-white/30 bg-gradient-to-br from-white/30 to-white/15 text-white"
            : "rounded-bl-md border border-white/15 bg-gradient-to-b from-white/12 to-black/25 text-white/95"
        )}
      >
        <p className={cn("mb-1 text-[10px] font-semibold uppercase tracking-[0.16em]", isUser ? "text-white/65" : "text-white/50")}>
          {isUser ? "You" : "Assistant"}
        </p>
        {message.content}
      </div>
      {isUser && (
        <span className="mb-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-[10px] font-semibold uppercase tracking-wide text-white/85">
          You
        </span>
      )}
    </div>
  );
}
