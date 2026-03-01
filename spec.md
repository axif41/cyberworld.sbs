# Specification

## Summary
**Goal:** Overhaul the CyberMentor AI system with a full personality engine, structured 7-part responses, language detection, advanced auto-detecting modes, conversation memory, and a massively expanded client-side knowledge base.

**Planned changes:**
- Rewrite the CyberMentor response engine in `useCyberMentorKnowledge.ts` to always produce a mandatory 7-part response structure: Quick Answer, Deep Explanation, Real-World Example, Code Example, Common Mistakes, Extra Tips, and a closing follow-up prompt
- Add a pool of at least 15 random empathetic opening phrases and at least 10 random warm page-load greetings
- Use first-person language and encouragement phrases throughout all responses
- Implement a `detectLanguage` utility function that identifies Hindi (Devanagari), Hinglish (romanized Hindi keywords), and English, and generates responses in the detected language
- Add a "Deep Research Mode" toggle button in `CyberMentorPage.tsx`; when enabled, show five sequential animated thinking steps before each response streams in
- Implement auto-detecting Debug Mode: triggered by error/exception keywords or stack trace patterns, changes response to a 5-part debug structure (Error Explanation, Root Cause Analysis, Step-by-Step Fix, Corrected Code, Prevention Tips), and shows a "Debug Mode" badge on the message bubble
- Implement auto-detecting Project Generation Mode: triggered by project-request keywords, produces a 7-part project structure (Overview, Folder Structure, Frontend Code, Backend API, Database Schema, README, Deployment Steps), and shows a "Project Generator" badge
- Implement auto-detecting PPT Notes Mode: triggered by notes/PPT/summary keywords, formats response as structured bullet-point notes with section headings, and shows a "PPT Notes Mode" badge
- Build a conversation memory system in `CyberMentorPage.tsx`: store history as `{role, content, timestamp}` objects, pass last 10 messages as context, show message count in the chat header, add a "Clear Chat" button, persist to `sessionStorage`, and show a subtle context indicator when history is referenced
- Massively expand the knowledge base to cover hundreds of topics across all six domains: Frontend, Backend, Full Stack, Cyber Security, Ethical Hacking, and AI Development — each entry with a summary, full 7-part body, empathetic opening, and keyword array — all client-side

**User-visible outcome:** CyberMentor delivers rich, deeply structured answers with empathetic personality, responds in the user's language (English/Hindi/Hinglish), auto-activates specialized modes for debugging, project building, and note-taking, shows animated reasoning steps in Deep Research Mode, remembers conversation context across the session, and covers a comprehensive range of topics across all six course domains.
