-- COMPREHENSIVE STRATEGIC FRAMEWORK - UNIFIED DATABASE SCHEMA
-- Multi-Domain Portfolio Optimization with AI-Enhanced Web3 Integration
-- PostgreSQL Schema with Complete Cross-Domain Support

-- Create schemas for organized data structure
CREATE SCHEMA IF NOT EXISTS portfolio;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS web3;
CREATE SCHEMA IF NOT EXISTS ai_agents;
CREATE SCHEMA IF NOT EXISTS auth;

-- ===========================================
-- CORE USER MANAGEMENT & AUTHENTICATION
-- ===========================================

-- Extended auth.users table (Supabase auth integration)
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255),
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    invited_at TIMESTAMP WITH TIME ZONE,
    confirmation_token VARCHAR(255),
    recovery_token VARCHAR(255),
    email_change_token_new VARCHAR(255),
    aud VARCHAR(255),
    role VARCHAR(255),
    raw_app_meta_data JSONB DEFAULT '{}',
    raw_user_meta_data JSONB DEFAULT '{}',
    is_super_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    phone VARCHAR(20),
    phone_confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    app_metadata JSONB DEFAULT '{}',
    user_metadata JSONB DEFAULT '{}'
);

-- Core user profile with cross-domain tracking
CREATE TABLE portfolio.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    wallet_addresses JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMP WITH TIME ZONE,

    -- Cross-domain tracking
    primary_domain VARCHAR(100),
    domains_engaged TEXT[] DEFAULT '{}',
    total_spent DECIMAL(12,2) DEFAULT 0,
    loyalty_tier VARCHAR(20) DEFAULT 'bronze',
    ai_optimization_score INTEGER DEFAULT 0,
    cross_domain_score INTEGER DEFAULT 0,

    -- Web3 integration
    primary_wallet VARCHAR(100),
    total_tokens DECIMAL(18,8) DEFAULT 0,
    nft_owned_count INTEGER DEFAULT 0,
    staking_balance DECIMAL(18,8) DEFAULT 0,

    -- Geographic data
    country_code VARCHAR(5),
    timezone VARCHAR(50),
    preferred_language VARCHAR(5) DEFAULT 'en',

    -- Subscription data
    subscription_tier VARCHAR(20) DEFAULT 'free',
    subscription_started_at TIMESTAMP WITH TIME ZONE,
    subscription_renewal_at TIMESTAMP WITH TIME ZONE,
    subscription_cancelled_at TIMESTAMP WITH TIME ZONE
);

-- ===========================================
-- DOMAIN ACTIVITY TRACKING
-- ===========================================

