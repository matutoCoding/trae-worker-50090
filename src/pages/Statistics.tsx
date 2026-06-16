import { useState, useMemo } from 'react';
import {
  BarChart3,
  Users,
  DollarSign,
  FileBarChart,
  Building2,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Download,
  Filter,
  Cable,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import SectionCard from '@/components/cards/SectionCard';
import StatCard from '@/components/cards/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { tenantUnits, billRecords, feeStats, operationStats, monthlyData, typeDistribution } from '@/data/statistics';
import { formatCurrency } from '@/utils/format';
import { useAppStore } from '@/store/useAppStore';

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export default function Statistics() {
  const pipelines = useAppStore((s) => s.pipelines);
  const [activeTab, setActiveTab] = useState<'units' | 'billing' | 'report'>('units');

  const unitsWithPipelineCount = useMemo(() => {
    return tenantUnits.map((unit) => {
      const unitPipelineCount = pipelines.filter(
        (p) => p.owner === unit.name && p.approvalStatus === 'approved'
      ).length;
      return {
        ...unit,
        pipelineCount: unitPipelineCount > 0 ? unitPipelineCount : unit.pipelineCount,
      };
    });
  }, [pipelines]);

  const totalPipelinesByOwner = useMemo(() => {
    return unitsWithPipelineCount.reduce((sum, u) => sum + u.pipelineCount, 0);
  }, [unitsWithPipelineCount]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="入廊单位"
          value={tenantUnits.length}
          icon={Users}
          suffix="家"
          color="blue"
        />
        <StatCard
          title="入廊管线总数"
          value={totalPipelinesByOwner}
          icon={Cable}
          suffix="条"
          color="blue"
        />
        <StatCard
          title="本月收入"
          value={(feeStats.monthlyTotal / 10000).toFixed(1)}
          icon={DollarSign}
          suffix="万元"
          color="green"
          trend={{ value: 8.5, isUp: true }}
        />
        <StatCard
          title="收缴率"
          value={feeStats.collectionRate}
          icon={CheckCircle}
          suffix="%"
          color="yellow"
        />
        <StatCard
          title="安全运行"
          value={operationStats.safetyDays}
          icon={TrendingUp}
          suffix="天"
          color="purple"
          trend={{ value: 100, isUp: true }}
        />
      </div>

      <div className="flex gap-1 border-b border-navy-600/50">
        <button
          onClick={() => setActiveTab('units')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'units'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users size={14} className="inline mr-1.5" />
          入廊单位管理
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'billing'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign size={14} className="inline mr-1.5" />
          有偿使用计费
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'report'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileBarChart size={14} className="inline mr-1.5" />
          运行报表
        </button>
      </div>

      {activeTab === 'units' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              <Users size={16} className="text-tech-blue" />
              入廊单位列表
            </h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-navy-700/50 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors">
                <Filter size={14} />
                筛选
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-navy-700/50 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors">
                <Download size={14} />
                导出
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {unitsWithPipelineCount.map((unit) => (
              <SectionCard key={unit.id} className="p-0">
                <div className="p-4 border-b border-navy-600/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-tech-blue/10 flex items-center justify-center">
                        <Building2 size={20} className="text-tech-blue" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{unit.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {unit.type === 'power' && '电力单位'}
                          {unit.type === 'gas' && '燃气单位'}
                          {unit.type === 'water' && '供水单位'}
                          {unit.type === 'communication' && '通信单位'}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={unit.status} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">入廊管线</p>
                      <p className="text-lg font-semibold text-tech-blue">{unit.pipelineCount} 条</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">常驻人员</p>
                      <p className="text-lg font-semibold text-white">{unit.personnelCount} 人</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">年度费用</p>
                      <p className="text-lg font-semibold text-green-500">{formatCurrency(unit.fee)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">合同状态</p>
                      <p className={`text-sm font-medium ${
                        unit.status === 'active' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {unit.status === 'active' ? '履行中' : '已过期'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-navy-600/50 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Phone size={14} className="text-slate-500" />
                      {unit.contactPerson} · {unit.contactPhone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Calendar size={14} className="text-slate-500" />
                      合同期限：{unit.contractStart} 至 {unit.contractEnd}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button className="px-3 py-1.5 bg-navy-700/50 border border-navy-600 rounded-md text-xs text-slate-300 hover:bg-navy-700 transition-colors">
                      查看详情
                    </button>
                    <button className="px-3 py-1.5 bg-tech-blue text-white text-xs rounded-md hover:bg-tech-blue/90 transition-colors">
                      续签合同
                    </button>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <SectionCard title="费用统计" icon={BarChart3}>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feeStats.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#24426B" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F2C59',
                          border: '1px solid #24426B',
                          borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="管廊使用费" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="维护服务费" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </div>

            <div>
              <SectionCard title="管线类型占比" icon={PieChart}>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {typeDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F2C59',
                          border: '1px solid #24426B',
                          borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {typeDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[index] }}
                      />
                      <span className="text-xs text-slate-300">{item.name}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>

          <SectionCard title="账单记录" icon={FileBarChart}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-600/50 bg-navy-900/30">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      账单编号
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      单位名称
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      费用类型
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      金额
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      账期
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      状态
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-navy-600/30 hover:bg-navy-700/20 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {record.billNo}
                      </td>
                      <td className="py-3 px-4 text-white">{record.unitName}</td>
                      <td className="py-3 px-4 text-slate-300">{record.feeType}</td>
                      <td className="py-3 px-4 text-white font-mono">
                        {formatCurrency(record.amount)}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{record.period}</td>
                      <td className="py-3 px-4">
                        {record.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-green-500 bg-green-500/10 border border-green-500/30 rounded">
                            <CheckCircle size={12} />
                            已支付
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/30 rounded">
                            <Clock size={12} />
                            待支付
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-tech-blue hover:underline text-xs">
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="管廊使用率趋势" icon={TrendingUp}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#24426B" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F2C59',
                        border: '1px solid #24426B',
                        borderRadius: '8px',
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="使用率"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="巡检次数"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="异常报警统计" icon={XCircle}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorAlarm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#24426B" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F2C59',
                        border: '1px solid #24426B',
                        borderRadius: '8px',
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="异常报警"
                      stroke="#EF4444"
                      strokeWidth={2}
                      fill="url(#colorAlarm)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SectionCard title="运行指标" icon={BarChart3}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">管廊使用率</span>
                  <span className="text-lg font-semibold text-white">78.5%</span>
                </div>
                <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div className="h-full bg-tech-blue rounded-full" style={{ width: '78.5%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">设备完好率</span>
                  <span className="text-lg font-semibold text-green-500">99.2%</span>
                </div>
                <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '99.2%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">应急响应率</span>
                  <span className="text-lg font-semibold text-yellow-500">95.0%</span>
                </div>
                <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '95%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">隐患整改率</span>
                  <span className="text-lg font-semibold text-white">88.3%</span>
                </div>
                <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '88.3%' }} />
                </div>
              </div>
            </SectionCard>

            <div className="lg:col-span-2">
              <SectionCard title="运营概览" icon={FileBarChart}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-navy-700/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{operationStats.totalInspections}</p>
                    <p className="text-xs text-slate-400 mt-1">巡检次数</p>
                  </div>
                  <div className="p-3 bg-navy-700/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-500">{operationStats.abnormalCount}</p>
                    <p className="text-xs text-slate-400 mt-1">发现异常</p>
                  </div>
                  <div className="p-3 bg-navy-700/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-500">{operationStats.resolvedCount}</p>
                    <p className="text-xs text-slate-400 mt-1">已处理</p>
                  </div>
                  <div className="p-3 bg-navy-700/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-500">{operationStats.pendingCount}</p>
                    <p className="text-xs text-slate-400 mt-1">待处理</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-navy-600/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">累计安全运行天数</span>
                    <span className="text-white font-mono text-lg">{operationStats.safetyDays} 天</span>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
