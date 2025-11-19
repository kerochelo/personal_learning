package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"learning-app/internal/service"
)

// HandleAnalyze - テキスト分析
func (h *Handler) HandleAnalyze(c echo.Context) error {
	var req service.AnalysisRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, service.ErrorResponse{
			Error: "Invalid request",
		})
	}

	// モック分析（テキスト処理）
	result := service.AnalyzeText(req.Text)

	return c.JSON(http.StatusOK, result)
}

// HandleWeeklyAnalyze - 週単位分析
func (h *Handler) HandleWeeklyAnalyze(c echo.Context) error {
	var req service.WeeklyAnalysisRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, service.ErrorResponse{
			Error: "Invalid request",
		})
	}

	// 週単位分析（モック）
	result := service.AnalyzeWeekly(req.Records)

	return c.JSON(http.StatusOK, result)
}
