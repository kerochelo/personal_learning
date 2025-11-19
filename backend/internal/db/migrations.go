package db

import (
	"context"
	"fmt"
	"time"
)

// CreateRecord - 記録を作成
func (d *Database) CreateRecord(ctx context.Context, userID, topic string, studyTime, mood int, quality string) (*LearningRecord, error) {
	record := &LearningRecord{
		UserID:    userID,
		StudyTime: studyTime,
		Topic:     topic,
		Mood:      mood,
		Quality:   quality,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err := d.QueryRowContext(
		ctx,
		`INSERT INTO learning_records (user_id, study_time, topic, mood, quality, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 RETURNING id`,
		record.UserID,
		record.StudyTime,
		record.Topic,
		record.Mood,
		record.Quality,
		record.CreatedAt,
		record.UpdatedAt,
	).Scan(&record.ID)

	if err != nil {
		return nil, fmt.Errorf("failed to create record: %w", err)
	}

	return record, nil
}

// GetRecords - ユーザーの記録一覧を取得
func (d *Database) GetRecords(ctx context.Context, userID string, limit int) ([]LearningRecord, error) {
	rows, err := d.QueryContext(
		ctx,
		`SELECT id, user_id, study_time, topic, mood, quality, created_at, updated_at
		 FROM learning_records
		 WHERE user_id = $1
		 ORDER BY created_at DESC
		 LIMIT $2`,
		userID,
		limit,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get records: %w", err)
	}
	defer rows.Close()

	var records []LearningRecord
	for rows.Next() {
		var record LearningRecord
		err := rows.Scan(
			&record.ID,
			&record.UserID,
			&record.StudyTime,
			&record.Topic,
			&record.Mood,
			&record.Quality,
			&record.CreatedAt,
			&record.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan record: %w", err)
		}
		records = append(records, record)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating records: %w", err)
	}

	return records, nil
}

// GetRecord - 単一の記録を取得
func (d *Database) GetRecord(ctx context.Context, id int) (*LearningRecord, error) {
	record := &LearningRecord{}

	err := d.QueryRowContext(
		ctx,
		`SELECT id, user_id, study_time, topic, mood, quality, created_at, updated_at
		 FROM learning_records
		 WHERE id = $1`,
		id,
	).Scan(
		&record.ID,
		&record.UserID,
		&record.StudyTime,
		&record.Topic,
		&record.Mood,
		&record.Quality,
		&record.CreatedAt,
		&record.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get record: %w", err)
	}

	return record, nil
}

// UpdateRecord - 記録を更新
func (d *Database) UpdateRecord(ctx context.Context, id int, studyTime, mood int, quality string) (*LearningRecord, error) {
	record, err := d.GetRecord(ctx, id)
	if err != nil {
		return nil, err
	}

	record.StudyTime = studyTime
	record.Mood = mood
	record.Quality = quality
	record.UpdatedAt = time.Now()

	_, err = d.ExecContext(
		ctx,
		`UPDATE learning_records
		 SET study_time = $1, mood = $2, quality = $3, updated_at = $4
		 WHERE id = $5`,
		record.StudyTime,
		record.Mood,
		record.Quality,
		record.UpdatedAt,
		record.ID,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update record: %w", err)
	}

	return record, nil
}

// DeleteRecord - 記録を削除
func (d *Database) DeleteRecord(ctx context.Context, id int) error {
	result, err := d.ExecContext(
		ctx,
		`DELETE FROM learning_records WHERE id = $1`,
		id,
	)

	if err != nil {
		return fmt.Errorf("failed to delete record: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("record not found")
	}

	return nil
}
