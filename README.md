# PersonaTalk AI

**PersonaTalk AI** is a persona-based chat app: pick a mentor-style profile and chat in real time with **streaming** responses powered by **Google Gemini**. Each persona has its own system prompt—voice, few-shot examples, step-by-step reasoning, output shape, and guardrails. The UI includes a persona switcher, per-persona suggestion chips, a typing indicator, resilient API errors, and a responsive layout.

---

## Live app

**https://persona-talk-ai.vercel.app/**

---

## Screenshots

**Landing — Anshuman Singh, hero + pull quote + numbered "known for" + suggestion chips**

![Landing — Anshuman Singh](./public/screenshots/landing.png)

**Active conversation — real Gemini streaming response in-character**

![Active conversation with Anshuman](./public/screenshots/conversation.png)

**Mobile (iPhone 14 Pro Max) — sidebar hides, pill-row persona switcher, stacked knownFor, composer pinned**

![Mobile view — Abhimanyu Saxena](./public/screenshots/mobile.png)

Images live under [`public/screenshots/`](./public/screenshots/). Commit and push them so GitHub’s README preview can load them.

---

## Features

| Area | What you get |
|------|----------------|
| **Three personas** | Anshuman Singh, Abhimanyu Saxena, Kshitij Mishra — separate prompts in [`lib/personas.ts`](./lib/personas.ts) |
| **Persona switcher** | Switching profile clears the thread and applies the new system prompt |
| **Active persona** | Always visible in the header (name, role, quote, avatar) |
| **Suggestion chips** | Per-persona starters |
| **Typing indicator** | While the model is generating |
| **Streaming** | Token stream from [`app/api/chat/route.ts`](./app/api/chat/route.ts) |
| **Responsive** | Works on mobile and desktop |
| **Secrets** | `GEMINI_API_KEY` only via environment variables |
| **Errors** | Friendly messages for auth, quota, and server issues |

---

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Google Gemini** (`@google/genai`), streaming

---

## Local setup

```bash
git clone <your-repo-url>
cd PersonaTalk_Al
npm install
cp .env.example .env.local
```

Edit **`.env.local`** (do not commit):

```env
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-2.5-flash
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Gemini API key — `.env.local` locally; host dashboard in production |
| `GEMINI_MODEL` | No | Model id; see [`.env.example`](./.env.example) |

Only [`.env.example`](./.env.example) belongs in git (placeholders). Never commit `.env.local` or real keys.

---

## Deploy (Vercel)

1. Push the repo to GitHub.  
2. Import the project in [Vercel](https://vercel.com/).  
3. Set **Environment Variables** for Production: `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`).  
4. Deploy and smoke-test: all three personas, switch + reset, chips, streaming, errors.

---

## Repo docs

| File | Contents |
|------|-----------|
| [`prompts.md`](./prompts.md) | All three system prompts, annotated |
| [`reflection.md`](./reflection.md) | Build notes and lessons learned |

---

## Project structure

```text
├── app/
│   ├── api/chat/route.ts    # Streaming Gemini
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/               # Chat, switcher, chips, typing indicator
├── public/screenshots/       # README images
├── lib/
│   ├── personas.ts           # Persona metadata + system prompts
│   ├── types.ts
│   └── utils.ts
├── prompts.md
├── reflection.md
├── .env.example
└── README.md
```

---

## Production troubleshooting

| Issue | What to check |
|-------|----------------|
| Missing `GEMINI_API_KEY` | Vercel env → redeploy |
| Invalid key | New key in Google AI Studio → update env → redeploy |
| Quota / rate limits | Wait or new key; UI should still show a clear message |
| Empty / stuck replies | Vercel function logs, model name, API access |

---

## Ethics note

Featured individuals are real public figures. Prompts aim for **respectful, professional** tone. Replies are **AI-generated**, not their actual statements.
