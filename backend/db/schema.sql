CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id),
  symbol TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  avg_buy_price NUMERIC NOT NULL,
  asset_type TEXT CHECK (asset_type IN ('equity', 'etf', 'mf'))
);

CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  confidence_score NUMERIC CHECK (confidence_score BETWEEN 0 AND 1),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  reasoning_summary TEXT,
  historical_accuracy NUMERIC,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  filing_type TEXT,
  raw_text TEXT,
  sentiment_score NUMERIC,
  embedding VECTOR(384),
  filed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE technical_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  pattern_name TEXT NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  confidence NUMERIC,
  plain_english_summary TEXT,
  backtest_success_rate NUMERIC,
  timeframe TEXT
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  signal_id UUID REFERENCES signals(id),
  is_read BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT,
  source_id UUID,
  embedding VECTOR(384),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX embeddings_source_unique_idx ON embeddings (source_type, source_id);

CREATE INDEX embeddings_embedding_cos_idx
  ON embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX filings_embedding_cos_idx
  ON filings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX signals_symbol_created_at_idx ON signals (symbol, created_at DESC);
CREATE INDEX technical_patterns_symbol_detected_at_idx ON technical_patterns (symbol, detected_at DESC);
