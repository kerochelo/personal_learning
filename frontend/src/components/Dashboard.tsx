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
    <div className="bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Stats Cards */}
        {weeklyAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-cyan-500 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">継続率</p>
              <p className="text-3xl font-bold text-gray-900">
                {weeklyAnalysis.continuation_rate}%
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-2xl">⏱️</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">総学習時間</p>
              <p className="text-3xl font-bold text-gray-900">
                {weeklyAnalysis.total_study_time}分
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-500 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">リスクレベル</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  weeklyAnalysis.risk_level === 'high'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : weeklyAnalysis.risk_level === 'medium'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}
              >
                {weeklyAnalysis.risk_level}
              </span>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">新しい記録を追加</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学習内容
              </label>
              <textarea
                value={recordText}
                onChange={(e) => setRecordText(e.target.value)}
                placeholder="例: 英語を60分学習、新しい単語を120個覚えた"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                rows={4}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !recordText.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
            >
              {loading ? '分析中...' : '記録を追加'}
            </button>
          </form>
        </div>

        {/* AI Suggestions */}
        {weeklyAnalysis && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💡</span>
              <h2 className="text-xl font-semibold text-gray-900">AI提案</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {weeklyAnalysis.suggestions}
            </p>
          </div>
        )}

        {/* Records Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">最近の記録</h2>
          </div>
          <div className="overflow-x-auto">
            {records.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <p className="text-gray-600 mb-2">まだ記録がありません</p>
                <p className="text-sm text-gray-500">
                  上のフォームから最初の記録を追加しましょう
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      トピック
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      学習時間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      気分
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      品質
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(record.created_at).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {record.topic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.study_time}分
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.mood}/10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            record.quality === 'high'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : record.quality === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {record.quality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
