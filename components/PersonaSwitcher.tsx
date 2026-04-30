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
              "rounded-xl border px-3 py-2 text-left transition",
              isActive
                ? "border-white/40 bg-white/15"
                : "border-white/10 bg-black/20 hover:border-white/30 hover:bg-white/10"
            )}
          >
            <p className="text-xs text-white/70">{persona.initials}</p>
            <p className="text-sm font-semibold">{persona.name.split(" ")[0]}</p>
          </button>
        );
      })}
    </div>
  );
}
