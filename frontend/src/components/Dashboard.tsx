import { useState, useEffect } from 'react';
import {
  analyzeRecord,
  createRecord,
  getRecords,
  analyzeWeekly,
  type Record,
  type AnalysisResult,
} from '../lib/api';

export const Dashboard = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [recordText, setRecordText] = useState('');
  const [userId] = useState('user123');
  const [weeklyAnalysis, setWeeklyAnalysis] = useState<any>(null);

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  const fetchRecords = async () => {
    try {
      const data = await getRecords(userId);
      setRecords(data);

      // 週単位分析
      if (data && data.length > 0) {
        const analysis = await analyzeWeekly(userId, data);
        setWeeklyAnalysis(analysis);
      }
    } catch (error) {
      console.error('記録取得失敗:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // テキストを分析
      const analysis = await analyzeRecord(userId, recordText);

      // 記録を作成
      await createRecord(
        userId,
        analysis.study_time,
        analysis.topic,
        analysis.mood,
        analysis.quality
      );

      alert('記録完了 ✅');
      setRecordText('');
      fetchRecords();
    } catch (error) {
      alert('記録失敗 ❌');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 学習記録AI</h1>
        <p className="text-gray-600 mb-6">
          あなたの学習をスマートに追跡・分析します
        </p>

        {/* 入力フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg mb-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            今日の学習を記録
          </label>
          <textarea
            value={recordText}
            onChange={(e) => setRecordText(e.target.value)}
            placeholder="例: 英語を60分学習、新しい単語を120個覚えた"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !recordText.trim()}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            {loading ? '分析中...' : '記録を送信'}
          </button>
        </form>

        {/* 週次分析 */}
        {weeklyAnalysis && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📊 先週の分析
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">継続率</p>
                <p className="text-2xl font-bold text-blue-600">
                  {weeklyAnalysis.continuation_rate}%
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <p className="text-sm text-gray-600">総学習時間</p>
                <p className="text-2xl font-bold text-green-600">
                  {weeklyAnalysis.total_study_time}分
                </p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded mb-4">
              <p className="text-sm font-medium text-gray-700">💡 提案</p>
              <p className="text-gray-700">{weeklyAnalysis.suggestions}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">リスク:</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  weeklyAnalysis.risk_level === 'high'
                    ? 'bg-red-100 text-red-700'
                    : weeklyAnalysis.risk_level === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {weeklyAnalysis.risk_level}
              </span>
            </div>
          </div>
        )}

        {/* 記録一覧 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📝 記録一覧
          </h2>
          <div className="space-y-4">
            {records.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                まだ記録がありません。さっそく記録を追加しましょう！
              </p>
            ) : (
              records.map((record) => (
                <div
                  key={record.id}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <p className="text-gray-600 text-sm">
                    {new Date(record.created_at).toLocaleString('ja-JP')}
                  </p>
                  <p className="text-gray-800 font-medium">{record.topic}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>⏱️ {record.study_time}分</span>
                    <span>😊 {record.mood}/10</span>
                    <span>⭐ {record.quality}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
