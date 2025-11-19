package service

import (
	"regexp"
	"strconv"
	"strings"
)

// AnalyzeText - テキストを分析（モック実装）
// 実際は Gemini API に置き換え予定
func AnalyzeText(text string) *AnalysisResult {
	// 簡易的なテキスト解析（モック）

	// 分単位を抽出
	studyTime := extractTime(text)

	// トピックを抽出
	topic := extractTopic(text)

	// ムードスコアをランダムに（実装時は AI で判定）
	mood := 5

	// 品質を判定
	quality := "medium"
	if studyTime > 120 {
		quality = "high"
	} else if studyTime < 30 {
		quality = "low"
	}

	return &AnalysisResult{
		StudyTime: studyTime,
		Topic:     topic,
		Mood:      mood,
		Quality:   quality,
	}
}

// extractTime - テキストから学習時間を抽出
func extractTime(text string) int {
	// パターン: "60分", "60 分", "1時間"
	patterns := []string{
		`(\d+)\s*分`,  // "60分" or "60 分"
		`(\d+)\s*時間`, // "1時間"
	}

	for _, pattern := range patterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(text)
		if len(matches) > 1 {
			time, err := strconv.Atoi(matches[1])
			if err == nil {
				// 時間を分に変換
				if strings.Contains(pattern, "時間") {
					time = time * 60
				}
				return time
			}
		}
	}

	// デフォルト
	return 0
}

// extractTopic - テキストからトピック（主な学習内容）を抽出
func extractTopic(text string) string {
	// キーワード
	keywords := []string{
		"英語", "日本語", "プログラミング", "Go", "React", "TypeScript",
		"数学", "物理", "化学", "歴史", "地理", "国語",
		"Python", "JavaScript", "Java", "C++",
	}

	for _, keyword := range keywords {
		if strings.Contains(text, keyword) {
			return keyword
		}
	}

	// キーワードが見つからない場合はテキスト全体を返す
	if len(text) > 50 {
		return text[:50]
	}
	return text
}

// AnalyzeWeekly - 週単位の分析（モック）
func AnalyzeWeekly(records []RecordResponse) *WeeklyAnalysisResult {
	if len(records) == 0 {
		return &WeeklyAnalysisResult{
			ContinuationRate: 0,
			TotalStudyTime:   0,
			Suggestions:      "記録がありません。学習を開始しましょう！",
			RiskLevel:        "high",
		}
	}

	// 継続率を計算（7日中何日記録したか）
	continuationRate := (len(records) * 100) / 7
	if continuationRate > 100 {
		continuationRate = 100
	}

	// 総学習時間を計算
	totalStudyTime := 0
	for _, record := range records {
		totalStudyTime += record.StudyTime
	}

	// リスク判定
	riskLevel := "low"
	if continuationRate < 50 {
		riskLevel = "high"
	} else if continuationRate < 80 {
		riskLevel = "medium"
	}

	// 提案を生成
	suggestions := generateSuggestions(continuationRate, totalStudyTime)

	return &WeeklyAnalysisResult{
		ContinuationRate: continuationRate,
		TotalStudyTime:   totalStudyTime,
		Suggestions:      suggestions,
		RiskLevel:        riskLevel,
	}
}

// generateSuggestions - 提案を生成
func generateSuggestions(continuationRate, totalStudyTime int) string {
	if continuationRate >= 80 && totalStudyTime >= 300 {
		return "素晴らしい！継続率が高く、十分な学習時間を確保できています。このペースを保ちましょう！"
	} else if continuationRate >= 50 {
		return "良い調子です。さらに学習時間を増やせば、より良い成果が期待できます。"
	} else {
		return "学習の継続が課題です。毎日少しずつでも学習を続けることが大切です。"
	}
}
