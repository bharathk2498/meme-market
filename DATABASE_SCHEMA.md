# MEME MARKET - DATABASE SCHEMA

Last Updated: October 13, 2025

## OVERVIEW

Database structure for Meme Market trend prediction platform. Execute in Supabase SQL Editor in the order shown.

---

## USERS TABLE

Extended user profile with subscription information.

```sql
-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'agency')),
    subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    daily_predictions_viewed INTEGER DEFAULT 0,
    last_prediction_view_date DATE,
    total_predictions_viewed INTEGER DEFAULT 0,
    email_notifications BOOLEAN DEFAULT TRUE,
    alert_threshold INTEGER DEFAULT 75
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## TRENDS TABLE

Stores discovered trends from social media platforms.

```sql
-- Create trends table
CREATE TABLE IF NOT EXISTS public.trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Content
    title TEXT NOT NULL,
    description TEXT,
    keywords TEXT[],
    content_type TEXT, -- meme, challenge, news, product, other
    
    -- Source data
    platform TEXT NOT NULL CHECK (platform IN ('twitter', 'reddit', 'tiktok', 'instagram', 'multi')),
    source_url TEXT,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Engagement metrics
    engagement_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    engagement_velocity NUMERIC(10,2), -- engagement per hour
    
    -- Cross-platform presence
    found_on_twitter BOOLEAN DEFAULT FALSE,
    found_on_reddit BOOLEAN DEFAULT FALSE,
    found_on_tiktok BOOLEAN DEFAULT FALSE,
    found_on_instagram BOOLEAN DEFAULT FALSE,
    cross_platform_count INTEGER DEFAULT 1,
    
    -- Virality metrics
    virality_score NUMERIC(5,2), -- 0-100 score
    prediction_confidence NUMERIC(5,2), -- 0-100 confidence
    predicted_peak_date TIMESTAMP WITH TIME ZONE,
    
    -- Prediction tracking
    was_correct BOOLEAN,
    actual_virality_score NUMERIC(5,2),
    checked_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status TEXT DEFAULT 'monitoring' CHECK (status IN ('monitoring', 'trending', 'peaked', 'declined', 'failed')),
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trends_virality_score ON public.trends(virality_score DESC);
CREATE INDEX idx_trends_platform ON public.trends(platform);
CREATE INDEX idx_trends_status ON public.trends(status);
CREATE INDEX idx_trends_created_at ON public.trends(created_at DESC);
CREATE INDEX idx_trends_featured ON public.trends(is_featured) WHERE is_featured = TRUE;

-- Enable RLS (public read for featured trends)
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view featured trends"
    ON public.trends FOR SELECT
    USING (is_featured = TRUE);

CREATE POLICY "Authenticated users can view all trends"
    ON public.trends FOR SELECT
    TO authenticated
    USING (TRUE);
```

---

## PREDICTIONS TABLE

Stores AI-generated predictions and reasoning.

```sql
-- Create predictions table
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trend_id UUID REFERENCES public.trends(id) ON DELETE CASCADE NOT NULL,
    
    -- Prediction details
    predicted_score NUMERIC(5,2) NOT NULL,
    confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high', 'very_high')),
    reasoning TEXT,
    key_factors TEXT[],
    
    -- AI metadata
    ai_model_used TEXT DEFAULT 'perplexity',
    tokens_used INTEGER,
    processing_time_seconds NUMERIC(6,2),
    
    -- Outcome tracking
    outcome TEXT CHECK (outcome IN ('pending', 'correct', 'incorrect', 'partially_correct')),
    actual_outcome_score NUMERIC(5,2),
    outcome_checked_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_predictions_trend_id ON public.predictions(trend_id);
CREATE INDEX idx_predictions_outcome ON public.predictions(outcome);
CREATE INDEX idx_predictions_created_at ON public.predictions(created_at DESC);

-- Enable RLS
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view predictions"
    ON public.predictions FOR SELECT
    TO authenticated
    USING (TRUE);
```

---

## ALERTS TABLE

User-specific alerts for high-scoring trends.

```sql
-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    trend_id UUID REFERENCES public.trends(id) ON DELETE CASCADE NOT NULL,
    
    -- Alert details
    alert_type TEXT CHECK (alert_type IN ('high_score', 'cross_platform', 'custom_keyword')),
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Delivery
    delivered_via_email BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    viewed_by_user BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Alert content
    alert_title TEXT NOT NULL,
    alert_message TEXT NOT NULL,
    virality_score_at_alert NUMERIC(5,2)
);

-- Indexes
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_viewed ON public.alerts(viewed_by_user);
CREATE INDEX idx_alerts_triggered_at ON public.alerts(triggered_at DESC);

-- Enable RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
    ON public.alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
    ON public.alerts FOR UPDATE
    USING (auth.uid() = user_id);
```

---

## SUBSCRIPTION EVENTS TABLE

Track subscription changes for analytics.

```sql
-- Create subscription events table
CREATE TABLE IF NOT EXISTS public.subscription_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Event details
    event_type TEXT NOT NULL,
    old_tier TEXT,
    new_tier TEXT,
    old_status TEXT,
    new_status TEXT,
    
    -- Stripe data
    stripe_event_id TEXT UNIQUE,
    stripe_event_data JSONB,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscription_events_user_id ON public.subscription_events(user_id);
