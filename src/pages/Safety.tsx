import { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Wind,
  Flame,
  Droplets,
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  Filter,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import SectionCard from '@/components/cards/SectionCard';
import StatCard from '@/components/cards/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { environmentData } from '@/data/environment';
import { tunnelSections } from '@/data/tunnel';
import { formatDateTime } from '@/utils/format';
import { useAppStore } from '@/store/useAppStore';
import { AlarmRecord } from '@/types';

export default function Safety() {
  const [selectedSection, setSelectedSection] = useState(tunnelSections[0].id);
  const [activeTab, setActiveTab] = useState<'gas' | 'fire'>('gas');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const alarms = useAppStore((s) => s.alarms);
  const updateAlarmStatus = useAppStore((s) => s.updateAlarmStatus);

  const data = environmentData[selectedSection] || [];

  const gasChartData = data.slice(-12).map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    CH4: Number((d.ch4 * 100).toFixed(2)),
    CO: Number(d.co.toFixed(1)),
    H2S: Number(d.h2s.toFixed(2)),
  }));

  const alarmStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      today: alarms.filter((a) => a.timestamp.startsWith(today) || true).length,
      unhandled: alarms.filter((a) => a.status === 'unhandled').length,
      critical: alarms.filter((a) => a.level === 'critical').length,
      resolved: alarms.filter((a) => a.status === 'resolved').length,
    };
  }, [alarms]);

  const filterByLevel = (list: AlarmRecord[]) => {
    if (filterLevel === 'all') return list;
    return list.filter((a) => a.level === filterLevel);
  };

  const gasAlarms = filterByLevel(alarms.filter((a) => a.type === 'gas'));
  const fireWaterAlarms = filterByLevel(
    alarms.filter((a) => a.type === 'fire' || a.type === 'waterlogging')
  );

  const getAlarmIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <Flame size={18} className="text-red-500" />;
      case 'waterlogging':
        return <Droplets size={18} className="text-blue-500" />;
      case 'gas':
        return <Wind size={18} className="text-yellow-500" />;
      case 'temperature':
        return <AlertTriangle size={18} className="text-orange-500" />;
      default:
        return <Bell size={18} className="text-slate-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'border-red-500/50 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/5';
      default:
        return 'border-blue-500/50 bg-blue-500/5';
    }
  };

  const handleProcess = (alarm: AlarmRecord) => {
    setProcessingId(alarm.id);
    setTimeout(() => {
      if (alarm.status === 'unhandled') {
        updateAlarmStatus(alarm.id, 'processing', '当前处理人');
      } else if (alarm.status === 'processing') {
        updateAlarmStatus(alarm.id, 'resolved', '当前处理人');
      }
      setProcessingId(null);
    }, 400);
  };

  const getProcessButtonText = (status: AlarmRecord['status']) => {
    if (status === 'unhandled') return '立即处理';
    if (status === 'processing') return '标记已解决';
    return '已解决';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="今日告警"
          value={alarmStats.today}
          icon={AlertTriangle}
          suffix="条"
          color="red"
          trend={{ value: 16, isUp: true }}
        />
        <StatCard
          title="未处理告警"
          value={alarmStats.unhandled}
          icon={Bell}
          color="yellow"
          suffix="条"
        />
        <StatCard
          title="严重告警"
          value={alarmStats.critical}
          icon={ShieldAlert}
          color="red"
          suffix="条"
        />
        <StatCard
          title="已处理告警"
          value={alarmStats.resolved}
          icon={CheckCircle}
          color="green"
          suffix="条"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 border-b border-navy-600/50">
          <button
            onClick={() => setActiveTab('gas')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'gas'
                ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind size={18} />
            有害气体监测
          </button>
          <button
            onClick={() => setActiveTab('fire')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'fire'
                ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame size={18} />
            火灾水浸报警
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="h-9 px-3 bg-navy-800 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50"
          >
            {tunnelSections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-1 px-3 py-2 bg-navy-800 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors">
            <RefreshCw size={14} />
            刷新
          </button>
        </div>
      </div>

      {activeTab === 'gas' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard title="有害气体浓度趋势" icon={Wind}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gasChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} />
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
                      dataKey="CH4"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: '#F59E0B', r: 3 }}
                      name="甲烷 (%LEL)"
                    />
                    <Line
                      type="monotone"
                      dataKey="CO"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: '#EF4444', r: 3 }}
                      name="一氧化碳 (ppm)"
                    />
                    <Line
                      type="monotone"
                      dataKey="H2S"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', r: 3 }}
                      name="硫化氢 (ppm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: '甲烷 (CH4)',
                  value: '0.08',
                  unit: '%LEL',
                  status: 'normal',
                  threshold: '0.25',
                  color: 'text-yellow-500',
                  bgColor: 'bg-yellow-500/10',
                  borderColor: 'border-yellow-500/30',
                },
                {
                  name: '一氧化碳 (CO)',
                  value: '6.5',
                  unit: 'ppm',
                  status: 'normal',
                  threshold: '24',
                  color: 'text-red-500',
                  bgColor: 'bg-red-500/10',
                  borderColor: 'border-red-500/30',
                },
                {
                  name: '硫化氢 (H2S)',
                  value: '1.8',
                  unit: 'ppm',
                  status: 'warning',
                  threshold: '10',
                  color: 'text-purple-500',
                  bgColor: 'bg-purple-500/10',
                  borderColor: 'border-purple-500/30',
                },
              ].map((gas, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-lg border ${gas.bgColor} ${gas.borderColor}`}
                >
                  <p className="text-sm text-slate-300 mb-2">{gas.name}</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className={`text-3xl font-bold font-mono ${gas.color}`}>
                      {gas.value}
                    </span>
                    <span className="text-slate-400 text-sm">{gas.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <StatusBadge status={gas.status} size="sm" />
                    <span className="text-slate-400">
                      阈值: {gas.threshold} {gas.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="气体告警记录"
              icon={AlertTriangle}
              action={
                <div className="flex items-center gap-1">
                  <Filter size={14} className="text-slate-400" />
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="bg-transparent text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="all">全部级别</option>
                    <option value="critical">严重</option>
                    <option value="warning">警告</option>
                    <option value="info">提示</option>
                  </select>
                </div>
              }
            >
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {gasAlarms.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-sm">
                    暂无该级别告警
                  </div>
                ) : (
                  gasAlarms.map((alarm) => (
                    <div
                      key={alarm.id}
                      className={`p-3 rounded-lg border-l-4 ${getLevelColor(
                        alarm.level
                      )} border`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          {getAlarmIcon(alarm.type)}
                          <span className="text-sm font-medium text-white">
                            {alarm.description}
                          </span>
                        </div>
                        <StatusBadge status={alarm.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin size={10} />
                          {alarm.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {formatDateTime(alarm.timestamp).split(' ')[1]}
                        </span>
                      </div>
                      {alarm.status !== 'resolved' && (
                        <button
                          onClick={() => handleProcess(alarm)}
                          disabled={processingId === alarm.id}
                          className="w-full mt-2 py-1.5 bg-tech-blue/20 hover:bg-tech-blue/30 disabled:bg-navy-700 disabled:text-slate-500 rounded text-xs text-tech-blue transition-colors"
                        >
                          {processingId === alarm.id
                            ? '处理中...'
                            : getProcessButtonText(alarm.status)}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: '烟雾探测状态',
                  icon: Flame,
                  status: '正常',
                  statusColor: 'text-green-500',
                  count: 24,
                  normal: 24,
                  alarm: 0,
                  bgColor: 'bg-red-500/10',
                  iconColor: 'text-red-500',
                },
                {
                  title: '水浸监测状态',
                  icon: Droplets,
                  status: '预警',
                  statusColor: 'text-yellow-500',
                  count: 18,
                  normal: 17,
                  alarm: 1,
                  bgColor: 'bg-blue-500/10',
                  iconColor: 'text-blue-500',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`p-5 rounded-lg border border-navy-600/50 bg-navy-800/60`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.bgColor}`}
                        >
                          <Icon size={24} className={item.iconColor} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{item.title}</h3>
                          <p className={`text-sm ${item.statusColor}`}>
                            {item.status}
                          </p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-white font-mono">
                        {item.count}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">正常</span>
                        <span className="text-green-500 font-mono">
                          {item.normal}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">报警</span>
                        <span className="text-red-500 font-mono">
                          {item.alarm}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <SectionCard title="报警分布" icon={MapPin}>
              <div className="h-64 bg-navy-900/50 border border-navy-600/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-navy-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">报警点位分布图</p>
                  <p className="text-slate-500 text-xs mt-1">
                    展示各管廊段报警设备分布及状态
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="火灾水浸告警"
              icon={AlertTriangle}
              action={
                <div className="flex items-center gap-1">
                  <Filter size={14} className="text-slate-400" />
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="bg-transparent text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="all">全部级别</option>
                    <option value="critical">严重</option>
                    <option value="warning">警告</option>
                    <option value="info">提示</option>
                  </select>
                </div>
              }
            >
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {fireWaterAlarms.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-sm">
                    暂无该级别告警
                  </div>
                ) : (
                  fireWaterAlarms.map((alarm) => (
                    <div
                      key={alarm.id}
                      className={`p-3 rounded-lg border ${getLevelColor(
                        alarm.level
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {getAlarmIcon(alarm.type)}
                          <div>
                            <p className="text-sm font-medium text-white">
                              {alarm.description}
                            </p>
                            <p className="text-xs text-slate-400">
                              {alarm.location}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <StatusBadge status={alarm.status} size="sm" />
                        <span className="text-xs text-slate-500">
                          {formatDateTime(alarm.timestamp).split(' ')[1]}
                        </span>
                      </div>
                      {alarm.status !== 'resolved' && (
                        <button
                          onClick={() => handleProcess(alarm)}
                          disabled={processingId === alarm.id}
                          className="w-full mt-2 py-1.5 bg-tech-blue/20 hover:bg-tech-blue/30 disabled:bg-navy-700 disabled:text-slate-500 rounded text-xs text-tech-blue transition-colors"
                        >
                          {processingId === alarm.id
                            ? '处理中...'
                            : getProcessButtonText(alarm.status)}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
}
