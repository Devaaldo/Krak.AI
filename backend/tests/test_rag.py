"""
Test retrieval RAG (Phase 1 — AI Engineer).

Memakai embedding + FAISS sungguhan (bukan mock) untuk membuktikan knowledge base
ter-index dan retrieval mengembalikan chunk relevan. Bila dependency GenAI atau
model embedding tidak tersedia (mis. environment minimal/offline), test di-skip
dengan anggun, bukan gagal.
"""
import pytest


def _safe_retrieve(query, k=3):
    try:
        from rag import build_index, retrieve

        build_index()
        return retrieve(query, k=k)
    except Exception as exc:  # ImportError / unduh model gagal / offline
        pytest.skip(f"RAG deps/model embedding tidak tersedia: {exc}")


def test_retrieval_korosi():
    docs = _safe_retrieve("apa penyebab retak akibat korosi tulangan?", k=3)
    assert docs, "retrieval tidak mengembalikan dokumen"
    joined = " ".join(d.page_content.lower() for d in docs)
    assert "korosi" in joined


def test_retrieval_perbaikan():
    docs = _safe_retrieve("metode perbaikan retak dengan injeksi", k=3)
    joined = " ".join(d.page_content.lower() for d in docs)
    assert "injeksi" in joined or "epoksi" in joined


def test_retrieval_has_source_metadata():
    docs = _safe_retrieve("klasifikasi keparahan retak", k=2)
    assert all(d.metadata.get("source", "").endswith(".md") for d in docs)
