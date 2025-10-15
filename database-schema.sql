-- MEME MARKET DATABASE SCHEMA
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: reddit_posts
-- Stores all collected Reddit posts
CREATE TABLE reddit_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subreddit TEXT NOT NULL,
    author TEXT,
    url TEXT,
    permalink TEXT,
    created_utc TIMESTAMP NOT NULL,
    collected_at TIMESTAMP DEFAULT NOW(),
    
    -- Engagement metrics
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    upvote_ratio DECIMAL(3,2),
    num_comments INTEGER DEFAULT 0,
    num_crossposts INTEGER DEFAULT 0,
    num_awards INTEGER DEFAULT 0,
    
    -- Content
    selftext TEXT,
    post_type TEXT, -- link, text, image, video
    domain TEXT,
    
    -- Metadata
    is_video BOOLEAN DEFAULT FALSE,
    is_original_content BOOLEAN DEFAULT FALSE,
    over_18 BOOLEAN DEFAULT FALSE,
    spoiler BOOLEAN DEFAULT FALSE,
    stickied BOOLEAN DEFAULT FALSE,
    
    -- Indexes
    CONSTRAINT valid_upvote_ratio CHECK (upvote_ratio >= 0 AND upvote_ratio <= 1)
);

-- Table: virality_predictions
-- Stores AI predictions for posts
CREATE TABLE virality_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id TEXT REFERENCES reddit_posts(post_id),
    predicted_at TIMESTAMP DEFAULT NOW(),
    
    -- Prediction scores
    virality_score INTEGER NOT NULL, -- 0-100
    confidence_level TEXT, -- low, medium, high
    
    -- Metrics at prediction time
    upvotes_at_prediction INTEGER,
    comments_at_prediction INTEGER,
    hours_since_posted DECIMAL(5,2),
    upvote_velocity DECIMAL(10,2), -- upvotes per hour
    comment_velocity DECIMAL(10,2), -- comments per hour
    
    -- AI reasoning
    ai_reasoning TEXT,
    prediction_factors JSONB, -- stores detailed analysis
    
    -- Validation (checked after 24 hours)
    actual_upvotes INTEGER,
    actual_comments INTEGER,
    prediction_accurate BOOLEAN,
    accuracy_percentage DECIMAL(5,2),
    validated_at TIMESTAMP,
    
    CONSTRAINT valid_virality_score CHECK (virality_score >= 0 AND virality_score <= 100)
);

-- Table: trending_topics
-- Tracks emerging topics and keywords
CREATE TABLE trending_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT NOT NULL,
    detected_at TIMESTAMP DEFAULT NOW(),
    mention_count INTEGER DEFAULT 1,
    subreddits TEXT[], -- array of subreddits mentioning this
    trending_score INTEGER, -- calculated trending intensity
    status TEXT DEFAULT 'emerging', -- emerging, trending, peaked, declining
    
    UNIQUE(topic, DATE(detected_at))
);

-- Table: user_subscriptions
-- Tracks user accounts and subscription levels
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    subscription_tier TEXT NOT NULL, -- free, pro, agency
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Subscription details
    subscribed_at TIMESTAMP DEFAULT NOW(),
    subscription_ends_at TIMESTAMP,
    status TEXT DEFAULT 'active', -- active, cancelled, expired
    
    -- Usage tracking
    daily_predictions_viewed INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP,
    
    -- Preferences
    email_alerts BOOLEAN DEFAULT TRUE,
    alert_threshold INTEGER DEFAULT 80, -- only alert for scores above this
    preferred_subreddits TEXT[],
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: prediction_performance
-- Tracks overall prediction accuracy metrics
CREATE TABLE prediction_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    
    -- Daily stats
    total_predictions INTEGER DEFAULT 0,
    accurate_predictions INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5,2),
    
    -- Score ranges
    high_confidence_accurate INTEGER DEFAULT 0, -- 80-100 score predictions
    high_confidence_total INTEGER DEFAULT 0,
    medium_confidence_accurate INTEGER DEFAULT 0, -- 50-79
    medium_confidence_total INTEGER DEFAULT 0,
    low_confidence_accurate INTEGER DEFAULT 0, -- 0-49
    low_confidence_total INTEGER DEFAULT 0,
    
    -- Best predictions
    best_prediction_id UUID REFERENCES virality_predictions(id),
    worst_prediction_id UUID REFERENCES virality_predictions(id),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_reddit_posts_subreddit ON reddit_posts(subreddit);
