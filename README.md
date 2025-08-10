# Finvest AI Compass

A full-stack AI-powered financial dashboard and chatbot for market analysis, document Q&A, and sentiment analysis.

---

## Features

- **AI Chatbot:** Ask financial questions, analyze documents, and get expert answers.
- **Market Forecast Chart:** Visualize stock prices, moving averages, and sentiment.
- **Sentiment Analysis:** See AI-driven sentiment for any stock, based on news simulation.
- **Document Upload:** Analyze PDFs and text files for financial insights.
- **Trending & Events:** View latest financial trends and events.
- **Success Stories:** Explore real-world financial success stories.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/raguig/MIT-Hackathon.git
cd Backend
```

---

## Backend Setup (Flask API)

### 2. Create and Activate a Python Virtual Environment

```bash
python -m venv .venv
.venv\Scripts\activate   # On Windows
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the Flask Backend

```bash
python app.py
```

The backend will run at [http://localhost:5000](http://localhost:5000).

---

## Frontend Setup (React App)

### 5. Open a New Terminal and Navigate to the Frontend

```bash
cd C:\Users\HP\MIT-Hackathon\finvest-ai-compass-main
```

### 6. Install Node.js Dependencies

```bash
npm install
```

### 7. Start the React Development Server

```bash
npm run dev
```

The frontend will run at [http://localhost:3000](http://localhost:3000) or [http://localhost:8080](http://localhost:8080).

---

## Usage

- **Chatbot:** Ask questions or upload documents for analysis.
- **Forecast Chart:** Select or enter a stock symbol to view price, moving average, and sentiment.
- **Sentiment Demo:** Enter a symbol in the chatbot to see AI-calculated sentiment.
- **Trends & Events:** Explore latest financial trends and events.

---

## Notes

- The backend uses simulated news for sentiment analysis. For real news, integrate a news API and update the backend logic.
- Make sure both backend and frontend are running for full functionality.
- If you encounter CORS issues, ensure Flask-CORS is enabled in `app.py`.

---

