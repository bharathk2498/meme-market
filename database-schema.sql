-- MEME MARKET DATABASE SCHEMA
-- Reddit-Only Version
-- Run this in Supabase SQL Editor

-- Posts collected from Reddit
CREATE TABLE reddit_posts (
  id BIGSERIAL PRIMARY KEY,
  reddit_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  subreddit TEXT NOT NULL,
  author TEXT,
  created_utc TIMESTAMP NOT NULL,
  upvotes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  awards INTEGER DEFAULT 0,
  cross_posts INTEGER DEFAULT 0,
  permalink TEXT,
  is_video BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  collected_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Virality predictions
CREATE TABLE virality_predictions (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES reddit_posts(id),
  reddit_id TEXT NOT NULL,
  prediction_score INTEGER NOT NULL CHECK (prediction_score >= 0 AND prediction_score <= 100),
  upvote_velocity DECIMAL,
  comment_velocity DECIMAL,
  early_momentum_score INTEGER,
  ai_reasoning TEXT,
  predicted_at TIMESTAMP DEFAULT NOW(),
  will_go_viral BOOLEAN,
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high', 'very_high'))
);

-- Track actual performance vs predictions
CREATE TABLE prediction_accuracy (
  id BIGSERIAL PRIMARY KEY,
  prediction_id BIGINT REFERENCES virality_predictions(id),
  reddit_id TEXT NOT NULL,
  predicted_score INTEGER,
  actual_upvotes_24h INTEGER,
  actual_comments_24h INTEGER,
  was_accurate BOOLEAN,
  checked_at TIMESTAMP DEFAULT NOW()
);

-- User signups and subscriptions
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'agency')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Email alerts sent to users
CREATE TABLE email_alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  prediction_id BIGINT REFERENCES virality_predictions(id),
  sent_at TIMESTAMP DEFAULT NOW(),
  email_type TEXT
);

-- Indexes for performance
CREATE INDEX idx_reddit_posts_subreddit ON reddit_posts(subreddit);
CREATE INDEX idx_reddit_posts_created ON reddit_posts(created_utc DESC);
CREATE INDEX idx_reddit_posts_upvotes ON reddit_posts(upvotes DESC);
CREATE INDEX idx_predictions_score ON virality_predictions(prediction_score DESC);
CREATE INDEX idx_predictions_created ON virality_predictions(predicted_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- View: Top predictions in last 24 hours
CREATE VIEW top_predictions_24h AS
SELECT 
  p.reddit_id,
  p.title,
  p.subreddit,
  p.url,
  p.permalink,
  p.upvotes,
  p.comments,
  v.prediction_score,
  v.ai_reasoning,
  v.confidence_level,
  v.predicted_at
FROM reddit_posts p
JOIN virality_predictions v ON p.reddit_id = v.reddit_id
WHERE v.predicted_at > NOW() - INTERVAL '24 hours'
ORDER BY v.prediction_score DESC
LIMIT 20;

-- View: Overall prediction accuracy
CREATE VIEW accuracy_stats AS
SELECT 
  COUNT(*) as total_predictions,
  SUM(CASE WHEN was_accurate THEN 1 ELSE 0 END) as accurate_predictions,
  ROUND(100.0 * SUM(CASE WHEN was_accurate THEN 1 ELSE 0 END) / COUNT(*), 2) as accuracy_percentage,
  AVG(actual_upvotes_24h) as avg_actual_upvotes
FROM prediction_accuracy;

-- Function: Calculate upvote velocity
CREATE OR REPLACE FUNCTION calculate_upvote_velocity(post_upvotes INTEGER, hours_since_post DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  IF hours_since_post = 0 THEN
    RETURN post_upvotes;
  END IF;
  RETURN post_upvotes / hours_since_post;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (optional, for production)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Sample data for testing (optional)
INSERT INTO reddit_posts (reddit_id, title, url, subreddit, author, created_utc, upvotes, comments, permalink)
VALUES 
  ('test1', 'Test Meme 1', 'https://reddit.com/test1', 'memes', 'testuser', NOW(), 100, 10, '/r/memes/test1'),
  ('test2', 'Test Meme 2', 'https://reddit.com/test2', 'dankmemes', 'testuser2', NOW(), 500, 50, '/r/dankmemes/test2');

COMMIT;