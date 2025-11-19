const API_BASE = '';

export interface AnalysisResult {
  study_time: number;
  topic: string;
  mood: number;
  quality: 'low' | 'medium' | 'high';
}

export interface Record {
  id: number;
  user_id: string;
  study_time: number;
  topic: string;
  mood: number;
  quality: string;
  created_at: string;
  updated_at: string;
}

// テキストから分析結果を生成
export const analyzeRecord = async (
  userId: string,
  text: string
): Promise<AnalysisResult> => {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, text }),
  });

  if (!response.ok) throw new Error('分析に失敗しました');
  return response.json();
};

// ユーザーの記録一覧を取得
export const getRecords = async (userId: string): Promise<Record[]> => {
  const response = await fetch(`${API_BASE}/api/records?user_id=${userId}`);
  if (!response.ok) throw new Error('記録取得に失敗しました');
  const data = await response.json();
  return data || [];
};

// 記録を作成
export const createRecord = async (
  userId: string,
  studyTime: number,
  topic: string,
  mood: number,
  quality: string
): Promise<Record> => {
  const response = await fetch(`${API_BASE}/api/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      study_time: studyTime,
      topic,
      mood,
      quality,
    }),
  });
  if (!response.ok) throw new Error('記録保存に失敗しました');
  return response.json();
};

// 記録を更新
export const updateRecord = async (
  recordId: number,
  studyTime: number,
  mood: number,
  quality: string
): Promise<Record> => {
  const response = await fetch(`${API_BASE}/api/records/${recordId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ study_time: studyTime, mood, quality }),
  });
  if (!response.ok) throw new Error('更新に失敗しました');
  return response.json();
};

// 記録を削除
export const deleteRecord = async (recordId: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/api/records/${recordId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('削除に失敗しました');
};

// 週単位分析
export const analyzeWeekly = async (userId: string, records: Record[]) => {
  const response = await fetch(`${API_BASE}/api/analyze/weekly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, records }),
  });
  if (!response.ok) throw new Error('分析に失敗しました');
  return response.json();
};
