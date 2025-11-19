import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-100">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'records' && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900">記録一覧</h1>
              <p className="text-gray-600 mt-2">開発中...</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900">分析</h1>
              <p className="text-gray-600 mt-2">開発中...</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900">設定</h1>
              <p className="text-gray-600 mt-2">開発中...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