CREATE INDEX idx_subscription_events_created_at ON public.subscription_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription events"
    ON public.subscription_events FOR SELECT
    USING (auth.uid() = user_id);
```

---

## ACCURACY TRACKING TABLE

Track prediction accuracy over time.

```sql
-- Create accuracy tracking table
CREATE TABLE IF NOT EXISTS public.accuracy_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Time period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Metrics
    total_predictions INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    incorrect_predictions INTEGER DEFAULT 0,
    pending_predictions INTEGER DEFAULT 0,
    accuracy_percentage NUMERIC(5,2),
    
    -- By platform
    twitter_accuracy NUMERIC(5,2),
    reddit_accuracy NUMERIC(5,2),
    
    -- By confidence level
    high_confidence_accuracy NUMERIC(5,2),
    medium_confidence_accuracy NUMERIC(5,2),
    low_confidence_accuracy NUMERIC(5,2),
    
    -- Timestamps
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_accuracy_period ON public.accuracy_tracking(period_start DESC);

-- Enable RLS (public read)
ALTER TABLE public.accuracy_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view accuracy stats"
    ON public.accuracy_tracking FOR SELECT
    USING (TRUE);
```

---

## USAGE TRACKING TABLE

Monitor API usage and costs.

```sql
-- Create usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Usage details
    action_type TEXT NOT NULL, -- api_call, prediction_view, alert_sent
    resource_consumed TEXT, -- perplexity_query, email_sent, etc
    quantity INTEGER DEFAULT 1,
    cost_usd NUMERIC(10,4),
    
    -- Context
    trend_id UUID REFERENCES public.trends(id) ON DELETE SET NULL,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_usage_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_created_at ON public.usage_tracking(created_at DESC);

-- Enable RLS
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
    ON public.usage_tracking FOR SELECT
    USING (auth.uid() = user_id);
```

---

## HELPER FUNCTIONS

Useful database functions.

```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trends_updated_at BEFORE UPDATE ON public.trends
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reset daily prediction counter (run daily via cron)
CREATE OR REPLACE FUNCTION reset_daily_prediction_counters()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles 
    SET daily_predictions_viewed = 0
    WHERE last_prediction_view_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate accuracy
CREATE OR REPLACE FUNCTION calculate_accuracy_stats()
RETURNS void AS $$
DECLARE
    v_period_start DATE;
    v_period_end DATE;
    v_total INTEGER;
    v_correct INTEGER;
    v_accuracy NUMERIC;
BEGIN
    v_period_end := CURRENT_DATE;
    v_period_start := v_period_end - INTERVAL '7 days';
    
    SELECT COUNT(*), COUNT(*) FILTER (WHERE outcome = 'correct')
    INTO v_total, v_correct
    FROM public.predictions
    WHERE created_at >= v_period_start
    AND created_at < v_period_end
    AND outcome IN ('correct', 'incorrect');
    
    IF v_total > 0 THEN
        v_accuracy := (v_correct::NUMERIC / v_total::NUMERIC) * 100;
        
        INSERT INTO public.accuracy_tracking (
            period_start, period_end, total_predictions, 
            correct_predictions, accuracy_percentage
        ) VALUES (
            v_period_start, v_period_end, v_total,
            v_correct, v_accuracy
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## VIEWS FOR DASHBOARD

```sql
-- View for featured trends
CREATE OR REPLACE VIEW featured_trends AS
SELECT
    t.id,
    t.title,
    t.description,
    t.platform,
    t.virality_score,
    t.engagement_velocity,
    t.cross_platform_count,
    p.predicted_score,
    p.confidence_level,
    p.reasoning
FROM public.trends t
LEFT JOIN public.predictions p ON t.id = p.trend_id
WHERE t.is_featured = TRUE
ORDER BY t.virality_score DESC
LIMIT 10;

-- View for user statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT
    p.id,
    p.email,
    p.subscription_tier,
    p.total_predictions_viewed,
    COUNT(DISTINCT a.id) as total_alerts,
    COUNT(DISTINCT a.id) FILTER (WHERE a.viewed_by_user = TRUE) as viewed_alerts
FROM public.profiles p
LEFT JOIN public.alerts a ON p.id = a.user_id
GROUP BY p.id, p.email, p.subscription_tier, p.total_predictions_viewed;

-- View for recent accuracy
CREATE OR REPLACE VIEW recent_accuracy AS
SELECT
    period_start,
    period_end,
    accuracy_percentage,
    total_predictions,
    correct_predictions
FROM public.accuracy_tracking
ORDER BY period_start DESC
LIMIT 4;
```

---

## TESTING QUERIES

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = TRUE;

-- Insert test trend
INSERT INTO public.trends (
    title, platform, virality_score, is_featured
) VALUES (
    'Test Trend', 'twitter', 85.5, TRUE
);

-- Verify insert
SELECT * FROM public.trends WHERE title = 'Test Trend';

-- Clean up test data
DELETE FROM public.trends WHERE title = 'Test Trend';
```

---

## BACKUP AND MAINTENANCE

Supabase handles automatic backups. For manual operations:

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('postgres'));

-- Check table sizes
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Archive old trends (older than 90 days)
DELETE FROM public.trends
WHERE created_at < NOW() - INTERVAL '90 days'
AND status NOT IN ('monitoring', 'trending');
```

---

Schema complete. Ready for implementation.
