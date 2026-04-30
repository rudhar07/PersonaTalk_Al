import { ChatClient } from "@/components/ChatClient";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(244,114,182,0.2),transparent_35%),radial-gradient(circle_at_82%_12%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.2),transparent_45%)]" />
      <ChatClient />
    </div>
  );
}
