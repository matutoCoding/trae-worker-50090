import { useState, useMemo } from 'react';
import {
  Cable,
  Zap,
  Flame,
  Droplets,
  Wifi,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  FileCheck,
  X,
  Save,
  XCircle,
  CheckCircle2,
  Clock,
  User,
  History,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import SectionCard from '@/components/cards/SectionCard';
import StatCard from '@/components/cards/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAppStore } from '@/store/useAppStore';
import { formatLength, getTypeText } from '@/utils/format';
import { Pipeline } from '@/types';

export default function PipelinePage() {
  const pipelines = useAppStore((s) => s.pipelines);
  const addPipeline = useAppStore((s) => s.addPipeline);
  const deletePipeline = useAppStore((s) => s.deletePipeline);
  const approvePipeline = useAppStore((s) => s.approvePipeline);
  const rejectPipeline = useAppStore((s) => s.rejectPipeline);
  const resubmitPipeline = useAppStore((s) => s.resubmitPipeline);

  const [activeTab, setActiveTab] = useState<string>('approved');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<Pipeline | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');

  const [formData, setFormData] = useState({
    name: '',
    type: 'power' as 'power' | 'gas' | 'water' | 'communication',
    diameter: 0,
    length: 0,
    owner: '',
    inDate: new Date().toISOString().split('T')[0],
    voltage: '',
    pressure: '',
    material: '',
    sectionIds: [] as string[],
    note: '',
  });

  const pipelineStats = useMemo(() => {
    const approved = pipelines.filter((p) => p.approvalStatus === 'approved');
    const pending = pipelines.filter((p) => p.approvalStatus === 'pending');
    const power = approved.filter((p) => p.type === 'power').length;
    const gas = approved.filter((p) => p.type === 'gas').length;
    const water = approved.filter((p) => p.type === 'water').length;
    const communication = approved.filter((p) => p.type === 'communication').length;
    const totalLength = approved.reduce((sum, p) => sum + p.length, 0);
    return {
      total: approved.length,
      power,
      gas,
      water,
      communication,
      totalLength,
      pending: pending.length,
    };
  }, [pipelines]);

  const tabs = [
    { key: 'approved', label: '已入廊管线', icon: Cable },
    { key: 'pending', label: '待审批登记', icon: Clock, badge: pipelineStats.pending },
    { key: 'power', label: '电力管线', icon: Zap },
    { key: 'gas', label: '燃气管线', icon: Flame },
    { key: 'water', label: '给水管线', icon: Droplets },
    { key: 'communication', label: '通信管线', icon: Wifi },
  ];

  const getFilteredPipelines = () => {
    let list: Pipeline[] = [];
    if (activeTab === 'approved') {
      list = pipelines.filter((p) => p.approvalStatus === 'approved');
    } else if (activeTab === 'pending') {
      list = pipelines.filter((p) => p.approvalStatus === 'pending' || p.approvalStatus === 'rejected');
    } else {
      list = pipelines.filter((p) => p.type === activeTab && p.approvalStatus === 'approved');
    }

    return list.filter((p) => {
      const matchesSearch =
        p.name.includes(searchTerm) ||
        p.code.includes(searchTerm) ||
        p.owner.includes(searchTerm);
      return matchesSearch;
    });
  };

  const filteredPipelines = getFilteredPipelines();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'power':
        return <Zap size={16} className="text-tech-blue" />;
      case 'gas':
        return <Flame size={16} className="text-yellow-500" />;
      case 'water':
        return <Droplets size={16} className="text-green-500" />;
      case 'communication':
        return <Wifi size={16} className="text-purple-500" />;
      default:
        return <Cable size={16} />;
    }
  };

  const typeColors: Record<string, string> = {
    power: 'bg-tech-blue/10 text-tech-blue border-tech-blue/30',
    gas: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    water: 'bg-green-500/10 text-green-500 border-green-500/30',
    communication: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  };

  const renderApprovalBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      approved: 'bg-green-500/10 text-green-500 border-green-500/30',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/30',
    };
    const labels: Record<string, string> = {
      pending: '待审批',
      approved: '已通过',
      rejected: '已驳回',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded border ${colors[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getApprovalActionInfo = (action: string) => {
    switch (action) {
      case 'submit':
        return { color: 'bg-yellow-500', label: '提交审批', badge: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' };
      case 'approve':
        return { color: 'bg-green-500', label: '审批通过', badge: 'bg-green-500/10 text-green-500 border-green-500/30' };
      case 'reject':
        return { color: 'bg-red-500', label: '审批驳回', badge: 'bg-red-500/10 text-red-500 border-red-500/30' };
      case 'resubmit':
        return { color: 'bg-blue-500', label: '重新提交', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/30' };
      default:
        return { color: 'bg-navy-500', label: action, badge: 'bg-navy-500/10 text-slate-300 border-navy-500/30' };
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'power',
      diameter: 0,
      length: 0,
      owner: '',
      inDate: new Date().toISOString().split('T')[0],
      voltage: '',
      pressure: '',
      material: '',
      sectionIds: [],
      note: '',
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setSelectedPipeline(null);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.owner.trim()) {
      alert('请填写管线名称和权属单位');
      return;
    }
    addPipeline(formData);
    setShowModal(false);
    setActiveTab('pending');
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条管线记录吗？')) {
      deletePipeline(id);
    }
  };

  const handleOpenApproval = (pipeline: Pipeline, type: 'approve' | 'reject') => {
    setShowApprovalModal(pipeline);
    setApprovalType(type);
    setApprovalNote('');
  };

  const handleSubmitApproval = () => {
    if (!showApprovalModal) return;
    if (approvalType === 'reject' && !approvalNote.trim()) {
      alert('请填写驳回原因');
      return;
    }
    if (approvalType === 'approve') {
      approvePipeline(showApprovalModal.id, '当前审批人', approvalNote.trim() || undefined);
    } else {
      rejectPipeline(showApprovalModal.id, '当前审批人', approvalNote.trim());
    }
    setShowApprovalModal(null);
    setApprovalNote('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="管线总数"
          value={pipelineStats.total}
          icon={Cable}
          suffix="条"
          color="blue"
        />
        <StatCard
          title="电力管线"
          value={pipelineStats.power}
          icon={Zap}
          suffix="条"
          color="yellow"
        />
        <StatCard
          title="燃气管线"
          value={pipelineStats.gas}
          icon={Flame}
          suffix="条"
          color="red"
        />
        <StatCard
          title="总长度"
          value={(pipelineStats.totalLength / 1000).toFixed(1)}
          icon={Droplets}
          suffix="公里"
          color="green"
        />
        <StatCard
          title="待审批"
          value={pipelineStats.pending}
          icon={Clock}
          suffix="条"
          color="yellow"
        />
      </div>

      <SectionCard
        title="管线管理"
        icon={Cable}
        action={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-tech-blue text-white text-sm rounded-md hover:bg-tech-blue/90 transition-colors"
          >
            <Plus size={14} />
            新增登记
          </button>
        }
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-1 border-b border-navy-600/50 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap relative ${
                    activeTab === tab.key
                      ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-0.5 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="搜索管线..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 h-8 pl-8 pr-3 bg-navy-900/50 border border-navy-600 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-tech-blue/50"
              />
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-navy-700/50 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors">
              <Filter size={14} />
              筛选
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-600/50 bg-navy-900/30">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">
                  管线名称
                </th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">
                  编号
                </th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">
                  类型
                </th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">
                  规格
                </th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">
                  长度
                </th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">
                  权属单位
                </th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">
                  入廊日期
                </th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">
                  审批状态
                </th>
                {activeTab === 'pending' && (
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    审批
                  </th>
                )}
                <th className="text-left py-3 px-4 text-slate-400 font-medium">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPipelines.map((pipeline) => (
                <tr
                  key={pipeline.id}
                  className="border-b border-navy-600/30 hover:bg-navy-700/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(pipeline.type)}
                      <span className="text-white font-medium">
                        {pipeline.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">
                    {pipeline.code}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${
                        typeColors[pipeline.type]
                      }`}
                    >
                      {getTypeText(pipeline.type)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {pipeline.diameter}mm
                    {pipeline.voltage && ` · ${pipeline.voltage}`}
                    {pipeline.pressure && ` · ${pipeline.pressure}`}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">
                    {formatLength(pipeline.length)}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {pipeline.owner}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {pipeline.inDate}
                  </td>
                  <td className="py-3 px-4">
                    {renderApprovalBadge(pipeline.approvalStatus)}
                  </td>
                  {activeTab === 'pending' && (
                    <td className="py-3 px-4">
                      {pipeline.approvalStatus === 'pending' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenApproval(pipeline, 'approve')}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-green-500 hover:bg-green-500/10 rounded transition-colors"
                          >
                            <CheckCircle2 size={12} />
                            通过
                          </button>
                          <button
                            onClick={() => handleOpenApproval(pipeline, 'reject')}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <XCircle size={12} />
                            驳回
                          </button>
                        </div>
                      )}
                      {pipeline.approvalStatus === 'rejected' && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            onClick={() => handleOpenApproval(pipeline, 'approve')}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-green-500 hover:bg-green-500/10 rounded transition-colors"
                          >
                            <CheckCircle2 size={12} />
                            重新审批
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('确认重新提交该管线至审批流程？')) {
                                resubmitPipeline(pipeline.id);
                              }
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                          >
                            <RotateCcw size={12} />
                            重新提交
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedPipeline(pipeline);
                          setShowModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-tech-blue hover:bg-navy-600/50 rounded transition-colors"
                        title="查看"
                      >
                        <Eye size={14} />
                      </button>
                      {pipeline.approvalStatus !== 'approved' && (
                        <>
                          <button
                            className="p-1.5 text-slate-400 hover:text-yellow-500 hover:bg-navy-600/50 rounded transition-colors"
                            title="编辑"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(pipeline.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-navy-600/50 rounded transition-colors"
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPipelines.length === 0 && (
                <tr>
                  <td
                    colSpan={activeTab === 'pending' ? 10 : 9}
                    className="py-8 text-center text-slate-400"
                  >
                    {activeTab === 'pending' ? '暂无待审批的管线登记' : '暂无管线数据'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-400">
            共 {filteredPipelines.length} 条记录
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 bg-navy-700/50 border border-navy-600 rounded text-slate-300 hover:bg-navy-700 transition-colors">
              上一页
            </button>
            <button className="px-3 py-1.5 bg-tech-blue text-white rounded">
              1
            </button>
            <button className="px-3 py-1.5 bg-navy-700/50 border border-navy-600 rounded text-slate-300 hover:bg-navy-700 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </SectionCard>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-navy-800 border border-navy-600 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-600">
              <h3 className="text-lg font-medium text-white">
                {selectedPipeline ? '管线详情' : '新增管线登记'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPipeline(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {selectedPipeline ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        管线名称
                      </label>
                      <p className="text-white">{selectedPipeline.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        管线编号
                      </label>
                      <p className="text-white font-mono">
                        {selectedPipeline.code}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        管线类型
                      </label>
                      <p className="text-white">
                        {getTypeText(selectedPipeline.type)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        管径
                      </label>
                      <p className="text-white">{selectedPipeline.diameter}mm</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        长度
                      </label>
                      <p className="text-white">
                        {formatLength(selectedPipeline.length)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        权属单位
                      </label>
                      <p className="text-white">{selectedPipeline.owner}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        入廊日期
                      </label>
                      <p className="text-white">{selectedPipeline.inDate}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        运行状态
                      </label>
                      <StatusBadge status={selectedPipeline.status} />
                    </div>
                  </div>
                  {selectedPipeline.voltage && (
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        电压等级
                      </label>
                      <p className="text-white">{selectedPipeline.voltage}</p>
                    </div>
                  )}
                  {selectedPipeline.pressure && (
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        压力等级
                      </label>
                      <p className="text-white">{selectedPipeline.pressure}</p>
                    </div>
                  )}
                  {selectedPipeline.material && (
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        材质
                      </label>
                      <p className="text-white">{selectedPipeline.material}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      审批状态
                    </label>
                    <div className="flex items-center gap-2">
                      <FileCheck size={16} className={selectedPipeline.approvalStatus === 'approved' ? 'text-green-500' : selectedPipeline.approvalStatus === 'rejected' ? 'text-red-500' : 'text-yellow-500'} />
                      {renderApprovalBadge(selectedPipeline.approvalStatus)}
                    </div>
                    {selectedPipeline.lastRejectNote && (
                      <div className="mt-2 p-2.5 bg-red-500/10 border border-red-500/30 rounded-md">
                        <p className="text-xs text-red-400 font-medium flex items-center gap-1 mb-1">
                          <AlertCircle size={12} />
                          上次驳回原因
                        </p>
                        <p className="text-xs text-slate-300">
                          {selectedPipeline.lastRejectNote}
                        </p>
                      </div>
                    )}
                    {selectedPipeline.approver && (
                      <p className="text-xs text-slate-400 mt-2">
                        审批人: {selectedPipeline.approver} · {selectedPipeline.approvalTime}
                      </p>
                    )}
                    {selectedPipeline.approvalNote && (
                      <p className="text-xs text-slate-500 mt-1 p-2 bg-navy-900/50 rounded">
                        审批意见: {selectedPipeline.approvalNote}
                      </p>
                    )}
                  </div>

                  {selectedPipeline.approvalHistory && selectedPipeline.approvalHistory.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-navy-600/50">
                      <label className="text-xs text-slate-400 block mb-3 flex items-center gap-1">
                        <History size={12} />
                        审批时间线
                      </label>
                      <div className="relative pl-5">
                        {selectedPipeline.approvalHistory.map((item, idx) => {
                          const info = getApprovalActionInfo(item.action);
                          const total = selectedPipeline.approvalHistory?.length || 0;
                          return (
                            <div key={item.id} className="relative pb-4 last:pb-0">
                              {idx < total - 1 && (
                                <div className="absolute left-[-14px] top-4 w-0.5 h-full bg-navy-600" />
                              )}
                              <div className={`absolute left-[-18px] top-0 w-3 h-3 rounded-full border-2 border-navy-800 ${info.color}`} />
                              <div className="bg-navy-900/50 border border-navy-600/50 rounded-md p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded border ${info.badge}`}>
                                    {info.label}
                                  </span>
                                  <span className="text-xs text-slate-500 font-mono">
                                    {item.time}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                  操作人: <span className="text-slate-300">{item.operator}</span>
                                </p>
                                {item.note && (
                                  <p className="text-xs text-slate-300 mt-1 p-2 bg-navy-800/60 rounded">
                                    {item.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">
                        管线名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                        placeholder="请输入管线名称"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">
                        管线类型 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          type: e.target.value as any,
                          voltage: '',
                          pressure: '',
                        })}
                        className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                      >
                        <option value="power">电力管线</option>
                        <option value="gas">燃气管线</option>
                        <option value="water">给水管线</option>
                        <option value="communication">通信管线</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">
                        管径(mm)
                      </label>
                      <input
                        type="number"
                        value={formData.diameter || ''}
                        onChange={(e) => setFormData({ ...formData, diameter: Number(e.target.value) })}
                        className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                        placeholder="请输入管径"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">
                        长度(m)
                      </label>
                      <input
                        type="number"
                        value={formData.length || ''}
                        onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                        className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                        placeholder="请输入长度"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">
                        权属单位 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.owner}
                        onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                        className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                        placeholder="请输入权属单位"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">
                        入廊日期
                      </label>
                      <input
                        type="date"
                        value={formData.inDate}
                        onChange={(e) => setFormData({ ...formData, inDate: e.target.value })}
                        className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                      />
                    </div>
                  </div>

                  {formData.type === 'power' && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                      <div>
                        <label className="text-sm text-yellow-400 block mb-1">
                          <Zap size={14} className="inline mr-1" />
                          电压等级
                        </label>
                        <select
                          value={formData.voltage}
                          onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                          className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                        >
                          <option value="">请选择电压等级</option>
                          <option value="220kV">220kV</option>
                          <option value="110kV">110kV</option>
                          <option value="35kV">35kV</option>
                          <option value="10kV">10kV</option>
                          <option value="0.4kV">0.4kV</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-yellow-400 block mb-1">
                          电缆材质
                        </label>
                        <input
                          type="text"
                          value={formData.material}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                          placeholder="如：XLPE绝缘电缆、YJV电缆等"
                        />
                      </div>
                    </div>
                  )}

                  {formData.type === 'gas' && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                      <div>
                        <label className="text-sm text-orange-400 block mb-1">
                          <Flame size={14} className="inline mr-1" />
                          压力等级
                        </label>
                        <select
                          value={formData.pressure}
                          onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                          className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                        >
                          <option value="">请选择压力等级</option>
                          <option value="高压 1.6MPa">高压 1.6MPa</option>
                          <option value="次高压 0.8MPa">次高压 0.8MPa</option>
                          <option value="中压 0.4MPa">中压 0.4MPa</option>
                          <option value="低压 0.01MPa">低压 0.01MPa</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-orange-400 block mb-1">
                          管道材质
                        </label>
                        <input
                          type="text"
                          value={formData.material}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                          placeholder="如：钢制管道、PE管道等"
                        />
                      </div>
                    </div>
                  )}

                  {(formData.type === 'water' || formData.type === 'communication') && (
                    <div className="p-4 bg-navy-700/30 border border-navy-600 rounded-lg">
                      <label className="text-sm text-slate-300 block mb-1">
                        材质
                      </label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full h-9 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                        placeholder={formData.type === 'water' ? '如：球墨铸铁管、钢管等' : '如：GYTA光缆等'}
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-slate-300 block mb-1">
                      经过管廊段
                    </label>
                    <select
                      multiple
                      value={formData.sectionIds}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData({ ...formData, sectionIds: selected });
                      }}
                      className="w-full h-24 px-3 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50"
                    >
                      <option value="1">中央大道综合管廊</option>
                      <option value="2">科技路电力管廊</option>
                      <option value="3">滨江路燃气管廊</option>
                      <option value="4">新城区综合管廊</option>
                      <option value="5">工业园区给水管廊</option>
                      <option value="6">老城区改造管廊</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">按住Ctrl可多选</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 block mb-1">
                      备注说明
                    </label>
                    <textarea
                      rows={3}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-white focus:outline-none focus:border-tech-blue/50 resize-none"
                      placeholder="请输入备注信息"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-navy-600 flex justify-end gap-3 flex-wrap">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPipeline(null);
                }}
                className="px-4 py-2 bg-navy-700/50 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors"
              >
                {selectedPipeline ? '关闭' : '取消'}
              </button>
              {selectedPipeline && selectedPipeline.approvalStatus === 'rejected' && (
                <button
                  onClick={() => {
                    if (confirm('确认重新提交该管线至审批流程？')) {
                      resubmitPipeline(selectedPipeline.id);
                    }
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw size={14} />
                  重新提交审批
                </button>
              )}
              {!selectedPipeline && (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1 px-4 py-2 bg-tech-blue text-white text-sm rounded-md hover:bg-tech-blue/90 transition-colors"
                >
                  <Save size={14} />
                  提交登记
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-navy-800 border border-navy-600 rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-600">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                {approvalType === 'approve' ? (
                  <><CheckCircle2 size={18} className="text-green-500" /> 审批通过</>
                ) : (
                  <><XCircle size={18} className="text-red-500" /> 审批驳回</>
                )}
              </h3>
              <button
                onClick={() => {
                  setShowApprovalModal(null);
                  setApprovalNote('');
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-md">
                <p className="text-white font-medium">{showApprovalModal.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {getTypeText(showApprovalModal.type)} · {showApprovalModal.code} · {showApprovalModal.owner}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    管径
                  </label>
                  <p className="text-white text-sm">{showApprovalModal.diameter}mm</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    长度
                  </label>
                  <p className="text-white text-sm">{formatLength(showApprovalModal.length)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 block mb-1">
                  审批人 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    defaultValue="当前审批人"
                    className="w-full h-9 pl-8 pr-3 bg-navy-900 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 block mb-1">
                  {approvalType === 'reject' ? (
                    <>驳回原因 <span className="text-red-500">*</span></>
                  ) : (
                    <>审批意见</>
                  )}
                </label>
                <textarea
                  rows={4}
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50 resize-none"
                  placeholder={approvalType === 'reject' ? '请填写驳回原因...' : '请输入审批意见（选填）...'}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-navy-600 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(null);
                  setApprovalNote('');
                }}
                className="px-4 py-2 bg-navy-700/50 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitApproval}
                disabled={approvalType === 'reject' && !approvalNote.trim()}
                className={`px-4 py-2 text-white text-sm rounded-md transition-colors flex items-center gap-1 ${
                  approvalType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:bg-navy-700 disabled:text-slate-500`}
              >
                {approvalType === 'approve' ? (
                  <><CheckCircle2 size={14} /> 确认通过</>
                ) : (
                  <><XCircle size={14} /> 确认驳回</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
