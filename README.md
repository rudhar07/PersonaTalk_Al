# PersonaTalk AI

A standout persona-based AI chatbot for Assignment 01 (Prompt Engineering, Scaler Academy), featuring:
- Three deeply separated personas (Anshuman, Abhimanyu, Kshitij)
- Real Gemini streaming responses
- Conversation reset on persona switch
- Suggestion chips, typing indicator, and graceful error states
- Distinctive glassmorphism + aurora-gradient interface

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Google Gemini (`@google/genai`)

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env.local
   ```
3. Add your key in `.env.local`:
   ```env
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## Assignment Criteria Coverage

- Persona switcher for all 3 personalities
- Thread reset on persona change
- Active persona always visible
- Persona-specific suggestion chips
- Typing indicator during API generation
- Mobile responsive layout
- API key only via env var
- Distinct system prompts with few-shot examples, CoT instruction, output instruction, constraints
- Graceful backend/API error handling

## Project Structure

```text
persona-chat/
├── app/
│   ├── api/chat/route.ts         # Streaming Gemini route
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main page shell
├── components/
│   ├── ChatClient.tsx            # Main chat orchestration
│   ├── MessageBubble.tsx
│   ├── PersonaSwitcher.tsx
│   ├── SuggestionChips.tsx
│   └── TypingIndicator.tsx
├── lib/
│   ├── personas.ts               # Persona metadata + system prompts
│   ├── types.ts
│   └── utils.ts
├── prompts.md
├── reflection.md
└── .env.example
```

## Deploy (Vercel)

1. Push to GitHub.
2. Import repo in Vercel.
3. Add env var `GEMINI_API_KEY` (and optional `GEMINI_MODEL`).
4. Deploy and copy your public live URL.

## Notes

- The personas are real public figures and are represented respectfully.
- Responses are AI-generated simulations, not real statements.
