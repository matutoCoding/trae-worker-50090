import { useState } from 'react';
import {
  Building2,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Ruler,
  Calendar,
  MapPin,
  Layers,
  CheckCircle,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import SectionCard from '@/components/cards/SectionCard';
import StatCard from '@/components/cards/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { tunnelSections, sectionStats } from '@/data/tunnel';
import { formatLength, getTypeText } from '@/utils/format';
import { TunnelSection } from '@/types';

export default function Ledger() {
  const [selectedSection, setSelectedSection] = useState<TunnelSection | null>(
    tunnelSections[0]
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredSections = tunnelSections.filter((s) => {
    const matchesSearch =
      s.name.includes(searchTerm) || s.code.includes(searchTerm);
    const matchesType = filterType === 'all' || s.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'fault':
        return <AlertTriangle size={14} className="text-red-500" />;
      case 'maintenance':
        return <Wrench size={14} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex gap-6">
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-navy-800/60 border border-navy-600/50 rounded-lg p-4">
          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="搜索管廊名称或编号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-navy-900/50 border border-navy-600 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-tech-blue/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 h-8 px-2 bg-navy-900/50 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50"
            >
              <option value="all">全部类型</option>
              <option value="comprehensive">综合管廊</option>
              <option value="power">电力管廊</option>
              <option value="gas">燃气管廊</option>
              <option value="water">给水管廊</option>
            </select>
          </div>
        </div>

        <div className="flex-1 bg-navy-800/60 border border-navy-600/50 rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-navy-600/50 flex items-center justify-between">
            <h3 className="font-medium text-white text-sm">管廊列表</h3>
            <span className="text-xs text-slate-400">
              共 {filteredSections.length} 条
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section)}
                className={`p-4 border-b border-navy-600/30 cursor-pointer transition-all ${
                  selectedSection?.id === section.id
                    ? 'bg-tech-blue/10 border-l-2 border-l-tech-blue'
                    : 'hover:bg-navy-700/30 border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2
                      size={16}
                      className="text-tech-blue flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {section.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {section.code}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-500 flex-shrink-0"
                  />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Ruler size={12} />
                    {formatLength(section.length)}
                  </span>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(section.status)}
                    <StatusBadge status={section.status} size="sm" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto">
        {selectedSection ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="管廊长度"
                value={formatLength(selectedSection.length)}
                icon={Ruler}
                color="blue"
              />
              <StatCard
                title="舱室数量"
                value={selectedSection.cabins.length}
                icon={Layers}
                color="green"
                suffix="个"
              />
              <StatCard
                title="层数"
                value={selectedSection.floors}
                icon={Building2}
                color="yellow"
                suffix="层"
              />
              <StatCard
                title="建设年份"
                value={selectedSection.buildDate.split('-')[0]}
                icon={Calendar}
                color="purple"
                suffix="年"
              />
            </div>

            <SectionCard title="基本信息" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    管廊名称
                  </label>
                  <p className="text-white">{selectedSection.name}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    管廊编号
                  </label>
                  <p className="text-white font-mono">{selectedSection.code}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    管廊类型
                  </label>
                  <p className="text-white">
                    {getTypeText(selectedSection.type)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    地理位置
                  </label>
                  <p className="text-white flex items-center gap-1">
                    <MapPin size={14} className="text-slate-400" />
                    {selectedSection.location}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    建设日期
                  </label>
                  <p className="text-white">{selectedSection.buildDate}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    运行状态
                  </label>
                  <StatusBadge status={selectedSection.status} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    断面尺寸
                  </label>
                  <p className="text-white">
                    {selectedSection.width}m × {selectedSection.height}m
                  </p>
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="text-xs text-slate-400 block mb-1">
                    包含舱室
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {selectedSection.cabins.map((cabin, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-navy-700/50 text-slate-300 rounded border border-navy-600"
                      >
                        {cabin}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="text-xs text-slate-400 block mb-1">
                    描述说明
                  </label>
                  <p className="text-white text-sm">
                    {selectedSection.description}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="舱室列表"
              icon={Layers}
              action={
                <button className="flex items-center gap-1 text-xs text-tech-blue hover:underline">
                  <Plus size={14} />
                  添加舱室
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-600/50">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        舱室名称
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        类型
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        长度(m)
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        断面尺寸
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        管线数量
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSection.cabins.map((cabin, index) => (
                      <tr
                        key={index}
                        className="border-b border-navy-600/30 hover:bg-navy-700/20"
                      >
                        <td className="py-3 px-4 text-white">{cabin}</td>
                        <td className="py-3 px-4 text-slate-300">
                          {cabin.includes('综合')
                            ? '综合'
                            : cabin.includes('电力')
                            ? '电力'
                            : cabin.includes('燃气')
                            ? '燃气'
                            : cabin.includes('污水')
                            ? '污水'
                            : '给水'}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono">
                          {selectedSection.length}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono">
                          {(selectedSection.width / selectedSection.cabins.length).toFixed(1)}m × {selectedSection.height}m
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {Math.floor(Math.random() * 8) + 2}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status="normal" size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-slate-400">请选择一个管廊查看详情</p>
          </div>
        )}
      </div>
    </div>
  );
}
