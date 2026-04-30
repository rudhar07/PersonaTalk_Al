export type PersonaId = "anshuman" | "abhimanyu" | "kshitij";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface PersonaConfig {
  id: PersonaId;
  name: string;
  title: string;
  initials: string;
  accent: string;
  bio: string;
  quote: string;
  knownFor: string[];
  suggestions: string[];
  systemPrompt: string;
}
