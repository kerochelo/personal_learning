package service

import "time"

// API Request/Response 型定義

type AnalysisRequest struct {
	UserID string `json:"user_id"`
	Text   string `json:"text"`
}

type AnalysisResult struct {
	StudyTime int    `json:"study_time"`
	Topic     string `json:"topic"`
	Mood      int    `json:"mood"`
	Quality   string `json:"quality"`
}

type RecordRequest struct {
	UserID    string `json:"user_id"`
	StudyTime int    `json:"study_time"`
	Topic     string `json:"topic"`
	Mood      int    `json:"mood"`
	Quality   string `json:"quality"`
}

type RecordResponse struct {
	ID        int       `json:"id"`
	UserID    string    `json:"user_id"`
	StudyTime int       `json:"study_time"`
	Topic     string    `json:"topic"`
	Mood      int       `json:"mood"`
	Quality   string    `json:"quality"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type WeeklyAnalysisRequest struct {
	UserID  string           `json:"user_id"`
	Records []RecordResponse `json:"records"`
}

type WeeklyAnalysisResult struct {
	ContinuationRate int    `json:"continuation_rate"`
	TotalStudyTime   int    `json:"total_study_time"`
	Suggestions      string `json:"suggestions"`
	RiskLevel        string `json:"risk_level"`
}

type ErrorResponse struct {
	Error string `json:"error"`
	Code  string `json:"code,omitempty"`
}

type SuccessResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
}
