package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// HandleLineWebhook - LINE Webhook 処理（モック）
func (h *Handler) HandleLineWebhook(c echo.Context) error {
	// TODO: LINE SDK 統合実装予定

	// モック レスポンス
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}
