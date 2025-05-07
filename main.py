from fastapi import FastAPI
import uvicorn
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

app = FastAPI(
    title="Daraz Data Pipeline",
    description="API for scraping and analyzing Daraz product data",
    version="0.1.0",
)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "daraz-pipeline"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
