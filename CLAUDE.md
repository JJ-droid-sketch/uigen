# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## UIGen (`ClaudeCode/uigen/`)

### Commands

```bash
# Initial setup (install deps, generate Prisma client, run migrations)
npm run setup

# Development server (uses Turbopack)
npm run dev

# Run tests
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx

# Lint
npm run lint

# Reset the database
npm run db:reset

# Background dev server (writes output to logs.txt)
npm run dev:daemon
```

All dev/build commands require the `NODE_OPTIONS='--require ./node-compat.cjs'` prefix (already included in npm scripts). The `node-compat.cjs` shim removes `globalThis.localStorage/sessionStorage` to prevent SSR breakage on Node 25+.

### Architecture

The app is **Next.js 15 with App Router**. The core flow: user describes a React component → Claude (via Vercel AI SDK) generates files into a `VirtualFileSystem` → components are transpiled in-browser with Babel and previewed in an iframe via ES module import maps.

**Key abstractions:**

- **`VirtualFileSystem`** (`src/lib/file-system.ts`) — in-memory file system (no disk writes). Serializes to plain JSON for persistence in the DB and for sending to the AI API route with each request.

- **`FileSystemContext`** (`src/lib/contexts/file-system-context.tsx`) — React context wrapping the VFS; handles tool call events from the AI stream (`str_replace_editor`, `file_manager`) and triggers re-renders.

- **`ChatContext`** (`src/lib/contexts/chat-context.tsx`) — wraps `useChat` from `@ai-sdk/react`; sends the serialized VFS state with every message; bridges tool calls to `FileSystemContext.handleToolCall`.

- **`/api/chat`** (`src/app/api/chat/route.ts`) — POST endpoint that calls `streamText` with two tools: `str_replace_editor` (create/edit files) and `file_manager` (rename/delete). Saves conversation and VFS state to DB on finish if user is authenticated.

- **`PreviewFrame`** (`src/components/preview/PreviewFrame.tsx`) — renders virtual files in an iframe by running JSX through Babel (`@babel/standalone`), creating blob URLs, and building an import map. Third-party packages are resolved via `esm.sh`. Tailwind is loaded via CDN.

- **Generation prompt** (`src/lib/prompts/generation.tsx`) — instructs Claude to always start with `/App.jsx` as the entry point, use Tailwind for styles (not inline styles), and import local files with `@/` alias.

**Authentication:** JWT stored in an httpOnly cookie (`auth-token`). `src/lib/auth.ts` handles session creation/verification with `jose`. `/api/projects` and `/api/filesystem` are protected via `src/middleware.ts`. App supports both authenticated users (projects persisted in SQLite via Prisma) and anonymous users (session-local state only, tracked in `src/lib/anon-work-tracker.ts`).

**Database:** Prisma with SQLite (`prisma/schema.prisma`). Two models: `User` and `Project` (stores serialized messages and VFS state as JSON strings). Prisma client output is generated into `src/generated/prisma/`.

**AI provider:** Uses `claude-haiku-4-5` by default (`src/lib/provider.ts`). If `ANTHROPIC_API_KEY` is not set, falls back to a `MockLanguageModel` that returns static components.

**Tests:** Vitest + React Testing Library with jsdom. Test files live in `__tests__/` directories alongside the code they test.

### Environment

Copy `.env` and set:
```
ANTHROPIC_API_KEY=your-api-key-here   # Optional; mock provider used if absent
JWT_SECRET=your-secret                 # Defaults to "development-secret-key"
```

