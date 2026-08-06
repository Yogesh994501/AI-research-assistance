# 🌌 Nexus3D — 3D AI Academic Research Studio

> **Production-Ready 3D AI Research Workspace** powered by Next.js 14+ (App Router), React Three Fiber (R3F), Three.js, Tailwind CSS, Google Gemini 2.5 Flash, OpenAlex (250M+ Papers), Semantic Scholar, and arXiv.

---

## 🌟 Overview

**Nexus3D** transforms flat 2D search into an interactive 3D spatial research studio. It autonomously queries scholarly literature databases, calculates hybrid vector/BM25 rankings, re-ranks context via local cross-encoders, and renders grounded 4-part scientific syntheses alongside interactive 3D citation constellations.

---

## ✨ Key Features

### 📚 1. Multi-Engine Scholarly Discovery
- **OpenAlex Integration**: Direct access to 250M+ paper index (no API key required). Extracts citation counts, DOIs, abstracts, and open-access PDF links.
- **Semantic Scholar & arXiv Integration**: Queries live arXiv preprints and Semantic Scholar paper graphs in parallel.
- **Serper Google Scholar**: Optional fallback endpoint for broad search indexing.

### ⚡ 2. Hybrid Retrieval + FlashRank Re-Ranking
- **BM25 Sparse Keyword Search**: TF-IDF exact keyword matching for chemical formulas, model names, and clinical trial codes.
- **Dense Vector Embeddings**: Cosine similarity vector search.
- **FlashRank Re-Ranking**: Cross-encoder stage re-evaluating top candidate chunks against query token overlap.

### 🌐 3. Interactive 3D Spatial Canvas
- **3D Citation Constellation**: Papers rendered as floating 3D spheres scaled by real citation count (e.g. 5,472 citations).
- **Smooth 3D Camera Lerp**: Clicking a 3D paper node smoothly zooms the camera straight to that targeted paper in 3D space.
- **Dynamic 3D Agent State Orb**: Central 3D wireframe core sphere that visually reacts to agent state transitions (*Idle*, *Searching*, *Synthesizing*, *Complete*).
- **GPU Particle Field**: Ambient floating starfield drift with Bloom and ToneMapping post-processing.

### 🎨 4. Modern Glassmorphism 3-Panel UI
- **Left Panel (Width: 320px)**: Literature Index with `Paper List` vs `3D Graph` tabs, match scores (`99% Match`), and source context checkboxes.
- **Center Panel (Flex-1)**: Grounded Synthesis Report canvas with key methodological callouts, interactive citation badges `[1]`, comparative tables, and collapsible split-screen `Source Inspector` PDF drawer.
- **Right Panel (Width: 320px)**: Agent Workflow Inspector tracking LangGraph pipeline execution, plus Studio Generators (*Executive Slide Deck*, *Export BibTeX*, *Audio Podcast*).

### 🎓 5. World-Class Scientific Synthesizer Prompt
- Strict inline citation mapping (`[1]`, `[2]`).
- Strict anti-hallucination rules (*"No empirical evidence found in provided corpus"*).
- Automatic extraction of statistical parameters, sample sizes, datasets, and performance metrics into Markdown comparison tables.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), TypeScript, React 19 |
| **Styling** | Tailwind CSS v4, Glassmorphism backdrop-blur, Lucide Icons |
| **3D Engine** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Post-Processing** | `@react-three/postprocessing` (Bloom, ToneMapping) |
| **AI LLM Engine** | Google Gemini 2.5 Flash (`@google/genai`) |
| **Scholarly APIs** | OpenAlex API, Semantic Scholar API, arXiv XML API, Serper API |
| **Vector Store** | In-memory Hybrid Search Engine (BM25 + Dense Vectors + FlashRank) |
| **State Management** | Zustand |

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js `v18.0.0` or higher
- npm or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Yogesh994501/AI-research-assistance.git
cd AI-research-assistance

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
# Create a .env.local file in the project root:
GEMINI_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-2.5-flash
SERPER_API_KEY=your_serper_key_optional

# 4. Start Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

```
nexus-3d-research/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── research/route.ts      # Research orchestration route
│   │   │   └── ingest/route.ts        # PDF parsing & RAG ingestion
│   │   ├── globals.css                # Dark theme & glassmorphism
│   │   ├── layout.tsx                 # Root layout & typography
│   │   └── page.tsx                   # 3-Panel Workspace page
│   ├── components/
│   │   ├── three/
│   │   │   ├── ResearchCanvas.tsx     # Main R3F Canvas & Camera Controller
│   │   │   ├── KnowledgeGraph.tsx     # 3D Node & Edge Manager
│   │   │   ├── GraphNode3D.tsx        # Interactive 3D Node & Tooltip
│   │   │   ├── ConnectionLine.tsx     # Pulsing 3D Edge Lines
│   │   │   ├── AgentStateOrb.tsx      # Dynamic 3D Agent State Core
│   │   │   └── ParticleField.tsx      # Starfield GPU Particles
│   │   ├── workspace/
│   │   │   ├── LeftPanel.tsx          # Literature Index & Sources
│   │   │   ├── CenterPanel.tsx        # Synthesis Canvas & Header
│   │   │   ├── RightPanel.tsx         # Agent Inspector & Generators
│   │   │   └── PdfViewerDrawer.tsx    # Split-screen PDF Source Inspector
│   │   └── hud/
│   │       ├── DetailDrawer.tsx       # Metadata Drawer
│   │       ├── HistoryPanel.tsx       # Research History Sidebar
│   │       └── SettingsPanel.tsx      # Preferences Panel
│   ├── lib/
│   │   ├── gemini.ts                  # Gemini API & Academic Prompt
│   │   ├── search.ts                  # Multi-engine OpenAlex/arXiv/S2 search
│   │   └── vectorStore.ts             # BM25 + Vector Hybrid Reranker
│   ├── store/
│   │   └── researchStore.ts           # Zustand global state
│   └── types/
│       └── index.ts                   # TypeScript interfaces
├── package.json
└── README.md
```

---

## 📜 License

MIT License © 2026 Yogesh. Built for high-impact AI research automation.
