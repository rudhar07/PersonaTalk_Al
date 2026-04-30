"use client";

interface SuggestionChipsProps {
  items: string[];
  onPick: (value: string) => void;
}

export function SuggestionChips({ items, onPick }: SuggestionChipsProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/85 transition hover:border-white/40 hover:bg-white/20"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
