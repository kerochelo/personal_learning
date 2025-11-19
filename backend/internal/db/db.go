package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"learning-app/internal/config"
)

type Database struct {
	*sql.DB
}

func New(cfg config.DatabaseConfig) (*Database, error) {
	db, err := sql.Open("postgres", cfg.DSN())
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// 接続テスト
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("✅ Database connected successfully")

	// 接続プール設定
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	return &Database{db}, nil
}

// InitSchema - テーブル作成
func (d *Database) InitSchema() error {
	log.Println("📦 Initializing database schema...")

	schema := `
	-- learning_records テーブル
	CREATE TABLE IF NOT EXISTS learning_records (
		id SERIAL PRIMARY KEY,
		user_id VARCHAR(255) NOT NULL,
		study_time INT NOT NULL DEFAULT 0,
		topic VARCHAR(500) NOT NULL,
		mood INT NOT NULL DEFAULT 5 CHECK (mood >= 0 AND mood <= 10),
		quality VARCHAR(50) NOT NULL DEFAULT 'medium',
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	);

	-- インデックス
	CREATE INDEX IF NOT EXISTS idx_learning_records_user_id
		ON learning_records(user_id);
	CREATE INDEX IF NOT EXISTS idx_learning_records_created_at
		ON learning_records(created_at DESC);

	-- users テーブル（将来拡張用）
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		user_id VARCHAR(255) UNIQUE NOT NULL,
		name VARCHAR(255),
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
	`

	_, err := d.Exec(schema)
	if err != nil {
		return fmt.Errorf("failed to initialize schema: %w", err)
	}

	log.Println("✅ Schema initialized successfully")
	return nil
}

// Close - DB 接続を閉じる
func (d *Database) Close() error {
	return d.DB.Close()
}
