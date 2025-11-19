package handler

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"learning-app/internal/service"
)

// HandleGetRecords - 記録一覧取得
func (h *Handler) HandleGetRecords(c echo.Context) error {
	userID := c.QueryParam("user_id")
	if userID == "" {
		return c.JSON(http.StatusBadRequest, service.ErrorResponse{
			Error: "user_id is required",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	records, err := h.db.GetRecords(ctx, userID, 50)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, service.ErrorResponse{
			Error: err.Error(),
		})
	}

	// モデルを API レスポンスに変換
	var responses []service.RecordResponse
	for _, record := range records {
		responses = append(responses, service.RecordResponse{
			ID:        record.ID,
			UserID:    record.UserID,
			StudyTime: record.StudyTime,
			Topic:     record.Topic,
			Mood:      record.Mood,
			Quality:   record.Quality,
			CreatedAt: record.CreatedAt,
			UpdatedAt: record.UpdatedAt,
		})
	}

	if len(responses) == 0 {
		return c.JSON(http.StatusOK, []service.RecordResponse{})
	}

	return c.JSON(http.StatusOK, responses)
}

// HandleCreateRecord - 記録作成
func (h *Handler) HandleCreateRecord(c echo.Context) error {
	var req service.RecordRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, service.ErrorResponse{
			Error: "Invalid request",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	record, err := h.db.CreateRecord(
		ctx,
		req.UserID,
		req.Topic,
		req.StudyTime,
		req.Mood,
		req.Quality,
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, service.ErrorResponse{
			Error: err.Error(),
		})
	}

	response := service.RecordResponse{
		ID:        record.ID,
		UserID:    record.UserID,
		StudyTime: record.StudyTime,
		Topic:     record.Topic,
		Mood:      record.Mood,
		Quality:   record.Quality,
		CreatedAt: record.CreatedAt,
		UpdatedAt: record.UpdatedAt,
	}

	return c.JSON(http.StatusCreated, response)
}

// HandleUpdateRecord - 記録更新
func (h *Handler) HandleUpdateRecord(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, service.ErrorResponse{
			Error: "Invalid ID",
		})
	}

	var req struct {
		StudyTime int    `json:"study_time"`
		Mood      int    `json:"mood"`
		Quality   string `json:"quality"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, service.ErrorResponse{
			Error: "Invalid request",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	record, err := h.db.UpdateRecord(ctx, id, req.StudyTime, req.Mood, req.Quality)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, service.ErrorResponse{
			Error: err.Error(),
		})
	}

	response := service.RecordResponse{
		ID:        record.ID,
		UserID:    record.UserID,
		StudyTime: record.StudyTime,
		Topic:     record.Topic,
		Mood:      record.Mood,
		Quality:   record.Quality,
		CreatedAt: record.CreatedAt,
		UpdatedAt: record.UpdatedAt,
	}

	return c.JSON(http.StatusOK, response)
}

// HandleDeleteRecord - 記録削除
func (h *Handler) HandleDeleteRecord(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, service.ErrorResponse{
			Error: "Invalid ID",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := h.db.DeleteRecord(ctx, id); err != nil {
		return c.JSON(http.StatusInternalServerError, service.ErrorResponse{
			Error: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, service.SuccessResponse{Success: true})
}
