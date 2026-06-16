import { useState } from 'react';
import {
  Siren,
  Users,
  Package,
  Wrench,
  AlertTriangle,
  MapPin,
  Phone,
  FileText,
  Clock,
  ChevronRight,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import SectionCard from '@/components/cards/SectionCard';
import StatCard from '@/components/cards/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { emergencyPlans, emergencySupplies, equipments, equipmentStats } from '@/data/alarm';
import { formatDateTime } from '@/utils/format';

export default function Emergency() {
  const [activeTab, setActiveTab] = useState<'evacuation' | 'maintenance'>('evacuation');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <FlameIcon size={20} />;
      case 'gas':
        return <WindIcon size={20} />;
      case 'waterlogging':
        return <DropletsIcon size={20} />;
      case 'earthquake':
        return <AlertTriangle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fire':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'gas':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'waterlogging':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'earthquake':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      default:
        return 'bg-slate-500/20 text-slate-500 border-slate-500/30';
    }
  };

  const FlameIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  );

  const WindIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
    </svg>
  );

  const DropletsIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25C3 14.47 4.8 16.3 7 16.3z"/>
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
    </svg>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-navy-600/50">
        <button
          onClick={() => setActiveTab('evacuation')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'evacuation'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users size={18} />
          应急疏散
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'maintenance'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wrench size={18} />
          设备维保
        </button>
      </div>

      {activeTab === 'evacuation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard title="应急预案" icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-navy-500 ${
                      selectedPlan === plan.id
                        ? 'border-tech-blue bg-tech-blue/5'
                        : 'border-navy-600/50 bg-navy-900/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getTypeColor(
                            plan.type
                          )}`}
                        >
                          {getTypeIcon(plan.type)}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {plan.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {plan.level === 'level1'
                              ? '一级响应'
                              : plan.level === 'level2'
                              ? '二级响应'
                              : '三级响应'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-slate-500 flex-shrink-0"
                      />
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {plan.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-navy-600/30 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone size={12} />
                        {plan.responsiblePerson}
                      </span>
                      <span className="text-xs text-slate-400">
                        {plan.steps.length} 个步骤
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="疏散路线图" icon={MapPin}>
              <div className="h-64 bg-navy-900/50 border border-navy-600/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-navy-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">疏散路线示意图</p>
                  <p className="text-slate-500 text-xs mt-1">
                    展示各管廊段疏散路线和安全出口位置
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="应急物资" icon={Package}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-600/50 bg-navy-900/30">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        物资名称
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        类型
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        数量
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        存放位置
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        上次检查
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {emergencySupplies.map((supply) => (
                      <tr
                        key={supply.id}
                        className="border-b border-navy-600/30 hover:bg-navy-700/20"
                      >
                        <td className="py-3 px-4 text-white">
                          {supply.name}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {supply.type}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono">
                          {supply.quantity} {supply.unit}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {supply.location}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {supply.lastCheck}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={supply.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <StatCard
              title="应急联络人"
              value={8}
              icon={Users}
              suffix="人"
              color="yellow"
            />

            <SectionCard title="应急联络" icon={Phone}>
              <div className="space-y-3">
                {[
                  { name: '安全总监 - 李明', phone: '13900139000', role: '总指挥' },
                  { name: '运行部经理 - 王强', phone: '13900139001', role: '现场指挥' },
                  { name: '运维部经理 - 张伟', phone: '13900139002', role: '技术支持' },
                  { name: '消防队长 - 陈刚', phone: '13900139003', role: '消防救援' },
                  { name: '医疗组 - 刘芳', phone: '13900139004', role: '医疗救护' },
                ].map((contact, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-navy-900/50 border border-navy-600/50 rounded-lg hover:border-navy-500/70 transition-colors"
                  >
                    <div>
                      <p className="text-sm text-white font-medium">
                        {contact.name}
                      </p>
                      <p className="text-xs text-slate-400">{contact.role}</p>
                    </div>
                    <span className="text-sm text-tech-blue font-mono">
                      {contact.phone}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="人员统计" icon={Users}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">在岗人员</span>
                  <span className="text-lg font-semibold text-white">32人</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">管廊内人员</span>
                  <span className="text-lg font-semibold text-cyan-500">5人</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">已疏散人员</span>
                  <span className="text-lg font-semibold text-green-500">27人</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">失联人员</span>
                  <span className="text-lg font-semibold text-red-500">0人</span>
                </div>
              </div>
            </SectionCard>

            <button className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
              <Siren size={20} />
              启动一级应急响应
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="设备总数"
              value={equipmentStats.total}
              icon={Wrench}
              suffix="台"
              color="blue"
            />
            <StatCard
              title="正常运行"
              value={equipmentStats.normal}
              icon={CheckCircle}
              suffix="台"
              color="green"
            />
            <StatCard
              title="待维护"
              value={equipmentStats.dueMaintenance}
              icon={Clock}
              suffix="台"
              color="yellow"
            />
            <StatCard
              title="故障设备"
              value={equipmentStats.fault}
              icon={XCircle}
              suffix="台"
              color="red"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SectionCard
                title="设备列表"
                icon={Wrench}
                action={
                  <button className="flex items-center gap-1 text-xs text-tech-blue hover:underline">
                    + 新增设备
                  </button>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-navy-600/50 bg-navy-900/30">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          设备名称
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          编号
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          类型
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          位置
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          上次维护
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          下次维护
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          状态
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipments.map((eq) => (
                        <tr
                          key={eq.id}
                          className="border-b border-navy-600/30 hover:bg-navy-700/20"
                        >
                          <td className="py-3 px-4 text-white">
                            {eq.name}
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-mono">
                            {eq.code}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {eq.type}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {eq.location}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {eq.lastMaintenance}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {eq.nextMaintenance}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={eq.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard title="维保计划" icon={Calendar}>
                <div className="space-y-3">
                  {[
                    { eq: '通风机', date: '2026-06-20', type: '季度保养' },
                    { eq: '排水泵', date: '2026-06-22', type: '月度检查' },
                    { eq: '变压器', date: '2026-06-25', type: '半年检' },
                    { eq: '消防泵', date: '2026-06-28', type: '月度检查' },
                    { eq: '监测装置', date: '2026-07-01', type: '季度校准' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-navy-900/50 border border-navy-600/50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm text-white font-medium">
                          {item.eq}
                        </p>
                        <p className="text-xs text-slate-400">{item.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-300">{item.date}</p>
                        <p className="text-xs text-yellow-500">待执行</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="本月维保统计">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">计划维保</span>
                    <span className="text-lg font-semibold text-white">
                      {equipmentStats.thisMonthMaintenance}次
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">已完成</span>
                    <span className="text-lg font-semibold text-green-500">
                      8次
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">进行中</span>
                    <span className="text-lg font-semibold text-yellow-500">
                      2次
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">故障报修</span>
                    <span className="text-lg font-semibold text-red-500">
                      {equipmentStats.fault}次
                    </span>
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
