export const Header = () => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex items-center justify-between">
      {/* Page title area - can be updated dynamically */}
      <div>
        <h2 className="text-xl font-semibold text-white">ダッシュボード</h2>
      </div>

      {/* Right side - User info */}
      <div className="flex items-center gap-4">
        {/* Notification icon (placeholder) */}
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors relative">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></span>
        </button>

        {/* User menu */}
        <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-lg">
            U
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">User123</p>
            <p className="text-xs text-slate-400">user@example.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};
