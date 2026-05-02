"use client";

import { personaList } from "@/lib/personas";
import { PersonaId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PersonaSwitcherProps {
  activePersona: PersonaId;
  onChange: (id: PersonaId) => void;
}

export function PersonaSwitcher({ activePersona, onChange }: PersonaSwitcherProps) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 backdrop-blur">
      {personaList.map((persona) => {
        const isActive = persona.id === activePersona;
        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onChange(persona.id)}
            className={cn(
              "rounded-xl border px-3 py-2 text-left transition-all duration-200 active:scale-[0.98]",
              isActive
                ? "border-white/40 bg-white/15 shadow-[0_8px_20px_-14px_rgba(255,255,255,0.7)]"
                : "border-white/10 bg-black/20 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
            )}
          >
            <p className="text-xs text-white/70 transition-colors duration-200">{persona.initials}</p>
            <p className="text-sm font-semibold tracking-tight">{persona.name.split(" ")[0]}</p>
          </button>
        );
      })}
    </div>
  );
}
