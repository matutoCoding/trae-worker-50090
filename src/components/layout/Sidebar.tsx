import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Monitor,
  Cable,
  ClipboardCheck,
  ShieldAlert,
  Siren,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '工作台', key: 'dashboard' },
  { path: '/ledger', icon: FileText, label: '管廊台账', key: 'ledger' },
  { path: '/monitor', icon: Monitor, label: '舱室监控', key: 'monitor' },
  { path: '/pipeline', icon: Cable, label: '管线入廊', key: 'pipeline' },
  { path: '/inspection', icon: ClipboardCheck, label: '巡检维护', key: 'inspection' },
  { path: '/safety', icon: ShieldAlert, label: '环境安全', key: 'safety' },
  { path: '/emergency', icon: Siren, label: '应急处置', key: 'emergency' },
  { path: '/statistics', icon: BarChart3, label: '运营统计', key: 'statistics' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, setCurrentPage } = useAppStore();
  const location = useLocation();

  const isPathActive = (itemPath: string, itemKey: string): boolean => {
    if (itemPath === '/') {
      return location.pathname === '/';
    }
    return location.pathname === itemPath || location.pathname.startsWith(itemPath + '/');
  };

  return (
    <aside
      className={`h-screen bg-navy-900 border-r border-navy-700 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="h-16 flex items-center justify-center border-b border-navy-700 flex-shrink-0">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-tech-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">管</span>
            </div>
            <span className="text-white font-semibold text-lg">管廊运维系统</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-tech-blue rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">管</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isPathActive(item.path, item.key);
            
            return (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  onClick={() => setCurrentPage(item.key)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${
                    isActive
                      ? 'bg-tech-blue/20 text-tech-blue border-l-2 border-tech-blue'
                      : 'text-slate-400 hover:bg-navy-800 hover:text-white border-l-2 border-transparent'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-2 border-t border-navy-700 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 text-slate-400 hover:text-white hover:bg-navy-800 rounded-md transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>
    </aside>
  );
}
