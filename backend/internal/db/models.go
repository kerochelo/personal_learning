package db

import "time"

type LearningRecord struct {
	ID        int       `json:"id"`
	UserID    string    `json:"user_id"`
	StudyTime int       `json:"study_time"`
	Topic     string    `json:"topic"`
	Mood      int       `json:"mood"`
	Quality   string    `json:"quality"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type User struct {
	ID        int       `json:"id"`
	UserID    string    `json:"user_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
