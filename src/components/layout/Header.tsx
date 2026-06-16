import { Bell, Search, User, Settings, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { alarmStats } from '@/data/alarm';
import { useState } from 'react';

const pageTitles: Record<string, string> = {
  dashboard: '工作台',
  ledger: '管廊台账',
  monitor: '舱室监控',
  pipeline: '管线入廊',
  inspection: '巡检维护',
  safety: '环境安全',
  emergency: '应急处置',
  statistics: '运营统计',
};

export default function Header() {
  const { currentPage } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-navy-800/80 backdrop-blur-sm border-b border-navy-700 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-white">
          {pageTitles[currentPage] || '系统首页'}
        </h1>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>系统运行正常</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-64 h-9 pl-9 pr-4 bg-navy-900/50 border border-navy-600 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-tech-blue/50 focus:ring-1 focus:ring-tech-blue/30 transition-all"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-navy-700 rounded-md transition-colors"
          >
            <Bell size={20} />
            {alarmStats.unhandled > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {alarmStats.unhandled}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-navy-800 border border-navy-600 rounded-lg shadow-xl z-50">
              <div className="p-3 border-b border-navy-600">
                <h3 className="text-white font-medium">告警通知</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  今日共 {alarmStats.today} 条告警，{alarmStats.unhandled} 条未处理
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-navy-700 hover:bg-navy-700/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 mt-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                    <div>
                      <p className="text-sm text-white">甲烷浓度超标</p>
                      <p className="text-xs text-slate-400 mt-0.5">滨江路燃气管廊 · 5分钟前</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-b border-navy-700 hover:bg-navy-700/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 mt-1.5 bg-yellow-500 rounded-full flex-shrink-0"></span>
                    <div>
                      <p className="text-sm text-white">变电站温度偏高</p>
                      <p className="text-xs text-slate-400 mt-0.5">中央大道管廊 · 20分钟前</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-navy-700/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 mt-1.5 bg-yellow-500 rounded-full flex-shrink-0"></span>
                    <div>
                      <p className="text-sm text-white">积水预警</p>
                      <p className="text-xs text-slate-400 mt-0.5">老城区改造管廊 · 1小时前</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t border-navy-600">
                <button className="w-full py-2 text-sm text-tech-blue hover:bg-navy-700 rounded-md transition-colors">
                  查看全部告警
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-navy-700 rounded-md transition-colors"
          >
            <div className="w-8 h-8 bg-tech-blue/20 rounded-full flex items-center justify-center">
              <User size={16} className="text-tech-blue" />
            </div>
            <span className="text-sm text-white hidden md:block">管理员</span>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 bg-navy-800 border border-navy-600 rounded-lg shadow-xl z-50">
              <div className="p-3 border-b border-navy-600">
                <p className="text-white font-medium">管理员</p>
                <p className="text-xs text-slate-400 mt-0.5">admin@tunnel.com</p>
              </div>
              <div className="p-1">
                <button className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-navy-700 rounded-md flex items-center gap-2">
                  <Settings size={16} />
                  系统设置
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-navy-700 rounded-md">
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
