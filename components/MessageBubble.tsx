import { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "rounded-br-sm border border-white/20 bg-white/20"
            : "rounded-bl-sm border border-white/10 bg-black/25"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
