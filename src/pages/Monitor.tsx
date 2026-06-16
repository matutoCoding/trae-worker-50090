import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import {
  Thermometer,
  Droplets,
  Wind,
  Clock,
  AlertTriangle,
  Settings,
  RefreshCw,
} from 'lucide-react';
import SectionCard from '@/components/cards/SectionCard';
import StatCard from '@/components/cards/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { tunnelSections } from '@/data/tunnel';
import { environmentData, getThresholds } from '@/data/environment';
import { formatDateTime } from '@/utils/format';

export default function Monitor() {
  const [selectedSection, setSelectedSection] = useState(tunnelSections[0].id);
  const [currentTime, setCurrentTime] = useState(new Date());
  const thresholds = getThresholds();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const data = environmentData[selectedSection] || [];
  const latestData = data.length > 0 ? data[data.length - 1] : null;

  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    温度: Number(d.temperature.toFixed(1)),
    湿度: Number(d.humidity.toFixed(1)),
    氧气: Number(d.oxygen.toFixed(2)),
  }));

  const gaugeData = latestData
    ? [
        {
          label: '温度',
          value: latestData.temperature,
          unit: '℃',
          min: thresholds.temperature.min,
          max: thresholds.temperature.max,
          warningMin: thresholds.temperature.warningMin,
          warningMax: thresholds.temperature.warningMax,
          icon: Thermometer,
          color: '#0EA5E9',
        },
        {
          label: '湿度',
          value: latestData.humidity,
          unit: '%',
          min: thresholds.humidity.min,
          max: thresholds.humidity.max,
          warningMin: thresholds.humidity.warningMin,
          warningMax: thresholds.humidity.warningMax,
          icon: Droplets,
          color: '#10B981',
        },
        {
          label: '氧气浓度',
          value: latestData.oxygen,
          unit: '%',
          min: thresholds.oxygen.min,
          max: thresholds.oxygen.max,
          warningMin: thresholds.oxygen.warningMin,
          warningMax: thresholds.oxygen.warningMax,
          icon: Wind,
          color: '#F59E0B',
        },
      ]
    : [];

  const isValueNormal = (
    value: number,
    warningMin: number,
    warningMax: number
  ) => value >= warningMin && value <= warningMax;

  const GaugeDisplay = ({
    label,
    value,
    unit,
    min,
    max,
    color,
    icon: Icon,
    isNormal,
  }: {
    label: string;
    value: number;
    unit: string;
    min: number;
    max: number;
    color: string;
    icon: any;
    isNormal: boolean;
  }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    return (
      <div className="bg-navy-900/50 border border-navy-600/50 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Icon size={20} />
            </div>
            <span className="text-slate-300 font-medium">{label}</span>
          </div>
          <StatusBadge status={isNormal ? 'normal' : 'warning'} size="sm" />
        </div>
        <div className="text-center mb-4">
          <span
            className="text-4xl font-bold font-mono"
            style={{ color: isNormal ? color : '#EF4444' }}
          >
            {value.toFixed(1)}
          </span>
          <span className="text-slate-400 ml-1">{unit}</span>
        </div>
        <div className="relative">
          <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${clampedPercentage}%`,
                backgroundColor: isNormal ? color : '#EF4444',
                boxShadow: `0 0 8px ${isNormal ? color : '#EF4444'}80`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">选择管廊:</label>
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
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Clock size={14} />
            <span>{formatDateTime(currentTime)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-2 bg-navy-800 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors">
            <RefreshCw size={14} />
            刷新数据
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-navy-800 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors">
            <Settings size={14} />
            阈值设置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gaugeData.map((gauge, index) => (
          <GaugeDisplay
            key={index}
            label={gauge.label}
            value={gauge.value}
            unit={gauge.unit}
            min={gauge.min}
            max={gauge.max}
            color={gauge.color}
            icon={gauge.icon}
            isNormal={isValueNormal(
              gauge.value,
              gauge.warningMin,
              gauge.warningMax
            )}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="温湿度趋势" icon={Thermometer}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="humidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="温度"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fill="url(#tempGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="湿度"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#humidGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="氧气浓度趋势" icon={Wind}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={[19, 23]} />
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
                  dataKey="氧气"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="监测点位" icon={AlertTriangle}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['入口处', 'K1+000', 'K2+000', '出口处'].map((point, i) => (
            <div
              key={i}
              className="p-4 bg-navy-900/50 border border-navy-600/50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">{point}</span>
                <StatusBadge status="normal" size="sm" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">温度</span>
                  <span className="text-white font-mono">
                    {(20 + Math.random() * 5).toFixed(1)}℃
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">湿度</span>
                  <span className="text-white font-mono">
                    {(55 + Math.random() * 15).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">氧气</span>
                  <span className="text-white font-mono">
                    {(20.5 + Math.random() * 0.5).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
