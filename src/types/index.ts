/* ─── Paper ─── */
export interface Paper {
  id: string;
  title: string;
  doi: string | null;
  citationCount: number;
  abstract: string | null;
  openAccessPdf: string | null;
  authors: string[];
  year: number | null;
  source: "openalex" | "arxiv" | "semantic_scholar";
  url: string | null;
  relevanceScore: number;
}

/* ─── Agent State ─── */
export type AgentState = "idle" | "searching" | "synthesizing" | "complete" | "error";

/* ─── Workflow ─── */
export type StepStatus = "pending" | "active" | "complete" | "error";

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  timestamp: number | null;
}

/* ─── Citation Node (3D) ─── */
export interface CitationNode {
  paperId: string;
  title: string;
  citationCount: number;
  position: [number, number, number];
  connectedNodes: string[];
  relevance: number;
}

/* ─── Mobile Panel ─── */
export type MobilePanel = "sources" | "studio" | "agent";

/* ─── Left Panel View ─── */
export type LeftPanelView = "papers" | "graph";

/* ─── Research Store State ─── */
export interface ResearchStoreState {
  /* state */
  agentState: AgentState;
  activeQuery: string;
  papers: Paper[];
  synthesisReport: string;
  selectedPaper: Paper | null;
  workflowSteps: WorkflowStep[];
  activeMobilePanel: MobilePanel;
  leftPanelView: LeftPanelView;
  is3DExpanded: boolean;
  isLoading: boolean;
  error: string | null;

  /* actions */
  setAgentState: (state: AgentState) => void;
  setActiveQuery: (query: string) => void;
  setPapers: (papers: Paper[]) => void;
  setSynthesisReport: (report: string) => void;
  setSelectedPaper: (paper: Paper | null) => void;
  setWorkflowSteps: (steps: WorkflowStep[]) => void;
  updateWorkflowStep: (id: string, status: StepStatus) => void;
  setActiveMobilePanel: (panel: MobilePanel) => void;
  setLeftPanelView: (view: LeftPanelView) => void;
  set3DExpanded: (expanded: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetResearch: () => void;
  executeSearch: (query: string) => Promise<void>;
}
