import { useState } from 'react';
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

export default function Statistics() {
  const [activeTab, setActiveTab] = useState<'units' | 'billing' | 'report'>('units');

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
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'units'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 size={18} />
          入廊单位管理
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'billing'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign size={18} />
          有偿使用计费
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'report'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileBarChart size={18} />
          运行报表
        </button>
      </div>

      {activeTab === 'units' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              title="入廊单位"
              icon={Building2}
              action={
                <button className="flex items-center gap-1 text-xs text-tech-blue hover:underline">
                  + 新增单位
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tenantUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-5 bg-navy-900/50 border border-navy-600/50 rounded-lg hover:border-navy-500/70 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{unit.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {unit.type === 'power'
                            ? '电力'
                            : unit.type === 'gas'
                            ? '燃气'
                            : unit.type === 'water'
                            ? '给水'
                            : unit.type === 'communication'
                            ? '通信'
                            : '其他'}
                        </p>
                      </div>
                      <StatusBadge status={unit.status} size="sm" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone size={14} />
                        <span>{unit.contactPerson} · {unit.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} />
                        <span>合同: {unit.contractStart} ~ {unit.contractEnd}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-navy-600/30 flex items-center justify-between">
                      <div className="flex gap-4 text-xs">
                        <div>
                          <span className="text-slate-400">管线</span>
                          <span className="text-white font-medium ml-1">
                            {unit.pipelineCount}条
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">人员</span>
                          <span className="text-white font-medium ml-1">
                            {unit.personnelCount}人
                          </span>
                        </div>
                      </div>
                      <span className="text-tech-blue font-medium">
                        {formatCurrency(unit.fee)}/年
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="单位类型分布">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
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

            <SectionCard title="合同到期提醒">
              <div className="space-y-3">
                {tenantUnits
                  .filter((u) => u.status !== 'active')
                  .map((unit) => (
                    <div
                      key={unit.id}
                      className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white">{unit.name}</span>
                        <StatusBadge status={unit.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-400">
                        到期日: {unit.contractEnd}
                      </p>
                    </div>
                  ))}
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              title="账单管理"
              icon={DollarSign}
              action={
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-slate-400" />
                  <select className="bg-transparent text-xs text-slate-300 focus:outline-none">
                    <option>全部状态</option>
                    <option>已缴费</option>
                    <option>未缴费</option>
                    <option>逾期</option>
                  </select>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-600/50 bg-navy-900/30">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        单位名称
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        账期
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        金额
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        到期日
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
                    {billRecords.map((bill) => (
                      <tr
                        key={bill.id}
                        className="border-b border-navy-600/30 hover:bg-navy-700/20"
                      >
                        <td className="py-3 px-4 text-white">{bill.unitName}</td>
                        <td className="py-3 px-4 text-slate-300">{bill.period}</td>
                        <td className="py-3 px-4 text-white font-mono font-medium">
                          {formatCurrency(bill.amount)}
                        </td>
                        <td className="py-3 px-4 text-slate-300">{bill.dueDate}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={bill.status} size="sm" />
                        </td>
                        <td className="py-3 px-4">
                          {bill.status === 'unpaid' && (
                            <button className="text-xs text-tech-blue hover:underline">
                              发送催缴
                            </button>
                          )}
                          {bill.status === 'paid' && (
                            <button className="text-xs text-slate-400 hover:text-white">
                              查看凭证
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard title="收入趋势" icon={TrendingUp}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: '1月', 收入: 12.5 },
                    { month: '2月', 收入: 11.8 },
                    { month: '3月', 收入: 13.2 },
                    { month: '4月', 收入: 12.9 },
                    { month: '5月', 收入: 14.1 },
                    { month: '6月', 收入: 14.35 },
                  ]}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
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
                    <Area
                      type="monotone"
                      dataKey="收入"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                      name="收入(万元)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <StatCard
              title="本月应收"
              value={(feeStats.monthlyTotal / 10000).toFixed(2)}
              icon={DollarSign}
              suffix="万元"
              color="blue"
            />
            <StatCard
              title="已收金额"
              value={(feeStats.paid / 10000).toFixed(2)}
              icon={CheckCircle}
              suffix="万元"
              color="green"
            />
            <StatCard
              title="待收金额"
              value={(feeStats.unpaid / 10000).toFixed(2)}
              icon={Clock}
              suffix="万元"
              color="yellow"
            />
            <StatCard
              title="逾期金额"
              value={(feeStats.overdue / 10000).toFixed(2)}
              icon={XCircle}
              suffix="万元"
              color="red"
            />
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select className="h-9 px-3 bg-navy-800 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50">
                <option>2026年</option>
                <option>2025年</option>
                <option>2024年</option>
              </select>
              <select className="h-9 px-3 bg-navy-800 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50">
                <option>全年度</option>
                <option>第一季度</option>
                <option>第二季度</option>
                <option>第三季度</option>
                <option>第四季度</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-tech-blue text-white text-sm rounded-md hover:bg-tech-blue/90 transition-colors">
              <Download size={16} />
              导出报表
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="运营指标统计" icon={BarChart3}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
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
                    <Bar dataKey="巡检次数" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="告警数量" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="维护工单" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="入廊人次趋势" icon={Users}>
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
                      dataKey="入廊人次"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="运行概览" icon={FileBarChart}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: '管廊数量', value: operationStats.totalSections, unit: '条' },
                { label: '管廊总长', value: operationStats.totalLength, unit: '公里' },
                { label: '管线数量', value: operationStats.totalPipelines, unit: '条' },
                { label: '入廊单位', value: operationStats.totalTenants, unit: '家' },
                { label: '设备总数', value: operationStats.equipmentCount, unit: '台' },
                { label: '利用率', value: operationStats.utilizationRate, unit: '%' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 bg-navy-900/50 border border-navy-600/50 rounded-lg text-center"
                >
                  <p className="text-2xl font-bold text-white font-mono">
                    {item.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
