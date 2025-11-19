package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"learning-app/internal/db"
)

type Handler struct {
	db *db.Database
}

func New(database *db.Database) *Handler {
	return &Handler{db: database}
}

// Register - すべてのハンドラを登録
func (h *Handler) Register(e *echo.Echo) {
	// ヘルスチェック
	e.GET("/health", h.HandleHealth)

	// API グループ
	api := e.Group("/api")

	// 分析エンドポイント
	api.POST("/analyze", h.HandleAnalyze)
	api.POST("/analyze/weekly", h.HandleWeeklyAnalyze)

	// 記録エンドポイント
	api.GET("/records", h.HandleGetRecords)
	api.POST("/records", h.HandleCreateRecord)
	api.PUT("/records/:id", h.HandleUpdateRecord)
	api.DELETE("/records/:id", h.HandleDeleteRecord)

	// Webhook
	api.POST("/webhook/line", h.HandleLineWebhook)
}
