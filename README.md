# 🌿 AgroPredict — Botanical Garden Edition

A full-stack crop price prediction app redesigned with a **Botanical Garden** theme, featuring Playfair Display typography, 3D scroll animations, and a Fern/Marigold/Terracotta color palette.

## 🚀 Quick Start

### 1. Backend Setup (Python / Flask)
```bash
cd backend
pip install -r requirements.txt

# Train the ML model (only needed once)
python model/train.py

# Start the Flask server
python app.py
```
Backend runs at: http://localhost:5000

### 2. Frontend Setup (React / Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

### 3. Environment Variables
Copy `.env.example` to `.env` in the root and fill in your values:
```
DATABASE_URL=your_postgres_url   # or leave empty for SQLite fallback
JWT_SECRET_KEY=your_secret_key
ALLOW_SQLITE_FALLBACK=1
```

## 🗂 Project Structure
```
crop-price-predictor/
├── backend/
│   ├── app.py              # Flask API (auth, predict, history)
│   ├── market_data.py      # CSV loader & normalizer
│   ├── model/
│   │   ├── train.py        # RandomForest training script
│   │   └── *.pkl           # Trained model files
│   ├── data/
│   │   └── crop_data.csv   # Mandi market dataset
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/
        │   ├── LandingPage.jsx   # 3D scroll hero + features
        │   ├── Login.jsx         # Auth with JWT
        │   ├── Register.jsx
        │   ├── Dashboard.jsx     # Live market data
        │   ├── Predictions.jsx   # AI forecast engine
        │   ├── HistoryPage.jsx   # Mandi records + saved forecasts
        │   └── ProfilePage.jsx
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── Navbar.jsx
        │   ├── StatCard.jsx
        │   ├── PriceChart.jsx     # Recharts area chart
        │   ├── MarketBarChart.jsx
        │   ├── InsightsPanel.jsx  # AI insights
        │   └── PredictionHistory.jsx
        └── context/
            └── AuthContext.jsx    # JWT auth state
```

## 🎨 Design System
- **Primary:** Fern Green `#4a7c59`
- **Accent:** Marigold `#f9a620`
- **Warm:** Terracotta `#b7472a`
- **Background:** Cream `#f5f3ed`
- **Headings:** Playfair Display (serif)
- **Body:** DM Sans

## 📡 API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /register | — | Register user |
| POST | /login | — | Login, get JWT |
| GET | /user | ✓ | Get current user |
| GET | /options | — | Get crops & markets |
| POST | /predict | ✓ | Run AI prediction |
| GET | /history | — | Market price history |
| GET | /prediction-history | ✓ | Saved user forecasts |
| GET | /weather | — | Simulated weather |
| GET | /health | — | Backend health check |
