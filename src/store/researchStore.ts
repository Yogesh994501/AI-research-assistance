import { create } from "zustand";
import type { ResearchStoreState, WorkflowStep } from "@/types";

const DEFAULT_WORKFLOW: WorkflowStep[] = [
  { id: "query", title: "Query Received", description: "Parsing research question", status: "pending", timestamp: null },
  { id: "search", title: "Searching Literature", description: "Querying OpenAlex, arXiv & Semantic Scholar", status: "pending", timestamp: null },
  { id: "rank", title: "Ranking Sources", description: "Scoring & deduplicating papers", status: "pending", timestamp: null },
  { id: "context", title: "Building Evidence", description: "Extracting key passages for context", status: "pending", timestamp: null },
  { id: "synthesize", title: "Synthesizing", description: "Gemini grounded synthesis", status: "pending", timestamp: null },
  { id: "validate", title: "Validating Citations", description: "Verifying citation integrity", status: "pending", timestamp: null },
];

export const useResearchStore = create<ResearchStoreState>((set, get) => ({
  /* ── initial state ── */
  agentState: "idle",
  activeQuery: "",
  papers: [],
  synthesisReport: "",
  selectedPaper: null,
  workflowSteps: DEFAULT_WORKFLOW.map((s) => ({ ...s })),
  activeMobilePanel: "studio",
  leftPanelView: "papers",
  is3DExpanded: false,
  isLoading: false,
  error: null,

  /* ── actions ── */
  setAgentState: (agentState) => set({ agentState }),
  setActiveQuery: (activeQuery) => set({ activeQuery }),
  setPapers: (papers) => set({ papers }),
  setSynthesisReport: (synthesisReport) => set({ synthesisReport }),
  setSelectedPaper: (selectedPaper) => set({ selectedPaper }),
  setWorkflowSteps: (workflowSteps) => set({ workflowSteps }),

  updateWorkflowStep: (id, status) =>
    set((state) => ({
      workflowSteps: state.workflowSteps.map((s) =>
        s.id === id ? { ...s, status, timestamp: Date.now() } : s
      ),
    })),

  setActiveMobilePanel: (activeMobilePanel) => set({ activeMobilePanel }),
  setLeftPanelView: (leftPanelView) => set({ leftPanelView }),
  set3DExpanded: (is3DExpanded) => set({ is3DExpanded }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  resetResearch: () =>
    set({
      agentState: "idle",
      activeQuery: "",
      papers: [],
      synthesisReport: "",
      selectedPaper: null,
      workflowSteps: DEFAULT_WORKFLOW.map((s) => ({ ...s })),
      is3DExpanded: false,
      isLoading: false,
      error: null,
    }),

  executeSearch: async (query: string) => {
    const store = get();
    if (!query.trim() || store.isLoading) return;

    set({
      isLoading: true,
      error: null,
      agentState: "searching",
      activeQuery: query.trim(),
      papers: [],
      synthesisReport: "",
      selectedPaper: null,
      workflowSteps: DEFAULT_WORKFLOW.map((s) => ({ ...s })),
    });

    store.updateWorkflowStep("query", "complete");
    store.updateWorkflowStep("search", "active");

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Request failed" }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();

      set({
        papers: data.papers || [],
        synthesisReport: data.report || "",
        agentState: "complete",
        isLoading: false,
      });

      /* Mark all workflow steps as complete */
      const steps = get().workflowSteps.map((s) => ({
        ...s,
        status: "complete" as const,
        timestamp: s.timestamp || Date.now(),
      }));
      set({ workflowSteps: steps });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      set({
        error: message,
        agentState: "error",
        isLoading: false,
      });
    }
  },
}));
