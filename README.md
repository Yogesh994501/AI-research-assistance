# Nexus3D — 3D AI Academic Research Studio

Nexus3D is a production-quality, spatial AI academic research workstation that searches multiple scholarly repositories simultaneously, deduplicates and ranks literature, synthesizes grounded research reports with strict inline citation mapping via Google Gemini, and visualizes paper networks in an interactive 3D citation constellation.

---

## Architecture Overview

```text
nexus3d/
├── src/
│   ├── app/
│   │   ├── api/research/route.ts      # Multi-engine search + Gemini synthesis orchestrator
│   │   ├── globals.css                # Tailwind base + dark glassmorphic design system
│   │   ├── layout.tsx                 # Root HTML shell & Inter font setup
│   │   └── page.tsx                   # Main entry mounting WorkspaceLayout
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx             # Global search & agent status indicator
│   │   │   ├── WorkspaceLayout.tsx    # Desktop 3-panel & mobile responsive grid
│   │   │   └── MobileNavigation.tsx   # Fixed bottom tab navigation (Sources|Studio|Agent)
│   │   ├── panels/
│   │   │   ├── LeftPanel.tsx          # Literature Index & Paper vs. 3D toggle
│   │   │   ├── CenterPanel.tsx        # Grounded Synthesis Canvas
│   │   │   └── RightPanel.tsx         # Agent State Orb & Workflow Inspector
│   │   ├── research/
│   │   │   ├── SearchBar.tsx          # Query input with keyboard submit
│   │   │   ├── PaperCard.tsx          # Scholarly paper card with metadata chips
│   │   │   ├── PaperList.tsx          # Paper list with skeleton loaders & empty states
│   │   │   ├── CitationBadge.tsx      # Interactive inline citation [N] chips
│   │   │   ├── SynthesisReport.tsx    # Markdown renderer with interactive citation triggers
│   │   │   └── SourceInspector.tsx    # Metadata, abstract & PDF drawer
│   │   ├── agent/
│   │   │   ├── AgentStateOrb.tsx      # 2D state-reactive animated orb
│   │   │   ├── AgentWorkflow.tsx      # Step-by-step pipeline stepper
│   │   │   └── WorkflowStep.tsx       # Timeline step indicator
│   │   ├── three/
│   │   │   ├── ResearchCanvas.tsx     # SSR-safe R3F Three.js canvas wrapper
│   │   │   ├── ParticleField.tsx      # Ambient depth floating particle system
│   │   │   ├── AgentStateOrb.tsx      # Reactive 3D mesh distorted orb
│   │   │   ├── CitationConstellation.tsx # 3D spherical Fibonacci paper constellation
│   │   │   ├── CitationNode.tsx       # Individual 3D paper node with hover/click
│   │   │   └── CameraController.tsx   # Smooth Three.js camera lerping & OrbitControls
│   │   └── mobile/
│   │       ├── BottomSheet.tsx        # Touch-friendly bottom sheet drawer
│   │       ├── MobileSources.tsx      # Vertical card list + Fullscreen 3D
│   │       ├── MobileStudio.tsx       # Studio synthesis with BottomSheet inspector
│   │       └── MobileAgent.tsx        # Mobile agent workflow & generator cards
│   ├── lib/
│   │   ├── openalex.ts                # OpenAlex REST search & inverted-index abstract decoder
│   │   ├── arxiv.ts                   # arXiv XML API parser (fast-xml-parser)
│   │   ├── semanticScholar.ts         # Semantic Scholar Graph API client
│   │   ├── search.ts                  # Parallel multi-engine pipeline & relevance scoring
│   │   ├── gemini.ts                  # Grounded synthesis engine (@google/genai)
│   │   ├── citations.ts               # Citation parser, validator & lookup map
│   │   └── utils.ts                   # Tailwind merge & string formatting helpers
│   ├── store/
│   │   └── researchStore.ts           # Central Zustand store & search execution
│   └── types/
│       └── index.ts                   # Strict TypeScript domain interfaces
├── tailwind.config.ts                 # Glassmorphic dark design system configuration
├── tsconfig.json                      # Strict TypeScript compiler options
└── package.json
```

---

## Key Features

1. **Multi-Engine Academic Search**: Queries **OpenAlex**, **arXiv**, and **Semantic Scholar** concurrently using `Promise.allSettled()`.
2. **DOI & Normalized Title Deduplication**: Intelligent merging across academic sources preserving max metadata and citations.
3. **Transparent Relevance Scoring**: Heuristic ranking based on keyword matches, recency, citation volume, and abstract availability.
4. **Grounded Gemini 2.5 Flash Synthesis**: Strict system instruction enforcing verifiable facts and inline citations (`[1]`, `[2]`).
5. **Citation Integrity Verification**: Automated validation ensuring every citation in the report maps to an existing source in the literature index.
6. **3D Citation Constellation**: React Three Fiber 3D space with ambient particles, reactive agent orb, and interactive paper nodes arranged in a spherical Fibonacci lattice.
7. **Mobile-First Responsive Design**: Desktop 3-panel workspace dynamically adapts to a clean 3-tab mobile experience (`Sources | Studio | Agent`) with touch bottom sheets.

---

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your API keys:
```bash
cp .env.example .env.local
```

```env
GEMINI_API_KEY=your_gemini_api_key
LLM_MODEL=gemini-2.5-flash
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
