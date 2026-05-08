from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import pandas as pd
import numpy as np

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Data Quality Dashboard API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    # Save the uploaded file
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": file.filename, "message": "File uploaded successfully"}


def _load_dataframe(filename: str) -> pd.DataFrame:
    upload_dir = "uploads"
    file_path = os.path.join(upload_dir, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File '{filename}' not found")
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".csv":
        return pd.read_csv(file_path)
    elif ext in (".xlsx", ".xls"):
        return pd.read_excel(file_path)
    elif ext == ".json":
        return pd.read_json(file_path)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")


@app.get("/data-quality/{filename}")
def get_data_quality(filename: str):
    df = _load_dataframe(filename)
    duplicate_count = int(df.duplicated().sum())
    duplicate_pct = (duplicate_count / len(df) * 100) if len(df) > 0 else 0.0
    return {
        "rows": len(df),
        "columns": len(df.columns),
        "duplicates": duplicate_count,
        "duplicatePercentage": round(duplicate_pct, 2),
        "columnNames": list(df.columns),
    }


@app.get("/issues/{filename}")
def get_issues(filename: str):
    df = _load_dataframe(filename)
    total_rows = len(df)
    columns_data = []
    total_nulls = 0
    total_errors = 0

    for col in df.columns:
        series = df[col]
        null_count = int(series.isna().sum())
        null_pct = round((null_count / total_rows * 100), 2) if total_rows > 0 else 0.0
        total_nulls += null_count

        errors = []
        error_count = 0

        # Detect mixed types in object columns (excluding nulls)
        if series.dtype == object:
            non_null = series.dropna()
            type_set = set(type(v).__name__ for v in non_null)
            if len(type_set) > 1:
                mixed_count = int(
                    non_null.apply(lambda v: not isinstance(v, str)).sum()
                )
                if mixed_count > 0:
                    errors.append(f"Mixed types detected in {mixed_count} row(s)")
                    error_count += mixed_count

        # Detect numeric columns stored as object (non-parseable strings)
        if series.dtype == object:
            non_null = series.dropna()
            if len(non_null) > 0:
                numeric_fail = 0
                for v in non_null:
                    try:
                        float(str(v))
                    except (ValueError, TypeError):
                        pass
                    else:
                        continue
                # Try coercing the whole column
                coerced = pd.to_numeric(series, errors='coerce')
                coerce_fail = int(coerced.isna().sum()) - null_count
                if coerce_fail > 0:
                    # Only flag if majority looks numeric
                    pass

        # Detect negative values in columns that should be non-negative (heuristic: column name hints)
        negative_hints = ["age", "count", "qty", "quantity", "price", "amount", "salary", "score"]
        col_lower = col.lower()
        if any(hint in col_lower for hint in negative_hints):
            if pd.api.types.is_numeric_dtype(series):
                neg_count = int((series.dropna() < 0).sum())
                if neg_count > 0:
                    errors.append(f"Negative values in {neg_count} row(s)")
                    error_count += neg_count

        # Detect outliers (values beyond 3 std deviations) for numeric columns
        if pd.api.types.is_numeric_dtype(series) and series.dropna().shape[0] > 3:
            mean = series.mean()
            std = series.std()
            if std > 0:
                outlier_count = int(((series - mean).abs() > 3 * std).sum())
                if outlier_count > 0:
                    errors.append(f"Outliers detected in {outlier_count} row(s) (>3σ)")
                    error_count += outlier_count

        total_errors += error_count
        columns_data.append({
            "name": col,
            "dtype": str(series.dtype),
            "null_count": null_count,
            "null_percentage": null_pct,
            "error_count": error_count,
            "errors": errors,
        })

    return {
        "columns": columns_data,
        "total_nulls": total_nulls,
        "total_errors": total_errors,
    }
