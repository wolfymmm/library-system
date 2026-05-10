from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# ДОДАЙТЕ ЦЕЙ БЛОК:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # У продакшені замініть на адресу вашого фронтенду
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Завантаження моделі... зачекайте")
# classifier = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")
classifier = pipeline("zero-shot-classification", model="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

class BookAnalysis(BaseModel):
    title: str
    description: str

@app.post("/predict")
async def predict(book: BookAnalysis):
    full_text = f"{book.title}. {book.description}"
    
    # актуальний список категорій
    candidate_labels = [
        "Сучасні автори", "Романтична проза", "Дарк романи", 
        "Історична та пригодницька проза", "Детективи", 
        "Трилери та жахи", "Фантастика", "Фентезі", 
        "Класична література", "Комікси та манги"
    ]
    
    result = classifier(
        full_text, 
        candidate_labels, 
        multi_label=True,
        hypothesis_template="Ця книга написана у жанрі {}."
    )
    
    predictions = []
    for label, score in zip(result['labels'], result['scores']):
        predictions.append({
            "label": label,
            "confidence": round(score * 100, 2)
        })

    return {
        "suggested_genres": predictions[:3], 
        "top_match": predictions[0]["label"], 
        "top_confidence": predictions[0]["confidence"]
    }