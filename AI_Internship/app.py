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

if __name__ == '__main__':
    app.run(port=5000, debug=True)