CREATE INDEX idx_reddit_posts_created ON reddit_posts(created_utc DESC);
CREATE INDEX idx_reddit_posts_upvotes ON reddit_posts(upvotes DESC);
CREATE INDEX idx_predictions_score ON virality_predictions(virality_score DESC);
CREATE INDEX idx_predictions_created ON virality_predictions(predicted_at DESC);
CREATE INDEX idx_predictions_post ON virality_predictions(post_id);
CREATE INDEX idx_trending_topics_score ON trending_topics(trending_score DESC);
CREATE INDEX idx_user_email ON user_subscriptions(email);

-- Create views for easy querying
CREATE VIEW top_predictions_today AS
SELECT 
    vp.virality_score,
    vp.predicted_at,
    vp.ai_reasoning,
    rp.title,
    rp.subreddit,
    rp.url,
    rp.upvotes,
    rp.num_comments,
    vp.upvote_velocity
FROM virality_predictions vp
JOIN reddit_posts rp ON vp.post_id = rp.post_id
WHERE DATE(vp.predicted_at) = CURRENT_DATE
ORDER BY vp.virality_score DESC
LIMIT 20;

CREATE VIEW prediction_accuracy_overview AS
SELECT 
    DATE(predicted_at) as date,
    COUNT(*) as total_predictions,
    COUNT(*) FILTER (WHERE prediction_accurate = TRUE) as accurate_count,
    ROUND(
        COUNT(*) FILTER (WHERE prediction_accurate = TRUE)::DECIMAL / 
        COUNT(*)::DECIMAL * 100, 
        2
    ) as accuracy_percentage,
    AVG(virality_score) as avg_prediction_score
FROM virality_predictions
WHERE validated_at IS NOT NULL
GROUP BY DATE(predicted_at)
ORDER BY date DESC;

-- Function to calculate upvote velocity
CREATE OR REPLACE FUNCTION calculate_upvote_velocity(
    p_upvotes INTEGER,
    p_created_utc TIMESTAMP
) RETURNS DECIMAL AS $$
DECLARE
    hours_elapsed DECIMAL;
BEGIN
    hours_elapsed := EXTRACT(EPOCH FROM (NOW() - p_created_utc)) / 3600;
    IF hours_elapsed < 0.1 THEN
        hours_elapsed := 0.1; -- Prevent division by zero
    END IF;
    RETURN p_upvotes / hours_elapsed;
END;
$$ LANGUAGE plpgsql;

-- Function to validate predictions after 24 hours
CREATE OR REPLACE FUNCTION validate_predictions() RETURNS void AS $$
BEGIN
    UPDATE virality_predictions vp
    SET 
        actual_upvotes = rp.upvotes,
        actual_comments = rp.num_comments,
        prediction_accurate = CASE
            WHEN vp.virality_score >= 80 AND rp.upvotes >= 10000 THEN TRUE
            WHEN vp.virality_score >= 60 AND rp.upvotes >= 5000 THEN TRUE
            WHEN vp.virality_score >= 40 AND rp.upvotes >= 1000 THEN TRUE
            WHEN vp.virality_score < 40 AND rp.upvotes < 1000 THEN TRUE
            ELSE FALSE
        END,
        accuracy_percentage = CASE
            WHEN rp.upvotes > 0 THEN
                ROUND(
                    (1 - ABS(vp.virality_score - LEAST(rp.upvotes::DECIMAL / 100, 100)) / 100) * 100,
                    2
                )
            ELSE 0
        END,
        validated_at = NOW()
    FROM reddit_posts rp
    WHERE vp.post_id = rp.post_id
    AND vp.validated_at IS NULL
    AND vp.predicted_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own subscription data
CREATE POLICY user_subscription_policy ON user_subscriptions
    FOR ALL
    USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Insert initial test data (optional - remove in production)
INSERT INTO reddit_posts (post_id, title, subreddit, author, url, created_utc, upvotes, num_comments)
VALUES 
    ('test_1', 'Test Post 1', 'memes', 'test_user', 'https://reddit.com/test1', NOW(), 100, 10),
    ('test_2', 'Test Post 2', 'dankmemes', 'test_user', 'https://reddit.com/test2', NOW(), 250, 25);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables created: reddit_posts, virality_predictions, trending_topics, user_subscriptions, prediction_performance';
    RAISE NOTICE 'Views created: top_predictions_today, prediction_accuracy_overview';
    RAISE NOTICE 'Functions created: calculate_upvote_velocity, validate_predictions';
END $$;
