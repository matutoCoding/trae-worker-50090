import { useState } from 'react';
import {
  ClipboardCheck,
  Bot,
  UserCheck,
  MapPin,
  Clock,
  AlertTriangle,
  Play,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import SectionCard from '@/components/cards/SectionCard';
import StatCard from '@/components/cards/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  inspectionRecords,
  checkPoints,
  inspectors,
  robotStats,
} from '@/data/inspection';
import { formatDateTime } from '@/utils/format';

export default function Inspection() {
  const [activeTab, setActiveTab] = useState<'robot' | 'manual'>('robot');

  const robotRecords = inspectionRecords.filter((r) => r.type === 'robot');
  const manualRecords = inspectionRecords.filter((r) => r.type === 'manual');
  const currentRecords = activeTab === 'robot' ? robotRecords : manualRecords;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={activeTab === 'robot' ? '机器人数量' : '巡检人员'}
          value={activeTab === 'robot' ? robotStats.total : inspectors.length}
          icon={activeTab === 'robot' ? Bot : UserCheck}
          suffix={activeTab === 'robot' ? '台' : '人'}
          color="blue"
        />
        <StatCard
          title="今日任务"
          value={activeTab === 'robot' ? '12' : '8'}
          icon={ClipboardCheck}
          suffix="次"
          color="green"
        />
        <StatCard
          title="已完成"
          value={activeTab === 'robot' ? '8' : '5'}
          icon={CheckCircle}
          suffix="次"
          color="yellow"
        />
        <StatCard
          title="异常发现"
          value={activeTab === 'robot' ? '3' : '1'}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="flex gap-1 border-b border-navy-600/50">
        <button
          onClick={() => setActiveTab('robot')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'robot'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bot size={18} />
          机器人巡检
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck size={18} />
          人工巡检打卡
        </button>
      </div>

      {activeTab === 'robot' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              title="巡检任务"
              icon={ClipboardCheck}
              action={
                <button className="flex items-center gap-1 px-3 py-1.5 bg-tech-blue text-white text-sm rounded-md hover:bg-tech-blue/90 transition-colors">
                  <Play size={14} />
                  新建任务
                </button>
              }
            >
              <div className="space-y-3">
                {robotRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 bg-navy-900/50 border border-navy-600/50 rounded-lg hover:border-navy-500/70 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">
                          {record.taskName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {record.sectionIds.length} 个管廊段 ·{' '}
                          {record.checkpoints} 个检查点
                        </p>
                      </div>
                      <StatusBadge status={record.status} size="sm" />
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>巡检进度</span>
                        <span>
                          {record.completedCheckpoints}/{record.checkpoints}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-tech-blue rounded-full transition-all"
                          style={{
                            width: `${((record.completedCheckpoints || 0) / (record.checkpoints || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={12} />
                        <span>开始: {record.startTime.split(' ')[1]}</span>
                      </div>
                      {record.abnormalities &&
                      record.abnormalities.length > 0 ? (
                        <div className="flex items-center gap-1 text-red-500">
                          <AlertTriangle size={12} />
                          <span>
                            {record.abnormalities.length} 处异常
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-500">
                          <CheckCircle size={12} />
                          <span>一切正常</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="巡检轨迹" icon={MapPin}>
              <div className="h-64 bg-navy-900/50 border border-navy-600/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-navy-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">
                    巡检轨迹地图展示区域
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    展示机器人巡检路径和实时位置
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="机器人状态" icon={Bot}>
              <div className="space-y-3">
                {[
                  { name: '巡检机器人1号', status: 'online', battery: 85 },
                  { name: '巡检机器人2号', status: 'online', battery: 62 },
                  { name: '巡检机器人3号', status: 'charging', battery: 30 },
                  { name: '巡检机器人4号', status: 'online', battery: 91 },
                ].map((robot, i) => (
                  <div
                    key={i}
                    className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bot
                          size={18}
                          className={
                            robot.status === 'online'
                              ? 'text-green-500'
                              : 'text-yellow-500'
                          }
                        />
                        <span className="text-sm text-white">{robot.name}</span>
                      </div>
                      <StatusBadge status={robot.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            robot.battery > 50
                              ? 'bg-green-500'
                              : robot.battery > 20
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${robot.battery}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400 w-10 text-right">
                        {robot.battery}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="检查点分布" icon={MapPin}>
              <div className="space-y-2">
                {checkPoints.slice(0, 6).map((point) => (
                  <div
                    key={point.id}
                    className="flex items-center justify-between p-2 hover:bg-navy-700/30 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          point.status === 'normal'
                            ? 'bg-green-500'
                            : 'bg-red-500 animate-pulse'
                        }`}
                      ></div>
                      <span className="text-sm text-white">{point.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {point.location}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              title="人工巡检记录"
              icon={ClipboardCheck}
              action={
                <button className="flex items-center gap-1 px-3 py-1.5 bg-tech-blue text-white text-sm rounded-md hover:bg-tech-blue/90 transition-colors">
                  <FileText size={14} />
                  生成巡检报告
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-600/50 bg-navy-900/30">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        任务名称
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        巡检人员
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        开始时间
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        检查点
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        状态
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        异常
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-navy-600/30 hover:bg-navy-700/20"
                      >
                        <td className="py-3 px-4 text-white">
                          {record.taskName}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {record.inspector || '-'}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono">
                          {record.startTime.split(' ')[1]}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {record.completedCheckpoints}/{record.checkpoints}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={record.status} size="sm" />
                        </td>
                        <td className="py-3 px-4">
                          {record.abnormalities &&
                          record.abnormalities.length > 0 ? (
                            <span className="text-red-500 text-sm">
                              {record.abnormalities.length} 处
                            </span>
                          ) : (
                            <span className="text-green-500 text-sm">无</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard title="今日排班" icon={Calendar}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inspectors.map((person) => (
                  <div
                    key={person.id}
                    className="p-4 bg-navy-900/50 border border-navy-600/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-tech-blue/20 rounded-full flex items-center justify-center">
                        <span className="text-tech-blue font-medium text-sm">
                          {person.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {person.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {person.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {person.department}
                      </span>
                      <StatusBadge status={person.status} size="sm" />
                    </div>
                    {person.lastLocation && (
                      <div className="mt-2 pt-2 border-t border-navy-600/30">
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin size={10} />
                          {person.lastLocation}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {person.lastUpdate}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="巡检打卡点" icon={MapPin}>
              <div className="space-y-2">
                {checkPoints.map((point) => (
                  <div
                    key={point.id}
                    className="flex items-center justify-between p-3 bg-navy-900/50 border border-navy-600/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          point.status === 'normal'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-white">{point.name}</p>
                        <p className="text-xs text-slate-400">{point.code}</p>
                      </div>
                    </div>
                    <StatusBadge status={point.status} size="sm" />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="巡检统计">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">本月巡检次数</span>
                  <span className="text-xl font-semibold text-white">35次</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">巡检完成率</span>
                  <span className="text-xl font-semibold text-green-500">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">发现异常数</span>
                  <span className="text-xl font-semibold text-yellow-500">7处</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">已整改完成</span>
                  <span className="text-xl font-semibold text-white">5处</span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
}
