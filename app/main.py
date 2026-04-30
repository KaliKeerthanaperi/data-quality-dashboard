from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Data Quality Dashboard API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}