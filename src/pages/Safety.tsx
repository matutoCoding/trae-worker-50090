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
  X,
  User,
  FileText,
  Send,
  History,
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
  const [gasStatusFilter, setGasStatusFilter] = useState<string>('all');
  const [fireStatusFilter, setFireStatusFilter] = useState<string>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showProcessModal, setShowProcessModal] = useState<AlarmRecord | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<AlarmRecord | null>(null);
  const [processForm, setProcessForm] = useState({
    handler: '',
    handleNote: '',
    handleResult: 'processing' as 'processing' | 'resolved',
  });

  const alarms = useAppStore((s) => s.alarms);
  const processAlarm = useAppStore((s) => s.processAlarm);

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

  const filterByStatus = (list: AlarmRecord[], statusFilter: string) => {
    if (statusFilter === 'all') return list;
    return list.filter((a) => a.status === statusFilter);
  };

  const gasAlarms = filterByStatus(filterByLevel(alarms.filter((a) => a.type === 'gas')), gasStatusFilter);
  const fireWaterAlarms = filterByStatus(filterByLevel(
    alarms.filter((a) => a.type === 'fire' || a.type === 'waterlogging')
  ), fireStatusFilter);

  const statusFilters = [
    { key: 'all', label: '全部' },
    { key: 'unhandled', label: '未处理' },
    { key: 'processing', label: '处理中' },
    { key: 'resolved', label: '已解决' },
  ];

  const getStatusFilterCount = (list: AlarmRecord[], key: string) => {
    if (key === 'all') return list.length;
    return list.filter(a => a.status === key).length;
  };

  const getProcessRecordColor = (handleResult: string) => {
    if (handleResult === 'resolved') return { bg: 'bg-green-500', text: '已解决', badge: 'bg-green-500/10 text-green-500 border-green-500/30' };
    if (handleResult === 'processing') return { bg: 'bg-blue-500', text: '处理中', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/30' };
    return { bg: 'bg-navy-500', text: '告警', badge: 'bg-navy-500/10 text-slate-300 border-navy-500/30' };
  };

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

  const getLevelText = (level: string) => {
    switch (level) {
      case 'critical':
        return '严重';
      case 'warning':
        return '警告';
      default:
        return '提示';
    }
  };

  const renderLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/10 text-red-500 border-red-500/30',
      warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      info: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded border ${colors[level] || ''}`}>
        {getLevelText(level)}
      </span>
    );
  };

  const handleOpenProcess = (alarm: AlarmRecord) => {
    setShowProcessModal(alarm);
    setProcessForm({
      handler: alarm.handler || '',
      handleNote: '',
      handleResult: alarm.status === 'processing' ? 'resolved' : 'processing',
    });
  };

  const handleSubmitProcess = () => {
    if (!showProcessModal || !processForm.handler.trim() || !processForm.handleNote.trim()) return;
    setProcessingId(showProcessModal.id);
    setTimeout(() => {
      processAlarm(showProcessModal.id, {
        handler: processForm.handler.trim(),
        handleNote: processForm.handleNote.trim(),
        handleResult: processForm.handleResult,
      });
      setProcessingId(null);
      setShowProcessModal(null);
      setProcessForm({ handler: '', handleNote: '', handleResult: 'processing' });
    }, 300);
  };

  const getProcessButtonText = (status: AlarmRecord['status']) => {
    if (status === 'unhandled') return '立即处理';
    if (status === 'processing') return '继续处理';
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
              <div className="flex items-center gap-1 mb-3 flex-wrap border-b border-navy-600/50 pb-2">
                {statusFilters.map((sf) => (
                  <button
                    key={sf.key}
                    onClick={() => setGasStatusFilter(sf.key)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                      gasStatusFilter === sf.key
                        ? 'bg-tech-blue/20 text-tech-blue border border-tech-blue/30'
                        : 'text-slate-400 hover:text-white hover:bg-navy-700/50 border border-transparent'
                    }`}
                  >
                    {sf.label}
                    <span className={`text-[10px] ${gasStatusFilter === sf.key ? 'text-tech-blue' : 'text-slate-500'} font-mono`}>
                      ({getStatusFilterCount(alarms.filter((a) => a.type === 'gas'), sf.key})
                    </span>
                  </button>
                ))}
              </div>
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
                        <div className="flex items-center gap-1">
                          {alarm.processRecords && alarm.processRecords.length > 0 && (
                            <button
                              onClick={() => setShowHistoryModal(alarm)}
                              className="p-1 text-slate-400 hover:text-white transition-colors"
                              title="查看处理记录"
                            >
                              <History size={12} />
                            </button>
                          )}
                          <StatusBadge status={alarm.status} size="sm" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        {renderLevelBadge(alarm.level)}
                        <span className="flex items-center gap-1">
                          <MapPin size={10} />
                          {alarm.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {formatDateTime(alarm.timestamp).split(' ')[1]}
                        </span>
                      </div>
                      {alarm.handler && (
                        <div className="text-xs text-slate-500 mt-1">
                          处理人: {alarm.handler}
                        </div>
                      )}
                      {alarm.status !== 'resolved' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleOpenProcess(alarm)}
                            disabled={processingId === alarm.id}
                            className="flex-1 py-1.5 bg-tech-blue/20 hover:bg-tech-blue/30 disabled:bg-navy-700 disabled:text-slate-500 rounded text-xs text-tech-blue transition-colors"
                          >
                            {processingId === alarm.id
                              ? '处理中...'
                              : getProcessButtonText(alarm.status)}
                          </button>
                          {alarm.processRecords && alarm.processRecords.length > 0 && (
                            <button
                              onClick={() => setShowHistoryModal(alarm)}
                              className="px-3 py-1.5 bg-navy-700/50 hover:bg-navy-700 rounded text-xs text-slate-300 transition-colors"
                            >
                              记录
                            </button>
                          )}
                        </div>
                      )}
                      {alarm.status === 'resolved' && alarm.processRecords && alarm.processRecords.length > 0 && (
                        <button
                          onClick={() => setShowHistoryModal(alarm)}
                          className="w-full mt-2 py-1.5 bg-navy-700/30 hover:bg-navy-700/50 rounded text-xs text-slate-400 transition-colors"
                        >
                          查看处理记录
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
              <div className="flex items-center gap-1 mb-3 flex-wrap border-b border-navy-600/50 pb-2">
                {statusFilters.map((sf) => (
                  <button
                    key={sf.key}
                    onClick={() => setFireStatusFilter(sf.key)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                      fireStatusFilter === sf.key
                        ? 'bg-tech-blue/20 text-tech-blue border border-tech-blue/30'
                        : 'text-slate-400 hover:text-white hover:bg-navy-700/50 border border-transparent'
                    }`}
                  >
                    {sf.label}
                    <span className={`text-[10px] ${fireStatusFilter === sf.key ? 'text-tech-blue' : 'text-slate-500'} font-mono`}>
                      ({getStatusFilterCount(alarms.filter((a) => a.type === 'fire' || a.type === 'waterlogging'), sf.key)})
                    </span>
                  </button>
                ))}
              </div>
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
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              {alarm.description}
                            </p>
                            <p className="text-xs text-slate-400">
                              {alarm.location}
                            </p>
                          </div>
                        </div>
                        {alarm.processRecords && alarm.processRecords.length > 0 && (
                          <button
                            onClick={() => setShowHistoryModal(alarm)}
                            className="p-1 text-slate-400 hover:text-white transition-colors flex-shrink-0"
                            title="查看处理记录"
                          >
                            <History size={12} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          {renderLevelBadge(alarm.level)}
                          <StatusBadge status={alarm.status} size="sm" />
                        </div>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(alarm.timestamp).split(' ')[1]}
                        </span>
                      </div>
                      {alarm.handler && (
                        <div className="text-xs text-slate-500 mt-1">
                          处理人: {alarm.handler}
                        </div>
                      )}
                      {alarm.status !== 'resolved' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleOpenProcess(alarm)}
                            disabled={processingId === alarm.id}
                            className="flex-1 py-1.5 bg-tech-blue/20 hover:bg-tech-blue/30 disabled:bg-navy-700 disabled:text-slate-500 rounded text-xs text-tech-blue transition-colors"
                          >
                            {processingId === alarm.id
                              ? '处理中...'
                              : getProcessButtonText(alarm.status)}
                          </button>
                          {alarm.processRecords && alarm.processRecords.length > 0 && (
                            <button
                              onClick={() => setShowHistoryModal(alarm)}
                              className="px-3 py-1.5 bg-navy-700/50 hover:bg-navy-700 rounded text-xs text-slate-300 transition-colors"
                            >
                              记录
                            </button>
                          )}
                        </div>
                      )}
                      {alarm.status === 'resolved' && alarm.processRecords && alarm.processRecords.length > 0 && (
                        <button
                          onClick={() => setShowHistoryModal(alarm)}
                          className="w-full mt-2 py-1.5 bg-navy-700/30 hover:bg-navy-700/50 rounded text-xs text-slate-400 transition-colors"
                        >
                          查看处理记录
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

      {showProcessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-navy-800 border border-navy-600 rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-600">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <ShieldAlert size={18} className="text-yellow-500" />
                告警处置
              </h3>
              <button
                onClick={() => {
                  setShowProcessModal(null);
                  setProcessForm({ handler: '', handleNote: '', handleResult: 'processing' });
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAlarmIcon(showProcessModal.type)}
                    <span className="text-white font-medium">{showProcessModal.description}</span>
                  </div>
                  {renderLevelBadge(showProcessModal.level)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div>
                    <span className="text-slate-400">位置: </span>
                    <span className="text-slate-300">{showProcessModal.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">告警时间: </span>
                    <span className="text-slate-300">{formatDateTime(showProcessModal.timestamp)}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-navy-600/50">
                  <StatusBadge status={showProcessModal.status} />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 block mb-1">
                  处置结果 <span className="text-red-500">*</span>
                </label>
                <select
                  value={processForm.handleResult}
                  onChange={(e) =>
                    setProcessForm({
                      ...processForm,
                      handleResult: e.target.value as 'processing' | 'resolved',
                    })
                  }
                  className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50"
                >
                  <option value="processing">标记为处理中</option>
                  <option value="resolved">标记为已解决</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300 block mb-1">
                  处理人 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={processForm.handler}
                    onChange={(e) =>
                      setProcessForm({ ...processForm, handler: e.target.value })
                    }
                    className="w-full h-9 pl-8 pr-3 bg-navy-900 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50"
                    placeholder="请输入处理人姓名"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 block mb-1">
                  处理说明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={processForm.handleNote}
                  onChange={(e) =>
                    setProcessForm({ ...processForm, handleNote: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50 resize-none"
                  placeholder="请详细描述处置措施和结果..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-navy-600 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowProcessModal(null);
                  setProcessForm({ handler: '', handleNote: '', handleResult: 'processing' });
                }}
                className="px-4 py-2 bg-navy-700/50 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitProcess}
                disabled={!processForm.handler.trim() || !processForm.handleNote.trim()}
                className="px-4 py-2 bg-tech-blue text-white text-sm rounded-md hover:bg-tech-blue/90 disabled:bg-navy-700 disabled:text-slate-500 transition-colors flex items-center gap-1"
              >
                <Send size={14} />
                提交处置
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-navy-800 border border-navy-600 rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-600">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <FileText size={18} className="text-tech-blue" />
                处置记录
              </h3>
              <button
                onClick={() => setShowHistoryModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-md mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {getAlarmIcon(showHistoryModal.type)}
                  <span className="text-white font-medium">{showHistoryModal.description}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {showHistoryModal.location} · {formatDateTime(showHistoryModal.timestamp)}
                </div>
              </div>

              {(() => {
                const records = showHistoryModal.processRecords || [];
                const allSteps: Array<{
                  id: string;
                  type: 'alarm' | 'processing' | 'resolved';
                  title: string;
                  operator?: string;
                  time: string;
                  note?: string;
                }> = [
                  {
                    id: 'alarm-root',
                    type: 'alarm',
                    title: '告警发生',
                    time: showHistoryModal.timestamp,
                    note: showHistoryModal.description,
                  },
                  ...[...records].reverse().map((r) => ({
                    id: r.id,
                    type: r.handleResult as 'processing' | 'resolved',
                    title: r.handleResult === 'resolved' ? '处置完成（已解决）' : '处置记录（处理中）',
                    operator: r.handler,
                    time: r.handleTime,
                    note: r.handleNote,
                  })),
                ];
                const totalSteps = allSteps.length;
                return (
                  <div className="relative pl-5">
                    {allSteps.map((step, idx) => {
                      const dotColor =
                        step.type === 'alarm' ? 'bg-red-500'
                          : step.type === 'resolved' ? 'bg-green-500'
                          : 'bg-blue-500';
                      const { badge } = getProcessRecordColor(step.type);
                      return (
                        <div key={step.id} className="relative pb-5 last:pb-0">
                          {idx < totalSteps - 1 && (
                            <div className="absolute left-[-14px] top-4 w-0.5 h-full bg-navy-600" />
                          )}
                          <div className={`absolute left-[-18px] top-0 w-3 h-3 rounded-full border-2 border-navy-800 ${dotColor}`} />
                          <div className="bg-navy-900/50 border border-navy-600/50 rounded-md p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded border ${badge}`}>
                                {step.title}
                              </span>
                              <span className="text-xs text-slate-500 font-mono">
                                {formatDateTime(step.time)}
                              </span>
                            </div>
                            {step.operator && (
                              <p className="text-xs text-slate-400">
                                操作人: <span className="text-slate-300">{step.operator}</span>
                              </p>
                            )}
                            {step.note && (
                              <p className="text-xs text-slate-300 mt-1 p-2 bg-navy-800/60 rounded">
                                {step.note}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            <div className="px-6 py-4 border-t border-navy-600 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(null)}
                className="px-4 py-2 bg-navy-700/50 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
