package handler

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// HandleHealth - ヘルスチェック
func (h *Handler) HandleHealth(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"status": "ok",
		"time":   time.Now().String(),
	})
}
