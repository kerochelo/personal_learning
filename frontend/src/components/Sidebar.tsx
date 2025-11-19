import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: '📊' },
    { id: 'records', label: '記録一覧', icon: '📝' },
    { id: 'analytics', label: '分析', icon: '📈' },
    { id: 'settings', label: '設定', icon: '⚙️' },
  ];

  return (
    <div
      className={`bg-slate-900 h-screen border-r border-slate-700 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`p-6 border-b border-slate-700 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {!isCollapsed ? (
          <div>
            <h1 className="text-xl font-bold text-white">学習記録AI</h1>
            <p className="text-xs text-slate-400 mt-1">Learning Tracker</p>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            L
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="border-t border-slate-700">
        <div className={`px-4 py-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            title={isCollapsed ? '開く' : '閉じる'}
          >
            <span className="text-lg">{isCollapsed ? '→' : '←'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
