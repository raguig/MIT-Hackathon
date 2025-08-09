from dotenv import load_dotenv
import os
from PyPDF2 import PdfReader
from io import BytesIO
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS  # Updated import
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.docstore.document import Document
from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from ISC import compute_enhanced_sentiment

app = Flask(__name__)
CORS(app)

# Global variables to store the QA chain and knowledge base
qa_chain = None
knowledge_base = None

# Add default financial context
DEFAULT_FINANCIAL_CONTEXT = """
You are an expert financial analyst with deep knowledge of:
- Financial markets and trading
- Company valuation and financial analysis
- Investment strategies and portfolio management
- Risk assessment and management
- Economic indicators and market trends
- Corporate finance and accounting principles

Provide detailed, professional analysis while maintaining accuracy. When uncertain, acknowledge limitations and suggest additional data needed. Always consider risk factors and market context in your answers.

If specific documents are provided, analyze them in detail while incorporating your general financial expertise.
"""

def initialize_models():
    load_dotenv()
    return (
        GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
        ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            convert_system_message_to_human=True,
            temperature=0.7,
            top_p=0.95,
            top_k=40,
        )
    )

def process_text(text):
    try:
        embeddings, llm = initialize_models()
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_text(text)
        
        global knowledge_base, qa_chain
        
        # Add print statements for debugging
        print(f"Number of chunks: {len(chunks)}")
        print(f"First chunk sample: {chunks[0][:100]}...")
        
        documents = [Document(page_content=chunk) for chunk in chunks]
        knowledge_base = FAISS.from_documents(documents, embeddings)
        
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"  # Add this line
        )
        
        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=knowledge_base.as_retriever(),
            memory=memory,
            return_source_documents=True,
            verbose=True  # Add this for debugging
        )
        
    except Exception as e:
        print(f"Error in process_text: {str(e)}")
        raise

@app.route('/api/process-document', methods=['POST'])
def process_document():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({"status": "error", "message": "No text provided"}), 400
        
        process_text(text)
        return jsonify({"status": "success", "message": "Document processed successfully"})
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/process-pdf', methods=['POST'])
def process_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({"status": "error", "message": "No file provided"}), 400
        
        pdf_file = request.files['file']
        if pdf_file.filename == '':
            return jsonify({"status": "error", "message": "No file selected"}), 400
        
        # Read PDF content
        pdf_content = BytesIO(pdf_file.read())
        pdf_reader = PdfReader(pdf_content)
        
        # Extract text from PDF
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        # Process the extracted text
        process_text(text)
        
        return jsonify({
            "status": "success",
            "message": "PDF processed successfully",
            "text": text
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/ask', methods=['POST'])
def ask_question():
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({
                "status": "error", 
                "message": "No question provided"
            }), 400
        
        if not qa_chain:
            # If no documents are loaded, use direct LLM with financial context
            _, llm = initialize_models()
            response = llm.invoke(
                f"{DEFAULT_FINANCIAL_CONTEXT}\n\nQuestion: {question}\n\nAnswer:"
            )
            return jsonify({
                "status": "success",
                "answer": response.content,
                "sources": []
            })
        
        # If documents are loaded, use the QA chain
        result = qa_chain.invoke({
            "question": question,
            "context": DEFAULT_FINANCIAL_CONTEXT
        })
        
        answer = result["answer"]
        sources = []
        if "source_documents" in result:
            for doc in result["source_documents"]:
                sources.append({
                    "content": doc.page_content[:200] + "...",
                    "metadata": doc.metadata
                })
        
        return jsonify({
            "status": "success",
            "answer": answer,
            "sources": sources
        })
    
    except Exception as e:
        print(f"Error in ask_question: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/price-series', methods=['POST'])
def price_series():
    try:
        data = request.get_json()
        symbol = data.get('symbol', 'IBM')
        days = int(data.get('days', 120))
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=f"{days}d")
        if hist.empty:
            return jsonify({"status": "error", "message": "No data found"}), 404
        hist = hist.reset_index()
        hist['date'] = pd.to_datetime(hist['Date']).dt.strftime('%Y-%m-%d')
        hist['ma20'] = hist['Close'].rolling(window=20).mean()
        last_close = hist['Close'].iloc[-1]
        last_ma20 = hist['ma20'].iloc[-1]
        if pd.isna(last_ma20):
            recommendation = "HOLD"
        elif last_close > last_ma20:
            recommendation = "BUY"
        elif last_close < last_ma20:
            recommendation = "SELL"
        else:
            recommendation = "HOLD"
        # --- Use real sentiment ---
        hist = fetch_and_merge_sentiment(symbol, hist)
        # Prepare data for frontend
        chart_data = [
            {
                "date": row['date'],
                "close": row['Close'],
                "ma20": row['ma20'] if not pd.isna(row['ma20']) else None,
                "sentiment": row['sentiment']
            }
            for _, row in hist.iterrows()
        ]
        return jsonify({
            "status": "success",
            "series": chart_data,
            "lastClose": float(last_close),
            "recommendation": recommendation
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def fetch_and_merge_sentiment(symbol, hist):
    # Simulate news for each date (replace with real news if available)
    sentiment_rows = []
    for i, date in enumerate(hist['Date']):
        if i % 2 == 0:
            text = "profit growth strong beat record"
        else:
            text = "loss decline risk drop weak"
        sentiment_rows.append({
            "date": date,
            "ticker": symbol,
            "text": text
        })
    sentiment_df = pd.DataFrame(sentiment_rows)
    daily_sent = compute_enhanced_sentiment(sentiment_df)
    # Merge with price data
    hist = hist.copy()
    hist['date_only'] = pd.to_datetime(hist['Date']).dt.date
    daily_sent['date_only'] = pd.to_datetime(daily_sent['date']).dt.date
    hist = pd.merge(hist, daily_sent[['date_only', 'sentiment']], on='date_only', how='left')
    hist['sentiment'] = hist['sentiment'].fillna(0.0)
    return hist

@app.route('/api/sentiment', methods=['POST'])
def get_sentiment():
    try:
        data = request.get_json()
        symbol = data.get('symbol', 'IBM')
        days = int(data.get('days', 7))
        # Fetch recent price data for dates
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=f"{days}d")
        if hist.empty:
            return jsonify({"status": "error", "message": "No data found"}), 404
        hist = hist.reset_index()
        # Simulate news for each date (replace with real news if available)
        sentiment_rows = []
        for i, date in enumerate(hist['Date']):
            if i % 2 == 0:
                text = "profit growth strong beat record"
            else:
                text = "loss decline risk drop weak"
            sentiment_rows.append({
                "date": date,
                "ticker": symbol,
                "text": text
            })
        sentiment_df = pd.DataFrame(sentiment_rows)
        daily_sent = compute_enhanced_sentiment(sentiment_df)
        # Aggregate sentiment
        avg_sentiment = daily_sent['sentiment'].mean()
        latest_sentiment = daily_sent['sentiment'].iloc[-1]
        return jsonify({
            "status": "success",
            "symbol": symbol,
            "average_sentiment": avg_sentiment,
            "latest_sentiment": latest_sentiment,
            "details": daily_sent.to_dict(orient="records")
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
