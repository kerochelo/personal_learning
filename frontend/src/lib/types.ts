export interface Record {
  id: number;
  user_id: string;
  study_time: number;
  topic: string;
  mood: number;
  quality: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface AnalysisResult {
  study_time: number;
  topic: string;
  mood: number;
  quality: 'low' | 'medium' | 'high';
}
