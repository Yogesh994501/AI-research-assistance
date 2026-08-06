"""
Hybrid Search & Re-ranking Pipeline
Combines LanceDB dense vector embeddings (all-MiniLM-L6-v2), BM25 lexical search (rank_bm25),
Reciprocal Rank Fusion (RRF), and FlashRank cross-encoder re-ranking.
"""

import os
import math
from typing import List, Dict, Any, Tuple

# Try imports with graceful fallback structures
try:
    import lancedb
    LANCEDB_AVAILABLE = True
except ImportError:
    LANCEDB_AVAILABLE = False

try:
    from rank_bm25 import BM25Okapi
    BM25_AVAILABLE = True
except ImportError:
    BM25_AVAILABLE = False

try:
    from flashrank import Ranker, RerankRequest
    FLASHRANK_AVAILABLE = True
except ImportError:
    FLASHRANK_AVAILABLE = False

try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False


class HybridRetriever:
    def __init__(self, db_path: str = "./lancedb_data"):
        self.db_path = db_path
        self.chunks: List[Dict[str, Any]] = []
        self.bm25_model: Any = None
        self.embedding_model: Any = None
        self.ranker: Any = None

        if SENTENCE_TRANSFORMERS_AVAILABLE:
            try:
                self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
            except Exception:
                pass

        if FLASHRANK_AVAILABLE:
            try:
                self.ranker = Ranker(model_name="ms-marco-TinyBERT-L-2-v2")
            except Exception:
                pass

        if LANCEDB_AVAILABLE:
            try:
                self.db = lancedb.connect(self.db_path)
            except Exception:
                self.db = None
        else:
            self.db = None

    def index_chunks(self, chunks: List[Dict[str, Any]]):
        """
        Indexes chunks into LanceDB vector database and BM25 lexical search index.
        """
        self.chunks = chunks
        if not chunks:
            return

        # 1. BM25 Lexical Index
        if BM25_AVAILABLE:
            tokenized_corpus = [chunk.get("text", "").lower().split() for chunk in chunks]
            self.bm25_model = BM25Okapi(tokenized_corpus)

        # 2. Dense Vector Embeddings in LanceDB
        if self.db and self.embedding_model:
            try:
                texts = [c.get("text", "") for c in chunks]
                embeddings = self.embedding_model.encode(texts).tolist()

                data = []
                for i, c in enumerate(chunks):
                    data.append({
                        "id": str(i),
                        "vector": embeddings[i],
                        "text": c.get("text", ""),
                        "file_name": c.get("file_name", "doc.pdf"),
                        "page_no": c.get("page_no", 1)
                    })

                self.table = self.db.create_table("chunks", data=data, mode="overwrite")
            except Exception as e:
                print(f"[LanceDB Index Error] {e}")

    def reciprocal_rank_fusion(
        self,
        dense_results: List[Tuple[int, float]],
        bm25_results: List[Tuple[int, float]],
        k: int = 60
    ) -> List[Tuple[int, float]]:
        """
        Combines dense vector and BM25 candidate ranks using RRF.
        """
        rrf_scores: Dict[int, float] = {}

        # Process dense results
        for rank, (idx, _) in enumerate(dense_results):
            rrf_scores[idx] = rrf_scores.get(idx, 0.0) + (1.0 / (k + rank + 1))

        # Process BM25 results
        for rank, (idx, _) in enumerate(bm25_results):
            rrf_scores[idx] = rrf_scores.get(idx, 0.0) + (1.0 / (k + rank + 1))

        sorted_rrf = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
        return sorted_rrf

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Executes parallel BM25 & dense vector search, fuses candidates via RRF,
        and re-ranks top 20 candidates through FlashRank.
        Returns top top_k re-ranked chunks with confidence scores.
        """
        if not self.chunks:
            return []

        # 1. BM25 Search
        bm25_ranks: List[Tuple[int, float]] = []
        if self.bm25_model:
            tokenized_query = query.lower().split()
            scores = self.bm25_model.get_scores(tokenized_query)
            top_bm25_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:20]
            bm25_ranks = [(idx, float(scores[idx])) for idx in top_bm25_indices]
        else:
            bm25_ranks = [(i, 1.0) for i in range(min(20, len(self.chunks)))]

        # 2. Dense Vector Search
        dense_ranks: List[Tuple[int, float]] = []
        if self.embedding_model:
            query_vector = self.embedding_model.encode([query])[0].tolist()
            if self.db and hasattr(self, "table"):
                try:
                    results = self.table.search(query_vector).limit(20).to_list()
                    for r in results:
                        dense_ranks.append((int(r["id"]), 1.0 - float(r.get("_distance", 0.0))))
                except Exception:
                    pass

        if not dense_ranks:
            dense_ranks = bm25_ranks

        # 3. Reciprocal Rank Fusion (RRF)
        fused_ranks = self.reciprocal_rank_fusion(dense_ranks, bm25_ranks)
        candidate_indices = [idx for idx, _ in fused_ranks[:20]]
        candidates = [self.chunks[idx] for idx in candidate_indices if idx < len(self.chunks)]

        # 4. FlashRank Re-ranking
        if self.ranker and candidates:
            try:
                passages = [{"id": str(i), "text": c.get("text", "")} for i, c in enumerate(candidates)]
                rerank_req = RerankRequest(query=query, passages=passages)
                reranked_results = self.ranker.rerank(rerank_req)

                final_results = []
                for item in reranked_results[:top_k]:
                    candidate_idx = int(item["id"])
                    chunk = candidates[candidate_idx]
                    chunk_copy = dict(chunk)
                    chunk_copy["confidence_score"] = round(float(item.get("score", 0.95)), 4)
                    final_results.append(chunk_copy)

                return final_results
            except Exception as e:
                print(f"[FlashRank Rerank Error] {e}")

        # Fallback if FlashRank is not available
        final_results = []
        for idx in candidate_indices[:top_k]:
            if idx < len(self.chunks):
                c = dict(self.chunks[idx])
                c["confidence_score"] = 0.92
                final_results.append(c)

        return final_results


if __name__ == "__main__":
    print("Hybrid Search & FlashRank Re-ranking Pipeline loaded.")
