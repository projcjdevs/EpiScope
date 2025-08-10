
from typing import List, Optional
import pandas as pd
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "clean-data-api"

def load_data():
    return pd.read_csv("clean_data.csv")

class Outbreak(BaseModel):
    url: str
    url_title: str
    news_title: str
    year: int 
    total_infected: int 
    city: str

def load_data():
    return pd.read_csv("clean_data.csv")

@app.get("/outbreaks", response_model=List[Outbreak])
def get_outbreaks(x_api_key: Optional[str] = Header(None)):
    if x_api_key != API_KEY: 
        raise HTTPException(status_code = 403, detail="Invalid API Key")
    df = load_data()
    return [Outbreak(**row) for row in df.to_dict(orient="records")]
