"""
OpenAlex Scientific Paper Search Module
Autonomous retrieval of 250M+ scholarly works via OpenAlex REST API.
"""

from typing import List, Dict, Any, Optional
import requests


def decode_abstract_inverted_index(inverted_index: Optional[Dict[str, List[int]]]) -> str:
    """
    Decodes OpenAlex's abstract_inverted_index format into a readable text string.
    Example input: {"Quantum": [0], "computing": [1], "advances": [2]}
    """
    if not inverted_index:
        return ""

    word_positions = []
    for word, positions in inverted_index.items():
        for pos in positions:
            word_positions.append((pos, word))

    # Sort words by position
    word_positions.sort(key=lambda item: item[0])
    return " ".join([word for _, word in word_positions])


def search_openalex(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Queries OpenAlex REST API for candidate scientific papers.
    """
    url = "https://api.openalex.org/works"
    headers = {
        "User-Agent": "Nexus3D-AI-Assistant/1.0 (mailto=researcher@example.com)"
    }
    params = {
        "search": query,
        "per_page": limit,
        "sort": "cited_by_count:desc"
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=12)
        response.raise_for_status()
        data = response.json()

        results = []
        for item in data.get("results", []):
            paper_id = item.get("id", "")
            title = item.get("title") or item.get("display_name") or "Untitled Paper"
            pub_year = item.get("publication_year") or 2025
            citation_count = item.get("cited_by_count", 0)
            doi = item.get("doi") or ""

            # Decode inverted index abstract
            raw_abstract_index = item.get("abstract_inverted_index")
            abstract = decode_abstract_inverted_index(raw_abstract_index)

            results.append({
                "id": paper_id,
                "title": title,
                "publication_year": pub_year,
                "citation_count": citation_count,
                "doi": doi,
                "abstract": abstract or title,
                "url": doi or f"https://openalex.org/{paper_id}",
            })

        return results

    except Exception as e:
        print(f"[OpenAlex Search Error] {e}")
        return []


if __name__ == "__main__":
    # Quick Test
    papers = search_openalex("Quantum Error Correction 2026", limit=3)
    print(f"Retrieved {len(papers)} papers from OpenAlex:")
    for p in papers:
        print(f"- [{p['publication_year']}] {p['title']} ({p['citation_count']} citations)")
        print(f"  Abstract preview: {p['abstract'][:120]}...\n")
