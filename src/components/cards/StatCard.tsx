import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  suffix?: string;
  children?: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  suffix,
  children,
}: StatCardProps) {
  const colorClasses = {
    blue: 'text-tech-blue bg-tech-blue/10 border-tech-blue/30',
    green: 'text-green-500 bg-green-500/10 border-green-500/30',
    yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    red: 'text-red-500 bg-red-500/10 border-red-500/30',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
  };

  return (
    <div className="bg-navy-800/60 border border-navy-600/50 rounded-lg p-5 hover:border-navy-500/70 transition-all duration-200 hover:shadow-lg hover:shadow-navy-900/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-white font-mono">{value}</span>
            {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span className={trend.isUp ? 'text-green-500' : 'text-red-500'}>
                {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-slate-500">较上月</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
