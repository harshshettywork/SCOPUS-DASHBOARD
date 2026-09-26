-- ==========================================================
-- India Global Access Index - PostgreSQL Database Schema
-- ==========================================================

DROP TABLE IF EXISTS ranking_cache CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS destination_weights CASCADE;
DROP TABLE IF EXISTS visa_rules CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

CREATE TABLE cities (
    airport_iata VARCHAR(3) PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    intl_pax_volume BIGINT DEFAULT 0
);

CREATE TABLE routes (
    route_id SERIAL PRIMARY KEY,
    origin_iata VARCHAR(3) REFERENCES cities(airport_iata),
    dest_iata VARCHAR(3) NOT NULL,
    dest_city VARCHAR(100) NOT NULL,
    dest_country VARCHAR(100) NOT NULL,
    is_direct BOOLEAN DEFAULT TRUE,
    flights_per_week INT DEFAULT 0,
    avg_duration_mins INT DEFAULT 0,
    data_source VARCHAR(100),
    last_verified DATE DEFAULT CURRENT_DATE
);

CREATE TABLE visa_rules (
    dest_country VARCHAR(100) PRIMARY KEY,
    visa_category VARCHAR(50) NOT NULL,
    visa_score NUMERIC(3, 2) NOT NULL,
    max_stay_days VARCHAR(50),
    fee_usd NUMERIC(6, 2) DEFAULT 0
);

CREATE TABLE destination_weights (
    dest_country VARCHAR(100) PRIMARY KEY,
    dest_weight NUMERIC(4, 3) NOT NULL
);

CREATE TABLE ranking_cache (
    rank INT PRIMARY KEY,
    airport_iata VARCHAR(3) REFERENCES cities(airport_iata),
    city_name VARCHAR(100) NOT NULL,
    raw_score NUMERIC(8, 4),
    index_score NUMERIC(5, 1),
    direct_dest_count INT,
    visa_free_dest_count INT,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid routing and calculation queries
CREATE INDEX idx_routes_origin ON routes(origin_iata);
CREATE INDEX idx_routes_dest_country ON routes(dest_country);
CREATE INDEX idx_ranking_score ON ranking_cache(index_score DESC);
