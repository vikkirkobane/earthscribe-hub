-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    location GEOGRAPHY(POINT),
    points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create quest_types enum
CREATE TYPE quest_type AS ENUM (
    'soil_erosion',
    'crop_health',
    'water_monitoring',
    'vegetation_health',
    'degraded_land'
);

-- Create quests table
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type quest_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points_reward INTEGER DEFAULT 0,
    difficulty VARCHAR(20) DEFAULT 'medium',
    location GEOGRAPHY(POINT),
    radius_km FLOAT DEFAULT 10.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
    photo_url TEXT,
    location GEOGRAPHY(POINT),
    ai_validation_result JSONB,
    points_earned INTEGER DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT NOW(),
    validated_at TIMESTAMP
);

-- Create badges table
CREATE TYPE badge_type AS ENUM (
    'land_guardian',
    'eco_warrior',
    'restoration_hero',
    'streak_master',
    'diversity_champion',
    'community_leader',
    'early_adopter',
    'perfectionist'
);

CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_type badge_type NOT NULL,
    earned_at TIMESTAMP DEFAULT NOW()
);

-- Create plots table
CREATE TABLE plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    area_hectares FLOAT,
    coordinates GEOGRAPHY(POLYGON),
    degradation_type VARCHAR(100),
    restoration_plan TEXT,
    baseline_photo_url TEXT,
    baseline_ndvi FLOAT,
    status VARCHAR(50) DEFAULT 'claimed',
    claimed_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create impact_metrics table
CREATE TABLE impact_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    metric_type VARCHAR(50),
    value FLOAT,
    verification_source VARCHAR(100),
    measured_at TIMESTAMP DEFAULT NOW()
);

-- Create chat_history table
CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    response TEXT,
    context JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_quests_type ON quests(type);
CREATE INDEX idx_quests_location ON quests USING GIST(location);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_quest_id ON submissions(quest_id);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_plots_user_id ON plots(user_id);
CREATE INDEX idx_plots_coordinates ON plots USING GIST(coordinates);
CREATE INDEX idx_impact_metrics_plot_id ON impact_metrics(plot_id);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can access their own data
CREATE POLICY user_access_policy ON users FOR ALL TO authenticated USING (auth.uid() = id);
CREATE POLICY user_update_policy ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Users can access quests
CREATE POLICY quest_access_policy ON quests FOR SELECT TO authenticated USING (true);

-- Users can manage their submissions
CREATE POLICY submission_access_policy ON submissions FOR ALL TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- Users can manage their badges
CREATE POLICY badge_access_policy ON badges FOR ALL TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- Users can manage their plots
CREATE POLICY plot_access_policy ON plots FOR ALL TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- Users can manage their impact metrics
CREATE POLICY impact_metric_access_policy ON impact_metrics FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM plots WHERE plots.id = impact_metrics.plot_id AND plots.user_id = auth.uid()));

-- Users can manage their chat history
CREATE POLICY chat_history_access_policy ON chat_history FOR ALL TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- Create trigger to update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quests_updated_at 
    BEFORE UPDATE ON quests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plots_updated_at 
    BEFORE UPDATE ON plots 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial quests for demo purposes
INSERT INTO quests (type, title, description, points_reward, difficulty) VALUES
    ('soil_erosion', 'Soil Erosion Detection', 'Document erosion patterns in degraded areas to identify intervention needs.', 50, 'easy'),
    ('crop_health', 'Crop Health Monitoring', 'Assess vegetation health in agricultural plots and document pest damage.', 75, 'medium'),
    ('water_monitoring', 'Water Source Survey', 'Map and assess quality of local water sources for restoration planning.', 60, 'easy'),
    ('vegetation_health', 'Native Vegetation Count', 'Identify and count native plant species in regeneration zones.', 100, 'hard'),
    ('degraded_land', 'Degraded Land Assessment', 'Survey barren or degraded areas suitable for restoration projects.', 80, 'medium');