# data-quality-dashboard
# Data Quality Dashboard

A full-stack web application for analyzing and visualizing data quality metrics from uploaded CSV, Excel, or JSON files.

---

## Screenshots

> **Upload Screen** — drag-and-drop or browse to upload your data file (CSV, XLSX, XLS, JSON; max 50 MB).

```
┌──────────────────────────────────────────────┐
│  📁 Upload Data File                         │
│  ─────────────────────────────────────────   │
│  [ Choose File ]   mydata.csv                │
│                                              │
│            [ Upload & Analyze ]              │
│                                              │
│  ✅ Successfully uploaded mydata.csv         │
└──────────────────────────────────────────────┘
```

> **Data Quality Metrics** — summary cards shown after a successful upload.

```
┌────────────────┐  ┌────────────────┐  ┌────────────────────┐
│  📊 Total Rows │  │ 🔢 Total Cols  │  │  ⚠️ Duplicate Rows │
│    12,450      │  │      8         │  │    320 (2.57%)     │
│                │  │ id, name, ...  │  │                    │
└────────────────┘  └────────────────┘  └────────────────────┘
```

> **Charts** — per-column null counts and data-type breakdown rendered with Recharts.

> **Issues Table** — column-level detail showing null count, null %, data type, and sample error values.

---

## Features

- Upload CSV, Excel (`.xlsx` / `.xls`), or JSON files (up to 50 MB)
- Instant summary: row count, column count, duplicate rows & percentage
- Bar/pie charts of null values per column and data-type distribution
- Detailed issues table with per-column null rates and error samples
- FastAPI backend with automatic CORS for the React dev server
- API health indicator in the UI

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Recharts                |
| Backend  | Python 3, FastAPI, Uvicorn        |
| Data     | pandas, NumPy                     |

---

## Prerequisites

- **Node.js** ≥ 16 and **npm** ≥ 8
- **Python** ≥ 3.9

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd data-quality-dashboard
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Create a Python virtual environment and install backend dependencies

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
```

---

## Running the Application

Both the backend API and the React dev server must run simultaneously in separate terminals.

### Terminal 1 — Start the FastAPI backend

```bash
# From the project root (with the virtual environment activated)
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive API docs: `http://localhost:8000/docs`

### Terminal 2 — Start the React frontend

```bash
npm start
```

The app will open automatically at `http://localhost:3000`.

---

## Usage

1. Open `http://localhost:3000` in your browser.
2. Confirm the **API status** indicator shows **online** (top of page).
3. Click **Choose File** and select a `.csv`, `.xlsx`, `.xls`, or `.json` file.
4. Click **Upload & Analyze**.
5. View the generated metrics, charts, and issues table.

---

## API Endpoints

| Method | Endpoint                     | Description                              |
|--------|------------------------------|------------------------------------------|
| GET    | `/health`                    | Health check — returns `{"status":"healthy"}` |
| POST   | `/upload`                    | Upload a data file                       |
| GET    | `/data-quality/{filename}`   | Row/column counts, duplicate stats       |
| GET    | `/issues/{filename}`         | Per-column null counts, types & errors   |

---

## Project Structure

```
data-quality-dashboard/
├── app/
│   └── main.py          # FastAPI application & endpoints
├── src/
│   ├── App.js           # Root React component
│   ├── config.js        # App configuration
│   ├── components/
│   │   ├── Upload.js    # File upload component
│   │   ├── Dashboard.js # Metrics summary cards
│   │   ├── Charts.js    # Recharts visualizations
│   │   └── IssuesTable.js # Per-column issues table
│   ├── services/
│   │   └── api.js       # Axios/fetch API calls
│   └── styles/
│       └── main.css     # Global styles
├── requirements.txt     # Python dependencies
├── package.json         # Node.js dependencies
└── README.md
```

---

## Author

**KaliKeerthanaperi** — kakeerthanap@gmail.com
