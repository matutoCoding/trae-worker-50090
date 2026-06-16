import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  Box,
  Users,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  Flame,
  Droplets,
  Wind,
} from 'lucide-react';
import StatCard from '@/components/cards/StatCard';
import SectionCard from '@/components/cards/SectionCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { operationStats, monthlyData, typeDistribution } from '@/data/statistics';
import { alarmRecords } from '@/data/alarm';
import { inspectionRecords } from '@/data/inspection';
import { formatDateTime, getTypeText } from '@/utils/format';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const recentAlarms = alarmRecords.slice(0, 5);
  const recentInspections = inspectionRecords.slice(0, 4);

  const quickActions = [
    { icon: Activity, label: '开始巡检', color: 'bg-green-500/20 text-green-500', to: '/inspection' },
    { icon: AlertTriangle, label: '告警处理', color: 'bg-red-500/20 text-red-500', to: '/safety' },
    { icon: Box, label: '管线登记', color: 'bg-blue-500/20 text-blue-500', to: '/pipeline' },
    { icon: Users, label: '人员管理', color: 'bg-purple-500/20 text-purple-500', to: '/statistics' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="管廊总长度"
          value={operationStats.totalLength}
          icon={Activity}
          suffix="公里"
          color="blue"
          trend={{ value: 5.2, isUp: true }}
        />
        <StatCard
          title="安全运行天数"
          value={operationStats.safetyDays}
          icon={ShieldCheck}
          suffix="天"
          color="green"
          trend={{ value: 100, isUp: true }}
        />
        <StatCard
          title="今日巡检次数"
          value={8}
          icon={Clock}
          suffix="次"
          color="yellow"
          trend={{ value: 12, isUp: true }}
        />
        <StatCard
          title="待处理告警"
          value={2}
          icon={AlertTriangle}
          color="red"
          trend={{ value: 33, isUp: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="运营趋势" icon={TrendingUp}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="巡检次数"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="告警数量"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="入廊人次"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="管线类型分布">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        color: '#F8FAFC',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="快捷操作">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.to}
                      className="flex flex-col items-center justify-center p-4 bg-navy-900/50 border border-navy-600/50 rounded-lg hover:border-navy-500 hover:bg-navy-800/50 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} mb-2 group-hover:scale-110 transition-transform`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-sm text-slate-300">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="最新告警"
            icon={AlertTriangle}
            action={
              <Link to="/safety" className="text-xs text-tech-blue hover:underline">
                查看全部
              </Link>
            }
          >
            <div className="space-y-3">
              {recentAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-lg hover:border-navy-500 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {alarm.level === 'critical' && (
                        <Flame size={16} className="text-red-500 flex-shrink-0" />
                      )}
                      {alarm.level === 'warning' && (
                        <Wind size={16} className="text-yellow-500 flex-shrink-0" />
                      )}
                      {alarm.level === 'info' && (
                        <Zap size={16} className="text-blue-500 flex-shrink-0" />
                      )}
                      <span className="text-sm text-white font-medium">
                        {alarm.description}
                      </span>
                    </div>
                    <StatusBadge status={alarm.status} size="sm" />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                    <span>{alarm.location}</span>
                    <span>{formatDateTime(alarm.timestamp).split(' ')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="巡检任务"
            icon={Activity}
            action={
              <Link to="/inspection" className="text-xs text-tech-blue hover:underline">
                查看全部
              </Link>
            }
          >
            <div className="space-y-3">
              {recentInspections.map((inspection) => (
                <div
                  key={inspection.id}
                  className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-lg hover:border-navy-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">
                      {inspection.taskName}
                    </span>
                    <StatusBadge status={inspection.status} size="sm" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      {inspection.type === 'robot' ? '机器人' : '人工'} · {getTypeText(inspection.type)}
                    </span>
                    <span>
                      {inspection.completedCheckpoints}/{inspection.checkpoints} 检查点
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-navy-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tech-blue rounded-full transition-all"
                        style={{
                          width: `${((inspection.completedCheckpoints || 0) / (inspection.checkpoints || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="环境概览">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-navy-900/50 rounded-lg border border-navy-600/50">
                <div className="flex items-center justify-center gap-1 text-tech-blue mb-1">
                  <Zap size={14} />
                  <span className="text-2xl font-semibold font-mono">23.5</span>
                </div>
                <p className="text-xs text-slate-400">温度(℃)</p>
              </div>
              <div className="text-center p-3 bg-navy-900/50 rounded-lg border border-navy-600/50">
                <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                  <Droplets size={14} />
                  <span className="text-2xl font-semibold font-mono">62</span>
                </div>
                <p className="text-xs text-slate-400">湿度(%)</p>
              </div>
              <div className="text-center p-3 bg-navy-900/50 rounded-lg border border-navy-600/50">
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                  <Wind size={14} />
                  <span className="text-2xl font-semibold font-mono">20.8</span>
                </div>
                <p className="text-xs text-slate-400">氧气(%)</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
