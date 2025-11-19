package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"learning-app/internal/config"
	"learning-app/internal/db"
	"learning-app/internal/handler"
)

func main() {
	// 環境変数読み込み
	godotenv.Load()

	// Config 読み込み
	cfg := config.Load()

	// PostgreSQL に接続
	database, err := db.New(cfg.Database)
	if err != nil {
		log.Fatalf("❌ Failed to connect database: %v", err)
	}
	defer database.Close()

	// スキーマ初期化
	if err := database.InitSchema(); err != nil {
		log.Fatalf("❌ Failed to initialize schema: %v", err)
	}

	// Echo インスタンス作成
	e := echo.New()

	// ミドルウェア設定
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{echo.HeaderContentType, echo.HeaderAuthorization},
	}))
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// ハンドラ初期化・登録
	h := handler.New(database)
	h.Register(e)

	// 静的ファイル配信（フロントビルド済み）
	e.Static("/", "frontend/dist")
	e.File("/*", "frontend/dist/index.html")

	// サーバー起動
	port := cfg.Port
	fmt.Printf("🚀 Server starting on port %s\n", port)
	fmt.Printf("📍 Access: http://localhost:%s\n", port)

	e.Logger.Fatal(e.Start(":" + port))
}