-- Domain activity with partitioning for performance
CREATE TABLE portfolio.user_domain_activity (
    id BIGSERIAL,
    user_id UUID REFERENCES portfolio.users(id) ON DELETE CASCADE,
    domain VARCHAR(100) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_data JSONB,
    value_eur DECIMAL(12,2) DEFAULT 0,
    session_duration INTEGER, -- seconds
    ai_optimized BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Performance optimization
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Monthly partitions for optimal performance (next 12 months)
CREATE TABLE portfolio.user_activity_2025_12 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

CREATE TABLE portfolio.user_activity_2026_01 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE portfolio.user_activity_2026_02 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

CREATE TABLE portfolio.user_activity_2026_03 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

CREATE TABLE portfolio.user_activity_2026_04 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

CREATE TABLE portfolio.user_activity_2026_05 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

CREATE TABLE portfolio.user_activity_2026_06 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

CREATE TABLE portfolio.user_activity_2026_07 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

CREATE TABLE portfolio.user_activity_2026_08 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

CREATE TABLE portfolio.user_activity_2026_09 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');

CREATE TABLE portfolio.user_activity_2026_10 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

CREATE TABLE portfolio.user_activity_2026_11 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');

CREATE TABLE portfolio.user_activity_2026_12 PARTITION OF portfolio.user_domain_activity
FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

-- ===========================================
-- REVENUE TRACKING SYSTEM
-- ===========================================

CREATE TABLE portfolio.revenue_tracking (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES portfolio.users(id) ON DELETE CASCADE,
    domain VARCHAR(100) NOT NULL,
    revenue_type VARCHAR(50) NOT NULL, -- 'subscription', 'affiliate', 'nft', 'token', 'ecommerce'
    amount_eur DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'EUR',
    transaction_hash VARCHAR(100), -- for blockchain transactions
    stripe_payment_id VARCHAR(100), -- for Stripe payments
    paypal_transaction_id VARCHAR(100), -- for PayPal payments
    metadata JSONB,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue by domain summary
CREATE TABLE portfolio.domain_revenue_summary (
    id BIGSERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    transaction_count INTEGER DEFAULT 0,
    unique_customers INTEGER DEFAULT 0,
    avg_transaction_value DECIMAL(8,2) DEFAULT 0,
    growth_rate DECIMAL(5,2), -- percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(domain, period_start, period_end)
);

-- ===========================================
-- WEB3 INTEGRATION TABLES
-- ===========================================

CREATE TABLE web3.smart_contracts (
    id BIGSERIAL PRIMARY KEY,
    contract_name VARCHAR(100) NOT NULL,
    contract_address VARCHAR(100) NOT NULL UNIQUE,
    blockchain_network VARCHAR(50) NOT NULL, -- 'ethereum', 'polygon', 'solana', 'zkEVM'
    contract_type VARCHAR(50) NOT NULL, -- 'token', 'nft', 'governance', 'staking'
    domain_association VARCHAR(100),
    abi JSONB,
    bytecode TEXT,
    is_active BOOLEAN DEFAULT true,
    deployed_at TIMESTAMP WITH TIME ZONE,
    last_interaction TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token transactions tracking
CREATE TABLE web3.token_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES portfolio.users(id) ON DELETE CASCADE,
    contract_address VARCHAR(100) NOT NULL,
    transaction_hash VARCHAR(100) NOT NULL UNIQUE,
    transaction_type VARCHAR(50) NOT NULL, -- 'mint', 'transfer', 'burn', 'stake', 'unstake'
    amount DECIMAL(18,8) NOT NULL,
    token_symbol VARCHAR(20),
    from_address VARCHAR(100),
    to_address VARCHAR(100),
    gas_used BIGINT,
    gas_price DECIMAL(18,8),
    block_number BIGINT,
    block_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT ownership and transactions
CREATE TABLE web3.nft_ownership (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES portfolio.users(id) ON DELETE CASCADE,
    contract_address VARCHAR(100) NOT NULL,
    token_id VARCHAR(100) NOT NULL,
    token_uri TEXT,
    metadata JSONB,
    acquired_at TIMESTAMP WITH TIME ZONE,
    acquired_transaction VARCHAR(100),
    current_value DECIMAL(12,2),
    last_appraisal TIMESTAMP WITH TIME ZONE,
    is_listed BOOLEAN DEFAULT false,
    listing_price DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, contract_address, token_id)
);

-- ===========================================
-- AI AGENTS SYSTEM
-- ===========================================

CREATE TABLE ai_agents.agent_registry (
    id BIGSERIAL PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL UNIQUE,
    agent_type VARCHAR(50) NOT NULL, -- 'seo', 'content', 'customer_service', 'analytics'
    domain_focus VARCHAR(100),
    model_provider VARCHAR(50), -- 'openai', 'anthropic', 'google', 'local'
    model_name VARCHAR(100),
    capabilities JSONB,
    is_active BOOLEAN DEFAULT true,
    performance_score DECIMAL(3,2) DEFAULT 0,
    total_requests BIGINT DEFAULT 0,
    success_rate DECIMAL(5,4) DEFAULT 0,
    average_response_time DECIMAL(6,2), -- seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_agents.agent_executions (
    id BIGSERIAL PRIMARY KEY,
    agent_id BIGINT REFERENCES ai_agents.agent_registry(id) ON DELETE CASCADE,
    user_id UUID REFERENCES portfolio.users(id) ON DELETE SET NULL,
    task_type VARCHAR(50) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    tokens_used INTEGER,
    cost_usd DECIMAL(8,4),
    execution_time_ms INTEGER,
    success BOOLEAN,
    error_message TEXT,
    feedback_score INTEGER, -- 1-5 scale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI optimization tracking
CREATE TABLE ai_agents.user_optimizations (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES portfolio.users(id) ON DELETE CASCADE,
    agent_id BIGINT REFERENCES ai_agents.agent_registry(id) ON DELETE CASCADE,
    optimization_type VARCHAR(50) NOT NULL,
    domain VARCHAR(100),
    before_metrics JSONB,
    after_metrics JSONB,
    improvement_percentage DECIMAL(5,2),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ANALYTICS & MONITORING
-- ===========================================

-- Cross-domain user summary (materialized view)
CREATE MATERIALIZED VIEW analytics.cross_domain_user_summary AS
SELECT
    u.id,
    u.email,
    u.primary_domain,
    array_agg(DISTINCT uda.domain) as engaged_domains,
    COUNT(DISTINCT uda.domain) as domain_count,
    COALESCE(SUM(uda.value_eur), 0) as total_spent,
    MAX(uda.created_at) as last_activity,
    COUNT(*) as total_interactions,
    u.loyalty_tier,
    u.ai_optimization_score,
    u.cross_domain_score,
    CASE
        WHEN COUNT(DISTINCT uda.domain) >= 5 THEN 'Power User'
        WHEN COUNT(DISTINCT uda.domain) >= 3 THEN 'Multi-Domain User'
        WHEN COUNT(DISTINCT uda.domain) >= 1 THEN 'Single Domain User'
        ELSE 'New User'
    END as user_segment
FROM portfolio.users u
LEFT JOIN portfolio.user_domain_activity uda ON u.id = uda.user_id
WHERE u.is_active = true
GROUP BY u.id, u.email, u.primary_domain, u.loyalty_tier, u.ai_optimization_score, u.cross_domain_score;

-- Real-time analytics view
CREATE VIEW analytics.realtime_metrics AS
SELECT
    DATE_TRUNC('hour', created_at) as hour,
    domain,
    COUNT(*) as activity_count,
    COUNT(DISTINCT user_id) as unique_users,
    SUM(value_eur) as revenue,
    AVG(session_duration) as avg_session_duration,
    SUM(CASE WHEN ai_optimized THEN 1 ELSE 0 END) as ai_optimized_count,
    COUNT(CASE WHEN activity_type = 'conversion' THEN 1 END) as conversions
FROM portfolio.user_domain_activity
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), domain
ORDER BY hour DESC, domain;

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- User domain activity indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_domain_activity_composite
ON portfolio.user_domain_activity (user_id, domain, created_at DESC, activity_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_domain_activity_gin
ON portfolio.user_domain_activity USING GIN (activity_data);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_domain_activity_domain_time
ON portfolio.user_domain_activity (domain, created_at DESC);

-- Revenue tracking indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_revenue_user_domain
ON portfolio.revenue_tracking (user_id, domain, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_revenue_type_date
ON portfolio.revenue_tracking (revenue_type, created_at DESC);

-- Web3 indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_token_transactions_user
ON web3.token_transactions (user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_token_transactions_contract
ON web3.token_transactions (contract_address, block_timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_nft_ownership_user
ON web3.nft_ownership (user_id, acquired_at DESC);

-- AI agent indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agent_executions_performance
ON ai_agents.agent_executions (agent_id, success, execution_time_ms);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agent_executions_user
ON ai_agents.agent_executions (user_id, created_at DESC);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

ALTER TABLE portfolio.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.user_domain_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio.revenue_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE web3.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE web3.nft_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents.agent_executions ENABLE ROW LEVEL SECURITY;

-- Users can access their own data
CREATE POLICY "Users can view own profile" ON portfolio.users
FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own activity" ON portfolio.user_domain_activity
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own revenue" ON portfolio.revenue_tracking
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own token transactions" ON web3.token_transactions
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own NFTs" ON web3.nft_ownership
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own agent interactions" ON ai_agents.agent_executions
FOR ALL USING (auth.uid() = user_id);

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Function to update user cross-domain score
CREATE OR REPLACE FUNCTION update_cross_domain_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE portfolio.users
    SET cross_domain_score = (
        SELECT COUNT(DISTINCT domain)
        FROM portfolio.user_domain_activity
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update cross-domain score on activity
CREATE TRIGGER update_cross_domain_score_trigger
AFTER INSERT ON portfolio.user_domain_activity
FOR EACH ROW EXECUTE FUNCTION update_cross_domain_score();

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.cross_domain_user_summary;
END;
$$ LANGUAGE plpgsql;

-- Function for automated partitioning (future months)
CREATE OR REPLACE FUNCTION create_future_partitions()
RETURNS void AS $$
DECLARE
    partition_date DATE := DATE_TRUNC('month', NOW() + INTERVAL '1 month');
    partition_name TEXT;
    partition_start DATE;
    partition_end DATE;
BEGIN
    FOR i IN 0..11 LOOP
        partition_start := partition_date + (i || ' months')::INTERVAL;
        partition_end := partition_start + '1 month'::INTERVAL;
        partition_name := 'portfolio.user_activity_' || TO_CHAR(partition_start, 'YYYY_MM');

        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF portfolio.user_domain_activity FOR VALUES FROM (%L) TO (%L)',
                      partition_name, partition_start, partition_end);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- INITIAL DATA SEEDING
-- ===========================================

-- Insert initial domains
INSERT INTO portfolio.domains (domain_name, domain_type, is_active, created_at) VALUES
('fixie.run', 'fitness', true, NOW()),
('adaptogenic-mushrooms.com', 'ecommerce', true, NOW()),
('rhymechain.win', 'web3', true, NOW()),
('seobiz.be', 'saas', true, NOW()),
('affinitylove.eu', 'dating', true, NOW()),
('healthfulmushrooms.com', 'content', true, NOW()),
('brainhealthmushrooms.com', 'content', true, NOW()),
('tech-review-blog.com', 'blog', true, NOW()),
('puffs-store.com', 'ecommerce', true, NOW()),
('antonylambi.be', 'portfolio', true, NOW()),
('aifw.be', 'ai', true, NOW())
ON CONFLICT (domain_name) DO NOTHING;

-- Insert initial AI agents
INSERT INTO ai_agents.agent_registry (agent_name, agent_type, domain_focus, model_provider, model_name, capabilities, is_active) VALUES
('SEO_Optimizer', 'seo', 'all', 'openai', 'gpt-4', '["content_optimization", "keyword_research", "technical_seo"]', true),
('Content_Generator', 'content', 'all', 'anthropic', 'claude-3', '["article_writing", "social_media", "email_campaigns"]', true),
('Customer_Service_AI', 'customer_service', 'all', 'openai', 'gpt-3.5-turbo', '["support_tickets", "chat_responses", "faq_generation"]', true),
('Analytics_Predictor', 'analytics', 'all', 'google', 'gemini-pro', '["trend_analysis", "user_behavior", "revenue_forecasting"]', true)
ON CONFLICT (agent_name) DO NOTHING;

-- ===========================================
-- SCHEDULED MAINTENANCE
-- ===========================================

-- Schedule analytics refresh (every 15 minutes)
SELECT cron.schedule('refresh-analytics', '*/15 * * * *', 'SELECT refresh_analytics();');

-- Schedule partition creation (monthly)
SELECT cron.schedule('create-partitions', '0 2 1 * *', 'SELECT create_future_partitions();');

-- Schedule vacuum and reindex (weekly)
SELECT cron.schedule('database-maintenance', '0 3 * * 0', 'VACUUM ANALYZE;');

-- Schedule backup verification (daily)
SELECT cron.schedule('backup-verification', '0 4 * * *', 'SELECT verify_backups();');

-- ===========================================
-- GRANTS AND PERMISSIONS
-- ===========================================

-- Grant necessary permissions for the application
GRANT USAGE ON SCHEMA portfolio TO anon, authenticated;
GRANT USAGE ON SCHEMA analytics TO anon, authenticated;
GRANT USAGE ON SCHEMA web3 TO anon, authenticated;
GRANT USAGE ON SCHEMA ai_agents TO authenticated;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA portfolio TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO authenticated;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA web3 TO authenticated;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA ai_agents TO authenticated;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA portfolio TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA web3 TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ai_agents TO authenticated;

COMMIT;
