import json
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
kw_model = KeyBERT(model=embedding_model)

def extract_keywords_by_year(annotation_path="data/event_annotations.json", top_n=5):
    with open(annotation_path, 'r', encoding='utf-8') as f:
        annotations = json.load(f)

    keyword_output = {}

    for year, notes in annotations.items():
        if not notes:
            keyword_output[year] = []
            continue

        text_block = " ".join(notes)
        keywords = kw_model.extract_keywords(text_block, top_n=top_n, stop_words='english')
        keyword_output[year] = [kw[0] for kw in keywords]

    return keyword_output
