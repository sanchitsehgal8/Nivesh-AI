# Nivesh AI

AI investment intelligence platform for Indian retail investors with trading signals, pattern detection, portfolio analysis, and auto-generated market videos.

## Setup

Install Python 3.10+, Node 18+. Backend runs on port 8001, frontend on 5174.

Backend: `cd backend && pip install -r requirements.txt && python -m uvicorn main:app --reload`

Frontend: `cd frontend && npm install && npm run dev`

Open http://localhost:5174 after both start.

## Features

Opportunity Radar detects trading signals from corporate filings, bulk deals, and insider trades.

Chart Pattern Intelligence identifies technical patterns (MACD, RSI, Bollinger Bands, breakouts) across 1,500+ NSE stocks.

Portfolio Copilot analyzes portfolios using a 7-agent AI pipeline with source-cited recommendations.

Market Videos auto-generates 30-90 second market briefing scripts.

Live Signal Feed displays real trading signals from NSE/BSE on the dashboard.

Stock Explorer shows fundamental data, sentiment analysis, and technical patterns for any stock.

Chat Assistant answers investment questions with multi-agent AI reasoning.

## Architecture

React frontend proxies to FastAPI backend which runs a 7-agent LangGraph pipeline (Router → Retriever, Technical, Fundamental agents in parallel → Sentiment → Macro → Portfolio Risk → Synthesis) connected to NSE/BSE APIs, yfinance, and FinBERT, with data stored in Supabase and Redis.

## Agents

Router classifies queries, Retriever searches filings, Technical analyzes price momentum, Fundamental checks valuation, Sentiment analyzes market mood, Macro detects market regime, Portfolio Risk assesses concentration, Synthesis generates final recommendation with confidence and risk score.

## API Endpoints

GET /signals/latest returns trading signals. GET /patterns/{symbol} returns technical patterns with backtest success rates. GET /market/ohlcv/{symbol} returns candlestick data. POST /chat accepts portfolio analysis queries. POST /portfolio-analysis returns holdings and risk metrics. POST /video/generate creates market briefing scripts.

## Status

Backend 80% complete with working APIs and real data integration. Frontend 30% complete requiring API wiring. Production ready in 2-3 weeks with one developer.

## Tech Stack

React 18, Vite, TailwindCSS on frontend. FastAPI, LangGraph, TA-Lib, FinBERT on backend. Data from NSE API, BSE RSS, yfinance, Google Gemini. Storage on Supabase, Redis, Google Cloud.



