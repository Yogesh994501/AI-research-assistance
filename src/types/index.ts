// ── Graph Node Types ─────────────────────────────────────────────────────────
export type NodeType = 'query' | 'concept' | 'source' | 'document';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  z: number;
  // Velocity for force simulation
  vx?: number;
  vy?: number;
  vz?: number;
  // Metadata
  summary?: string;
  url?: string;
  relevanceScore?: number;
  parentId?: string;
  color?: string;
  citationCount?: number;
  doi?: string;
  methodology?: string;
  limitations?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  strength: number; // 0-1
}

// ── Research Session ─────────────────────────────────────────────────────────
export interface Session {
  id: string;
  query: string;
  timestamp: number;
  nodeCount: number;
}

// ── API Response Types ───────────────────────────────────────────────────────
export interface PaperComparison {
  title: string;
  methodology: string;
  keyFindings: string;
  limitations: string;
  citationCount?: number;
  doi?: string;
}

export interface SearchSource {
  id: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  publishedAt?: string;
  relevanceScore: number;
  citationCount?: number;
  doi?: string;
}

export interface ResearchResponse {
  answer: string;
  sources: SearchSource[];
  concepts: string[];
  followUps: string[];
  paperComparisons?: PaperComparison[];
}

export interface IngestResponse {
  documentId: string;
  title: string;
  chunks: number;
  concepts: string[];
}

export type AgentState = 'idle' | 'searching' | 'synthesizing' | 'complete';
export type PreviewType = 'slides' | 'bibtex' | 'podcast' | 'markdown' | null;

// ── Store State ──────────────────────────────────────────────────────────────
export interface ResearchState {
  // Graph
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeNodeId: string | null;
  hoveredNodeId: string | null;
  targetCameraPosition: [number, number, number] | null;

  // Agent State
  agentState: AgentState;

  // UI State
  isResearching: boolean;
  streamingText: string;
  searchPanelOpen: boolean;
  detailDrawerOpen: boolean;
  historyPanelOpen: boolean;
  settingsPanelOpen: boolean;
  activePreview: PreviewType;

  // Sessions
  sessions: Session[];
  currentSessionId: string | null;

  // Settings
  researchMode: 'quick' | 'deep';

  // Actions
  addResearchResult: (query: string, response: ResearchResponse) => void;
  addDocument: (response: IngestResponse) => void;
  selectNode: (id: string | null) => void;
  hoverNode: (id: string | null) => void;
  setAgentState: (s: AgentState) => void;
  setResearching: (v: boolean) => void;
  setStreamingText: (t: string) => void;
  setResearchMode: (m: 'quick' | 'deep') => void;
  setActivePreview: (p: PreviewType) => void;
  toggleSearchPanel: () => void;
  toggleDetailDrawer: () => void;
  toggleHistoryPanel: () => void;
  toggleSettingsPanel: () => void;
  clearGraph: () => void;
  loadSession: (session: Session, nodes: GraphNode[], edges: GraphEdge[]) => void;
}
