-- MEME MARKET DATABASE SCHEMA
-- Supabase PostgreSQL
-- Run this in Supabase SQL Editor

-- Table 1: Reddit Posts
CREATE TABLE reddit_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reddit_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subreddit TEXT NOT NULL,
    author TEXT,
    url TEXT NOT NULL,
    permalink TEXT NOT NULL,
    
    -- Engagement metrics
    upvotes INTEGER DEFAULT 0,
    upvote_ratio DECIMAL(3,2),
    num_comments INTEGER DEFAULT 0,
    num_awards INTEGER DEFAULT 0,
    num_crossposts INTEGER DEFAULT 0,
    
    -- Time tracking
    posted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Post metadata
    post_type TEXT, -- image, video, link, text
    is_nsfw BOOLEAN DEFAULT FALSE,
    is_video BOOLEAN DEFAULT FALSE,
    thumbnail_url TEXT,
    
    -- Author info
    author_karma INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: Virality Predictions
CREATE TABLE virality_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES reddit_posts(id) ON DELETE CASCADE,
    
    -- Prediction scores
    virality_score INTEGER CHECK (virality_score >= 0 AND virality_score <= 100),
    confidence_level TEXT, -- high, medium, low
    
    -- Metrics at prediction time
    upvotes_at_prediction INTEGER,
    comments_at_prediction INTEGER,
    hours_since_posted DECIMAL(10,2),
    
    -- Velocity calculations
    upvote_velocity DECIMAL(10,2), -- upvotes per hour
    comment_velocity DECIMAL(10,2), -- comments per hour
    
    -- AI analysis
    ai_reasoning TEXT,
    perplexity_response JSONB,
    
    -- Prediction metadata
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_version TEXT DEFAULT 'v1',
    
    -- Outcome tracking (filled in later)
    actual_peak_upvotes INTEGER,
    actual_peak_comments INTEGER,
    prediction_accurate BOOLEAN,
    checked_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 3: User Subscriptions
CREATE TABLE user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    plan TEXT NOT NULL, -- free, pro, agency
    
    -- Stripe info
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Status
    status TEXT DEFAULT 'active', -- active, cancelled, expired
    
    -- Dates
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    email_alerts BOOLEAN DEFAULT TRUE,
    alert_threshold INTEGER DEFAULT 80, -- only alert for scores above this
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 4: Daily Predictions (for free tier)
CREATE TABLE daily_top_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prediction_id UUID REFERENCES virality_predictions(id),
    date DATE NOT NULL,
    rank INTEGER NOT NULL, -- 1, 2, 3 for top 3
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(date, rank)
);

-- Indexes for performance
CREATE INDEX idx_reddit_posts_subreddit ON reddit_posts(subreddit);
CREATE INDEX idx_reddit_posts_posted_at ON reddit_posts(posted_at DESC);
CREATE INDEX idx_reddit_posts_collected_at ON reddit_posts(collected_at DESC);
CREATE INDEX idx_predictions_score ON virality_predictions(virality_score DESC);
CREATE INDEX idx_predictions_predicted_at ON virality_predictions(predicted_at DESC);
CREATE INDEX idx_predictions_post_id ON virality_predictions(post_id);
CREATE INDEX idx_daily_predictions_date ON daily_top_predictions(date DESC);

-- View: Latest High-Score Predictions
CREATE VIEW latest_high_predictions AS
SELECT 
    vp.id,
    vp.virality_score,
    vp.confidence_level,
    vp.ai_reasoning,
    vp.predicted_at,
    rp.title,
    rp.subreddit,
    rp.url,
    rp.permalink,
    rp.upvotes,
    rp.num_comments,
    rp.posted_at
FROM virality_predictions vp
JOIN reddit_posts rp ON vp.post_id = rp.id
WHERE vp.virality_score >= 70
ORDER BY vp.predicted_at DESC
LIMIT 50;

-- View: Today's Top 3 (for free tier)
CREATE VIEW todays_top_3 AS
SELECT 
    dtp.rank,
    vp.virality_score,
    vp.ai_reasoning,
    rp.title,
    rp.subreddit,
    rp.url,
    rp.permalink,
    rp.upvotes,
    rp.num_comments
FROM daily_top_predictions dtp
JOIN virality_predictions vp ON dtp.prediction_id = vp.id
JOIN reddit_posts rp ON vp.post_id = rp.id
WHERE dtp.date = CURRENT_DATE
ORDER BY dtp.rank;

-- Function: Calculate upvote velocity
CREATE OR REPLACE FUNCTION calculate_upvote_velocity(post_upvotes INTEGER, hours_old DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF hours_old <= 0 THEN
        RETURN 0;
    END IF;
    RETURN post_upvotes / hours_old;
END;
$$ LANGUAGE plpgsql;

-- Function: Update prediction accuracy
CREATE OR REPLACE FUNCTION update_prediction_accuracy()
RETURNS void AS $$
BEGIN
    UPDATE virality_predictions vp
    SET 
        actual_peak_upvotes = rp.upvotes,
        actual_peak_comments = rp.num_comments,
        prediction_accurate = CASE 
            WHEN vp.virality_score >= 70 AND rp.upvotes >= 10000 THEN TRUE
            WHEN vp.virality_score < 70 AND rp.upvotes < 10000 THEN TRUE
            ELSE FALSE
        END,
        checked_at = NOW()
    FROM reddit_posts rp
    WHERE vp.post_id = rp.id
    AND vp.checked_at IS NULL
    AND vp.predicted_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE reddit_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE virality_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_top_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read for predictions
CREATE POLICY "Public read access for reddit posts"
    ON reddit_posts FOR SELECT
    USING (true);

CREATE POLICY "Public read access for predictions"
    ON virality_predictions FOR SELECT
    USING (true);

CREATE POLICY "Public read access for daily top predictions"
    ON daily_top_predictions FOR SELECT
    USING (true);

-- Only service role can write
CREATE POLICY "Service role can insert reddit posts"
    ON reddit_posts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can insert predictions"
    ON virality_predictions FOR INSERT
    WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE reddit_posts IS 'Stores all collected Reddit posts for analysis';
COMMENT ON TABLE virality_predictions IS 'Stores AI predictions for each post virality potential';
COMMENT ON TABLE user_subscriptions IS 'Manages user subscription tiers and preferences';
COMMENT ON TABLE daily_top_predictions IS 'Caches top 3 daily predictions for free tier access';

COMMENT ON COLUMN virality_predictions.virality_score IS 'AI-predicted virality score from 0-100';
COMMENT ON COLUMN virality_predictions.upvote_velocity IS 'Upvotes per hour at time of prediction';
COMMENT ON COLUMN virality_predictions.prediction_accurate IS 'Whether prediction was correct (filled after 24hrs)';

-- Sample query: Get accuracy rate
-- SELECT 
--     COUNT(*) FILTER (WHERE prediction_accurate = TRUE) * 100.0 / COUNT(*) as accuracy_percentage
-- FROM virality_predictions
-- WHERE checked_at IS NOT NULL;
