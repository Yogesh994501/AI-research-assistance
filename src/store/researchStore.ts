import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { ResearchState, GraphNode, GraphEdge, ResearchResponse, IngestResponse, Session, AgentState } from '@/types';

const NODE_COLORS: Record<string, string> = {
  query: '#06b6d4',    // cyan
  concept: '#a855f7',  // violet
  source: '#22c55e',   // green
  document: '#eab308', // yellow
};

export const useResearchStore = create<ResearchState>((set, get) => ({
  // Graph
  nodes: [],
  edges: [],
  activeNodeId: null,
  hoveredNodeId: null,
  targetCameraPosition: null,

  // Agent State
  agentState: 'idle',

  // UI
  isResearching: false,
  streamingText: '',
  searchPanelOpen: true,
  detailDrawerOpen: false,
  historyPanelOpen: false,
  settingsPanelOpen: false,

  // Sessions
  sessions: [],
  currentSessionId: null,

  // Settings
  researchMode: 'quick',

  // ── Actions ──────────────────────────────────────────────────────────────

  addResearchResult: (query: string, response: ResearchResponse) => {
    const state = get();
    const sessionId = nanoid();
    const queryNodeId = nanoid();

    // Central query node
    const queryNode: GraphNode = {
      id: queryNodeId,
      label: query.length > 40 ? query.slice(0, 40) + '…' : query,
      type: 'query',
      x: 0, y: 0, z: 0,
      summary: response.answer,
      color: NODE_COLORS.query,
    };

    const newNodes: GraphNode[] = [queryNode];
    const newEdges: GraphEdge[] = [];

    // Source nodes — arranged in outer orbital shell
    response.sources.forEach((src, i) => {
      const angle = (i / Math.max(response.sources.length, 1)) * Math.PI * 2;
      const radius = 5 + Math.random() * 2;
      const nodeId = nanoid();
      newNodes.push({
        id: nodeId,
        label: src.title.length > 35 ? src.title.slice(0, 35) + '…' : src.title,
        type: 'source',
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.5) * 3,
        z: Math.sin(angle) * radius,
        summary: src.snippet,
        url: src.url,
        relevanceScore: src.relevanceScore,
        citationCount: src.citationCount,
        doi: src.doi,
        parentId: queryNodeId,
        color: NODE_COLORS.source,
      });
      newEdges.push({
        id: nanoid(),
        source: queryNodeId,
        target: nodeId,
        strength: src.relevanceScore,
      });
    });

    // Concept nodes — arranged in inner ring
    response.concepts.forEach((concept, i) => {
      const angle = (i / Math.max(response.concepts.length, 1)) * Math.PI * 2 + Math.PI / 6;
      const radius = 3 + Math.random();
      const nodeId = nanoid();
      newNodes.push({
        id: nodeId,
        label: concept,
        type: 'concept',
        x: Math.cos(angle) * radius,
        y: 1.5 + (Math.random() - 0.5) * 2,
        z: Math.sin(angle) * radius,
        parentId: queryNodeId,
        color: NODE_COLORS.concept,
      });
      newEdges.push({
        id: nanoid(),
        source: queryNodeId,
        target: nodeId,
        strength: 0.7,
      });
    });

    const session: Session = {
      id: sessionId,
      query,
      timestamp: Date.now(),
      nodeCount: newNodes.length,
    };

    set({
      nodes: [...state.nodes, ...newNodes],
      edges: [...state.edges, ...newEdges],
      sessions: [session, ...state.sessions],
      currentSessionId: sessionId,
      activeNodeId: queryNodeId,
      detailDrawerOpen: true,
      isResearching: false,
      agentState: 'complete',
      streamingText: '',
    });
  },

  addDocument: (response: IngestResponse) => {
    const state = get();
    const docNodeId = nanoid();
    const newNodes: GraphNode[] = [{
      id: docNodeId,
      label: response.title.length > 35 ? response.title.slice(0, 35) + '…' : response.title,
      type: 'document',
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 6,
      summary: `Document with ${response.chunks} chunks`,
      color: NODE_COLORS.document,
    }];
    const newEdges: GraphEdge[] = [];

    response.concepts.forEach((concept, i) => {
      const angle = (i / Math.max(response.concepts.length, 1)) * Math.PI * 2;
      const nodeId = nanoid();
      newNodes.push({
        id: nodeId,
        label: concept,
        type: 'concept',
        x: newNodes[0].x + Math.cos(angle) * 2.5,
        y: newNodes[0].y + (Math.random() - 0.5) * 2,
        z: newNodes[0].z + Math.sin(angle) * 2.5,
        parentId: docNodeId,
        color: NODE_COLORS.concept,
      });
      newEdges.push({ id: nanoid(), source: docNodeId, target: nodeId, strength: 0.8 });
    });

    set({
      nodes: [...state.nodes, ...newNodes],
      edges: [...state.edges, ...newEdges],
      agentState: 'complete',
    });
  },

  selectNode: (id) => {
    const state = get();
    const node = state.nodes.find((n) => n.id === id);
    let cameraPos: [number, number, number] | null = null;
    if (node) {
      // Offset camera position facing target node
      cameraPos = [node.x * 1.3, node.y + 1, node.z + 5];
    }
    set({ 
      activeNodeId: id, 
      detailDrawerOpen: id !== null,
      targetCameraPosition: cameraPos,
    });
  },
  hoverNode: (id) => set({ hoveredNodeId: id }),
  setAgentState: (s: AgentState) => set({ agentState: s }),
  setResearching: (v) => set({ isResearching: v, agentState: v ? 'searching' : 'idle' }),
  setStreamingText: (t) => set({ streamingText: t }),
  setResearchMode: (m) => set({ researchMode: m }),
  toggleSearchPanel: () => set((s) => ({ searchPanelOpen: !s.searchPanelOpen })),
  toggleDetailDrawer: () => set((s) => ({ detailDrawerOpen: !s.detailDrawerOpen })),
  toggleHistoryPanel: () => set((s) => ({ historyPanelOpen: !s.historyPanelOpen })),
  toggleSettingsPanel: () => set((s) => ({ settingsPanelOpen: !s.settingsPanelOpen })),
  clearGraph: () => set({ nodes: [], edges: [], activeNodeId: null, hoveredNodeId: null, detailDrawerOpen: false, agentState: 'idle' }),
  loadSession: (session, nodes, edges) => set({ nodes, edges, currentSessionId: session.id, activeNodeId: null }),
}));
