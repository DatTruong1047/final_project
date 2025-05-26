-- -- Tạo database super_admin nếu chưa tồn tại
-- CREATE DATABASE IF NOT EXISTS ecommerce_db;

-- -- Kết nối đến database super_admin
-- \c ecommerce_db;
SET SEARCH_PATH = "public";

CREATE EXTENSION IF NOT EXISTS vector;


-- Tạo bảng vector_store để lưu trữ embeddings
CREATE TABLE IF NOT EXISTS vector_store (
    id SERIAL PRIMARY KEY,
    content TEXT,
    metadata JSONB,
    embedding vector(768)   
);

-- Tạo index cho vector tìm kiếm nhanh hơn (sử dụng IVFFlat index với số lượng lists tối ưu)
CREATE INDEX IF NOT EXISTS vector_store_embedding_idx ON vector_store 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);

-- Tạo index cho metadata để tìm kiếm nhanh hơn
CREATE INDEX IF NOT EXISTS vector_store_metadata_idx ON vector_store USING GIN (metadata);

CREATE INDEX IF NOT EXISTS metadata_brand_idx ON vector_store USING GIN ((metadata->'brand_name'));
CREATE INDEX IF NOT EXISTS metadata_category_idx ON vector_store USING GIN ((metadata->'category_name'));