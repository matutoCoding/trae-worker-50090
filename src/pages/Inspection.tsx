import { useState, useMemo } from 'react';
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
  Save,
  ChevronRight,
  Wrench,
  Eye,
  X,
  User,
  Filter,
  Search,
  Send,
  ThumbsUp,
  ThumbsDown,
  History,
  ArrowRight,
  Layers,
  TrendingUp,
  Timer,
  Hash,
  UserPlus,
  ChevronDown,
} from 'lucide-react';
import SectionCard from '@/components/cards/SectionCard';
import StatCard from '@/components/cards/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  checkPoints,
  inspectors,
} from '@/data/inspection';
import { tunnelSections } from '@/data/tunnel';
import { useAppStore } from '@/store/useAppStore';
import {
  InspectionRecord,
  RectificationItem,
  AbnormalDetail,
  RectificationTimeline,
} from '@/types';

export default function Inspection() {
  const [activeTab, setActiveTab] = useState<'robot' | 'manual' | 'rectification'>('manual');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentCheckpointIdx, setCurrentCheckpointIdx] = useState(0);
  const [abnormalNote, setAbnormalNote] = useState('');
  const [showAbnormal, setShowAbnormal] = useState(false);
  const [showAbnormalDetail, setShowAbnormalDetail] = useState<{
    inspection: InspectionRecord;
    abnormal: AbnormalDetail;
  } | null>(null);
  const [showRectificationDetail, setShowRectificationDetail] = useState<RectificationItem | null>(null);
  const [rectificationForm, setRectificationForm] = useState({
    handler: '',
    handleNote: '',
  });
  const [reviewForm, setReviewForm] = useState({
    reviewer: '',
    reviewNote: '',
  });
  const [rectificationFilter, setRectificationFilter] = useState<string>('all');
  const [rectificationSearch, setRectificationSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [reporterFilter, setReporterFilter] = useState<string>('all');
  const [handlerFilter, setHandlerFilter] = useState<string>('all');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const inspections = useAppStore((s) => s.inspections);
  const rectifications = useAppStore((s) => s.rectifications);
  const getTaskCheckpoints = useAppStore((s) => s.getTaskCheckpoints);
  const completeCheckpoint = useAppStore((s) => s.completeCheckpoint);
  const finishInspection = useAppStore((s) => s.finishInspection);
  const resolveRectification = useAppStore((s) => s.resolveRectification);
  const updateRectification = useAppStore((s) => s.updateRectification);
  const submitRectificationForReview = useAppStore((s) => s.submitRectificationForReview);
  const reviewRectification = useAppStore((s) => s.reviewRectification);

  const robotRecords = inspections.filter((r) => r.type === 'robot');
  const manualRecords = inspections.filter((r) => r.type === 'manual');

  const stats = useMemo(() => {
    const allRecords = inspections;
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = allRecords.filter((r) =>
      r.startTime.startsWith(today)
    );
    const completed = allRecords.filter(
      (r) => r.status === 'completed'
    ).length;
    const abnormalCount = allRecords.reduce(
      (sum, r) =>
        sum + (r.abnormalities?.filter((a) => a.status !== 'resolved').length || 0),
      0
    );
    const resolvedCount = rectifications.filter(
      (r) => r.status === 'resolved'
    ).length;
    const pendingRectCount = rectifications.filter(
      (r) => r.status === 'pending' || r.status === 'processing'
    ).length;
    const reviewingCount = rectifications.filter(
      (r) => r.status === 'reviewing'
    ).length;
    const rejectedCount = rectifications.filter(
      (r) => r.status === 'rejected'
    ).length;
    return {
      todayCount: todayTasks.length,
      completed,
      abnormal: abnormalCount,
      pendingRect: pendingRectCount,
      reviewing: reviewingCount,
      rejected: rejectedCount,
      resolved: resolvedCount,
    };
  }, [inspections, rectifications]);

  const availableTasks = useMemo(
    () =>
      manualRecords.filter(
        (r) => r.status === 'pending' || r.status === 'in_progress'
      ),
    [manualRecords]
  );

  const selectedTask: InspectionRecord | undefined = useMemo(
    () => inspections.find((r) => r.id === selectedTaskId),
    [inspections, selectedTaskId]
  );

  const taskCheckpoints = useMemo(() => {
    if (!selectedTaskId) return [];
    return getTaskCheckpoints(selectedTaskId);
  }, [selectedTaskId, getTaskCheckpoints]);

  const filteredRectifications = useMemo(() => {
    let list = rectifications;
    if (rectificationFilter !== 'all') {
      list = list.filter((r) => r.status === rectificationFilter);
    }
    if (sectionFilter !== 'all') {
      list = list.filter((r) => r.sectionId === sectionFilter);
    }
    if (reporterFilter !== 'all') {
      list = list.filter((r) => r.reporter === reporterFilter);
    }
    if (handlerFilter !== 'all') {
      list = list.filter((r) => r.handler === handlerFilter);
    }
    if (rectificationSearch.trim()) {
      const keyword = rectificationSearch.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.abnormalDescription.toLowerCase().includes(keyword) ||
          r.checkpointName.toLowerCase().includes(keyword) ||
          r.inspectionName.toLowerCase().includes(keyword)
      );
    }
    return list;
  }, [rectifications, rectificationFilter, rectificationSearch, sectionFilter, reporterFilter, handlerFilter]);

  const reporters = useMemo(() => {
    const set = new Set(rectifications.map((r) => r.reporter));
    return Array.from(set);
  }, [rectifications]);

  const handlers = useMemo(() => {
    const set = new Set(rectifications.filter((r) => r.handler).map((r) => r.handler!));
    return Array.from(set);
  }, [rectifications]);

  const sectionStats = useMemo(() => {
    return tunnelSections.map((section) => {
      const sectionRects = rectifications.filter((r) => r.sectionId === section.id);
      const total = sectionRects.length;
      const resolved = sectionRects.filter((r) => r.status === 'resolved').length;
      const closeRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
      let avgHours = 0;
      const resolvedItems = sectionRects.filter((r) => r.status === 'resolved' && r.reviewTime);
      if (resolvedItems.length > 0) {
        const totalMs = resolvedItems.reduce((sum, r) => {
          const start = new Date(r.reportTime).getTime();
          const end = new Date(r.reviewTime || r.handleTime || r.reportTime).getTime();
          return sum + (end - start);
        }, 0);
        avgHours = Math.round((totalMs / resolvedItems.length) / (1000 * 60 * 60) * 10) / 10;
      }
      return {
        section,
        total,
        resolved,
        closeRate,
        avgHours,
        pending: sectionRects.filter((r) => r.status === 'pending' || r.status === 'processing').length,
        reviewing: sectionRects.filter((r) => r.status === 'reviewing').length,
        rejected: sectionRects.filter((r) => r.status === 'rejected').length,
      };
    }).filter((s) => s.total > 0 || true);
  }, [rectifications]);

  const handleSelectTask = (taskId: string) => {
    const task = inspections.find((r) => r.id === taskId);
    setSelectedTaskId(taskId);
    setCurrentCheckpointIdx(task?.completedCheckpoints || 0);
    setAbnormalNote('');
    setShowAbnormal(false);
  };

  const handleCheckNormal = () => {
    if (!selectedTask || !taskCheckpoints[currentCheckpointIdx]) return;
    const cp = taskCheckpoints[currentCheckpointIdx];
    completeCheckpoint(
      selectedTask.id,
      cp.id,
      cp.name,
      cp.code,
      cp.location,
      false,
      undefined,
      selectedTask.inspector
    );
    const nextIdx = currentCheckpointIdx + 1;
    if (nextIdx >= taskCheckpoints.length) {
      finishInspection(selectedTask.id);
      setSelectedTaskId(null);
      setCurrentCheckpointIdx(0);
    } else {
      setCurrentCheckpointIdx(nextIdx);
    }
  };

  const handleCheckAbnormal = () => {
    if (!selectedTask || !taskCheckpoints[currentCheckpointIdx] || !abnormalNote.trim()) return;
    const cp = taskCheckpoints[currentCheckpointIdx];
    completeCheckpoint(
      selectedTask.id,
      cp.id,
      cp.name,
      cp.code,
      cp.location,
      true,
      abnormalNote.trim(),
      selectedTask.inspector
    );
    const nextIdx = currentCheckpointIdx + 1;
    setAbnormalNote('');
    setShowAbnormal(false);
    if (nextIdx >= taskCheckpoints.length) {
      finishInspection(selectedTask.id);
      setSelectedTaskId(null);
      setCurrentCheckpointIdx(0);
    } else {
      setCurrentCheckpointIdx(nextIdx);
    }
  };

  const handleResolveRectification = () => {
    if (!showRectificationDetail || !rectificationForm.handler.trim() || !rectificationForm.handleNote.trim()) return;
    resolveRectification(
      showRectificationDetail.id,
      rectificationForm.handler.trim(),
      rectificationForm.handleNote.trim()
    );
    setShowRectificationDetail(null);
    setRectificationForm({ handler: '', handleNote: '' });
  };

  const handleStartRectification = () => {
    if (!showRectificationDetail || !rectificationForm.handler.trim()) return;
    updateRectification(showRectificationDetail.id, {
      handler: rectificationForm.handler.trim(),
      handleNote: rectificationForm.handleNote.trim() || '开始整改',
      status: 'processing',
    });
    setShowRectificationDetail(null);
    setRectificationForm({ handler: '', handleNote: '' });
  };

  const handleSubmitReview = () => {
    if (!showRectificationDetail || !rectificationForm.handler.trim() || !rectificationForm.handleNote.trim()) return;
    submitRectificationForReview(
      showRectificationDetail.id,
      rectificationForm.handler.trim(),
      rectificationForm.handleNote.trim()
    );
    setShowRectificationDetail(null);
    setRectificationForm({ handler: '', handleNote: '' });
  };

  const handleReviewPass = () => {
    if (!showRectificationDetail || !reviewForm.reviewer.trim()) return;
    reviewRectification(showRectificationDetail.id, {
      reviewer: reviewForm.reviewer.trim(),
      reviewNote: reviewForm.reviewNote.trim() || '整改合格，复核通过',
      passed: true,
    });
    setShowRectificationDetail(null);
    setReviewForm({ reviewer: '', reviewNote: '' });
  };

  const handleReviewReject = () => {
    if (!showRectificationDetail || !reviewForm.reviewer.trim() || !reviewForm.reviewNote.trim()) return;
    reviewRectification(showRectificationDetail.id, {
      reviewer: reviewForm.reviewer.trim(),
      reviewNote: reviewForm.reviewNote.trim(),
      passed: false,
    });
    setShowRectificationDetail(null);
    setReviewForm({ reviewer: '', reviewNote: '' });
  };

  const renderRectificationStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      processing: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      reviewing: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      resolved: 'bg-green-500/10 text-green-500 border-green-500/30',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/30',
    };
    const labels: Record<string, string> = {
      pending: '待处理',
      processing: '处理中',
      reviewing: '待复核',
      resolved: '已整改',
      rejected: '复核不通过',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded border ${colors[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const renderTimelineAction = (action: RectificationTimeline['action']) => {
    const config: Record<RectificationTimeline['action'], { label: string; icon: any; color: string }> = {
      report: { label: '异常上报', icon: AlertTriangle, color: 'text-red-500' },
      start: { label: '开始整改', icon: Play, color: 'text-blue-500' },
      submit_review: { label: '提交复核', icon: Send, color: 'text-purple-500' },
      review_pass: { label: '复核通过', icon: ThumbsUp, color: 'text-green-500' },
      review_reject: { label: '复核不通过', icon: ThumbsDown, color: 'text-red-500' },
      rework: { label: '重新整改', icon: Wrench, color: 'text-yellow-500' },
    };
    const c = config[action] || config.report;
    const Icon = c.icon;
    return (
      <div className={`flex items-center gap-1.5 ${c.color}`}>
        <Icon size={12} />
        <span className="text-xs font-medium">{c.label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="巡检人员"
          value={inspectors.length}
          icon={UserCheck}
          suffix="人"
          color="blue"
        />
        <StatCard
          title="今日任务"
          value={stats.todayCount}
          icon={ClipboardCheck}
          suffix="次"
          color="green"
        />
        <StatCard
          title="已完成"
          value={stats.completed}
          icon={CheckCircle}
          suffix="次"
          color="yellow"
        />
        <StatCard
          title="待整改"
          value={stats.pendingRect}
          icon={Wrench}
          color="red"
          suffix="项"
        />
        <StatCard
          title="待复核"
          value={stats.reviewing}
          icon={History}
          suffix="项"
          color="purple"
        />
        <StatCard
          title="已整改"
          value={stats.resolved}
          icon={CheckCircle}
          suffix="项"
          color="green"
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
        <button
          onClick={() => setActiveTab('rectification')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'rectification'
              ? 'text-tech-blue border-b-2 border-tech-blue -mb-px'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wrench size={18} />
          整改项管理
          {stats.pendingRect + stats.reviewing > 0 && (
            <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              {stats.pendingRect + stats.reviewing}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'rectification' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'pending', label: '待处理', value: stats.pendingRect, color: 'red', icon: AlertTriangle },
              { key: 'reviewing', label: '待复核', value: stats.reviewing, color: 'purple', icon: Clock },
              { key: 'rejected', label: '复核不通过', value: stats.rejected, color: 'orange', icon: XCircle },
              { key: 'resolved', label: '已整改', value: stats.resolved, color: 'green', icon: CheckCircle },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = rectificationFilter === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setRectificationFilter(isActive ? 'all' : item.key);
                    setSectionFilter('all');
                    setReporterFilter('all');
                    setHandlerFilter('all');
                  }}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    isActive
                      ? 'bg-tech-blue/10 border-tech-blue/50 ring-1 ring-tech-blue/30'
                      : 'bg-navy-800/60 border-navy-600/50 hover:border-navy-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${isActive ? 'text-tech-blue' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                    <Icon size={16} className={isActive ? 'text-tech-blue' : `text-${item.color}-500`} />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${isActive ? 'text-tech-blue' : 'text-white'}`}>
                    {item.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    点击筛选
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SectionCard title="整改工单台账" icon={Wrench}>
                <div className="space-y-3 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {[
                        { key: 'all', label: '全部' },
                        { key: 'pending', label: '待处理' },
                        { key: 'processing', label: '处理中' },
                        { key: 'reviewing', label: '待复核' },
                        { key: 'rejected', label: '复核不通过' },
                        { key: 'resolved', label: '已整改' },
                      ].map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setRectificationFilter(f.key)}
                          className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                            rectificationFilter === f.key
                              ? 'bg-tech-blue text-white'
                              : 'bg-navy-700/50 border border-navy-600 text-slate-300 hover:bg-navy-700'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="搜索整改项..."
                        value={rectificationSearch}
                        onChange={(e) => setRectificationSearch(e.target.value)}
                        className="w-56 h-8 pl-8 pr-3 bg-navy-900/50 border border-navy-600 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-tech-blue/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                        <Layers size={12} />
                        管廊段
                      </label>
                      <select
                        value={sectionFilter}
                        onChange={(e) => setSectionFilter(e.target.value)}
                        className="w-full h-8 px-2 bg-navy-900/50 border border-navy-600 rounded-md text-xs text-white focus:outline-none focus:border-tech-blue/50"
                      >
                        <option value="all">全部管廊段</option>
                        {tunnelSections.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                        <User size={12} />
                        巡检员
                      </label>
                      <select
                        value={reporterFilter}
                        onChange={(e) => setReporterFilter(e.target.value)}
                        className="w-full h-8 px-2 bg-navy-900/50 border border-navy-600 rounded-md text-xs text-white focus:outline-none focus:border-tech-blue/50"
                      >
                        <option value="all">全部巡检员</option>
                        {reporters.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                        <Wrench size={12} />
                        处理人
                      </label>
                      <select
                        value={handlerFilter}
                        onChange={(e) => setHandlerFilter(e.target.value)}
                        className="w-full h-8 px-2 bg-navy-900/50 border border-navy-600 rounded-md text-xs text-white focus:outline-none focus:border-tech-blue/50"
                      >
                        <option value="all">全部处理人</option>
                        {handlers.length === 0 ? (
                          <option value="all" disabled>暂无</option>
                        ) : (
                          handlers.map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-navy-600/50 bg-navy-900/30">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          工单编号
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          整改项
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          管廊段
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          巡检员
                        </th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                          处理人
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
                      {filteredRectifications.map((rect) => {
                        const section = tunnelSections.find((s) => s.id === rect.sectionId);
                        return (
                          <tr
                            key={rect.id}
                            className="border-b border-navy-600/30 hover:bg-navy-700/20"
                          >
                            <td className="py-3 px-4">
                              <span className="text-xs font-mono text-tech-blue bg-tech-blue/10 px-2 py-0.5 rounded">
                                ZG{rect.id.padStart(4, '0')}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-white max-w-xs">
                              <div className="font-medium">{rect.abnormalDescription}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{rect.reportTime}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-300 text-xs">
                              {section?.name || '-'}
                              <div className="text-slate-500">{rect.location}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-300 text-xs">
                              {rect.reporter}
                            </td>
                            <td className="py-3 px-4 text-slate-300 text-xs">
                              <div>{rect.handler || '-'}</div>
                              {rect.reviewer && (
                                <div className="text-slate-500 mt-0.5">复核: {rect.reviewer}</div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {renderRectificationStatusBadge(rect.status)}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => {
                                  setShowRectificationDetail(rect);
                                  setRectificationForm({
                                    handler: rect.handler || '',
                                    handleNote: rect.handleNote || '',
                                  });
                                  setReviewForm({ reviewer: '', reviewNote: '' });
                                }}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-tech-blue hover:bg-tech-blue/10 rounded transition-colors"
                              >
                                <Eye size={12} />
                                详情
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredRectifications.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500">
                            暂无符合条件的整改工单
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
                  <span>共 {filteredRectifications.length} 条记录</span>
                  {(sectionFilter !== 'all' || reporterFilter !== 'all' || handlerFilter !== 'all' || rectificationFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSectionFilter('all');
                        setReporterFilter('all');
                        setHandlerFilter('all');
                        setRectificationFilter('all');
                        setRectificationSearch('');
                      }}
                      className="text-tech-blue hover:underline"
                    >
                      清除全部筛选
                    </button>
                  )}
                </div>
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard title="管廊段隐患统计" icon={Layers}>
                <div className="space-y-4">
                  {sectionStats.map((stat) => (
                    <div
                      key={stat.section.id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        sectionFilter === stat.section.id
                          ? 'bg-tech-blue/10 border-tech-blue/40'
                          : 'bg-navy-900/50 border-navy-600/50 hover:border-navy-500'
                      }`}
                      onClick={() => {
                        setSectionFilter(sectionFilter === stat.section.id ? 'all' : stat.section.id);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white font-medium">{stat.section.name}</span>
                        <span className="text-xs text-slate-400">{stat.total} 项</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">闭环率</span>
                          <span className="text-green-500 font-medium">{stat.closeRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">均处理时</span>
                          <span className="text-tech-blue font-medium">{stat.avgHours}h</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-navy-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${stat.closeRate}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                        <span>待处理 {stat.pending}</span>
                        <span>待复核 {stat.reviewing}</span>
                        <span>不通过 {stat.rejected}</span>
                        <span className="text-green-500">已整改 {stat.resolved}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="工单效率指标" icon={TrendingUp}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <CheckCircle size={14} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">整改闭环率</p>
                        <p className="text-lg font-bold text-white font-mono">
                          {Math.round((stats.resolved / Math.max(rectifications.length, 1)) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(stats.resolved / Math.max(rectifications.length, 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-navy-600/50">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">总工单</p>
                      <p className="text-lg font-bold text-white font-mono">{rectifications.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">处理中</p>
                      <p className="text-lg font-bold text-yellow-500 font-mono">
                        {stats.pendingRect + stats.reviewing}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      ) : activeTab === 'robot' ? (
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
                        <span>开始: {record.startTime}</span>
                      </div>
                      {record.abnormalities &&
                      record.abnormalities.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="text-red-500">
                            {record.abnormalities.length} 处异常
                          </span>
                          {record.abnormalities.some(a => a.status !== 'resolved') && (
                            <button
                              onClick={() => {
                                const pending = record.abnormalities!.find(a => a.status !== 'resolved');
                                if (pending) {
                                  setShowAbnormalDetail({
                                    inspection: record,
                                    abnormal: pending
                                  });
                                }
                              }}
                              className="text-xs text-tech-blue hover:underline"
                            >
                              查看
                            </button>
                          )}
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
              title="人工巡检打卡"
              icon={UserCheck}
              action={
                <button className="flex items-center gap-1 px-3 py-1.5 bg-tech-blue text-white text-sm rounded-md hover:bg-tech-blue/90 transition-colors">
                  <FileText size={14} />
                  生成巡检报告
                </button>
              }
            >
              {!selectedTaskId ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      选择巡检任务
                    </label>
                    {availableTasks.length === 0 ? (
                      <div className="p-6 bg-navy-900/50 border border-navy-600/50 rounded-lg text-center">
                        <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                        <p className="text-slate-300 text-sm">暂无待执行的巡检任务</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {availableTasks.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => handleSelectTask(task.id)}
                            className="w-full flex items-center justify-between p-4 bg-navy-900/50 border border-navy-600/50 rounded-lg hover:border-tech-blue/50 hover:bg-navy-800/60 transition-all text-left"
                          >
                            <div>
                              <h4 className="text-white font-medium">
                                {task.taskName}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1">
                                巡检员: {task.inspector || '-'} · 开始:{' '}
                                {task.startTime} · {task.checkpoints} 个打卡点
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-xs text-slate-300 font-mono">
                                  {task.completedCheckpoints || 0} / {task.checkpoints}
                                </div>
                                <div className="w-20 h-1.5 bg-navy-700 rounded-full overflow-hidden mt-1">
                                  <div
                                    className="h-full bg-tech-blue rounded-full transition-all"
                                    style={{
                                      width: `${((task.completedCheckpoints || 0) / (task.checkpoints || 1)) * 100}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-400" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedTaskId(null)}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      ← 返回任务列表
                    </button>
                    <StatusBadge status={selectedTask?.status || 'pending'} size="sm" />
                  </div>

                  <div className="p-4 bg-navy-900/50 border border-navy-600/50 rounded-lg">
                    <h3 className="text-white font-medium mb-1">
                      {selectedTask?.taskName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      巡检员: {selectedTask?.inspector || '-'} · 共 {taskCheckpoints.length} 个打卡点
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>打卡进度</span>
                        <span>
                          {currentCheckpointIdx}/{taskCheckpoints.length}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-tech-blue rounded-full transition-all"
                          style={{
                            width: `${(currentCheckpointIdx / Math.max(taskCheckpoints.length, 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    {selectedTask?.abnormalities && selectedTask.abnormalities.length > 0 && (
                      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                        已记录异常 {selectedTask.abnormalities.length} 处，
                        待处理 {selectedTask.abnormalities.filter(a => a.status !== 'resolved').length} 处，
                        已整改 {selectedTask.abnormalities.filter(a => a.status === 'resolved').length} 处
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">打卡点列表</p>
                    {taskCheckpoints.map((cp, idx) => {
                      const isDone = idx < currentCheckpointIdx;
                      const isCurrent = idx === currentCheckpointIdx;
                      return (
                        <div
                          key={cp.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            isCurrent
                              ? 'bg-tech-blue/10 border-tech-blue/50'
                              : isDone
                              ? 'bg-green-500/5 border-green-500/30'
                              : 'bg-navy-900/50 border-navy-600/50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCurrent
                                ? 'bg-tech-blue/20 text-tech-blue'
                                : isDone
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-navy-700 text-slate-400'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle size={16} />
                            ) : (
                              <span className="text-xs font-medium">{idx + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                isDone ? 'text-slate-400' : 'text-white'
                              }`}
                            >
                              {cp.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {cp.code} · {cp.location}
                            </p>
                          </div>
                          {isCurrent && (
                            <span className="text-xs text-tech-blue px-2 py-0.5 bg-tech-blue/10 rounded">
                              当前打卡
                            </span>
                          )}
                          {isDone && (
                            <span className="text-xs text-green-500">已完成</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {currentCheckpointIdx < taskCheckpoints.length && (
                    <div className="space-y-3 pt-4 border-t border-navy-600/50">
                      <h4 className="text-sm text-white font-medium">
                        当前打卡: {taskCheckpoints[currentCheckpointIdx]?.name}
                      </h4>

                      {!showAbnormal ? (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handleCheckNormal}
                            className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                          >
                            <CheckCircle size={16} />
                            正常打卡
                          </button>
                          <button
                            onClick={() => setShowAbnormal(true)}
                            className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                          >
                            <AlertTriangle size={16} />
                            发现异常
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            value={abnormalNote}
                            onChange={(e) => setAbnormalNote(e.target.value)}
                            placeholder="请输入异常描述..."
                            rows={3}
                            className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 resize-none"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                setShowAbnormal(false);
                                setAbnormalNote('');
                              }}
                              className="py-2.5 bg-navy-700 hover:bg-navy-600 text-slate-300 text-sm rounded-md transition-colors"
                            >
                              取消
                            </button>
                            <button
                              onClick={handleCheckAbnormal}
                              disabled={!abnormalNote.trim()}
                              className="flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-navy-700 disabled:text-slate-500 text-white text-sm rounded-md transition-colors"
                            >
                              <Save size={14} />
                              提交异常并生成整改项
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="人工巡检记录"
              icon={ClipboardCheck}
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
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualRecords.map((record) => {
                      const abnormalList = record.abnormalities || [];
                      const pendingAbnormal = abnormalList.filter(a => a.status !== 'resolved').length;
                      const resolvedAbnormal = abnormalList.filter(a => a.status === 'resolved').length;
                      return (
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
                          <td className="py-3 px-4 text-slate-300 font-mono text-xs">
                            {record.startTime}
                          </td>
                          <td className="py-3 px-4 text-slate-300 text-xs">
                            {record.completedCheckpoints}/{record.checkpoints}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={record.status} size="sm" />
                          </td>
                          <td className="py-3 px-4">
                            {abnormalList.length > 0 ? (
                              <div>
                                <span className="text-red-500 text-sm">共 {abnormalList.length} 处</span>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  待处理 {pendingAbnormal} · 已整改 {resolvedAbnormal}
                                </div>
                              </div>
                            ) : (
                              <span className="text-green-500 text-sm">无</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {abnormalList.length > 0 && (
                              <button
                                onClick={() => {
                                  const pending = abnormalList.find(a => a.status !== 'resolved') || abnormalList[0];
                                  setShowAbnormalDetail({
                                    inspection: record,
                                    abnormal: pending
                                  });
                                }}
                                className="flex items-center gap-1 text-xs text-tech-blue hover:underline"
                              >
                                <Eye size={12} />
                                查看异常
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
                {checkPoints.slice(0, 8).map((point) => (
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

            <SectionCard title="整改概览">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">待处理</span>
                  <span className="text-xl font-semibold text-red-500">{stats.pendingRect} 处</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">待复核</span>
                  <span className="text-xl font-semibold text-purple-500">{stats.reviewing} 处</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">复核不通过</span>
                  <span className="text-xl font-semibold text-orange-500">{stats.rejected} 处</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">已整改完成</span>
                  <span className="text-xl font-semibold text-green-500">{stats.resolved} 处</span>
                </div>
                <div className="pt-4 mt-4 border-t border-navy-600/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">整改闭环率</span>
                    <span className="text-xl font-semibold text-white">
                      {Math.round((stats.resolved / Math.max(stats.resolved + stats.pendingRect + stats.reviewing + stats.rejected, 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 mt-2 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(stats.resolved / Math.max(stats.resolved + stats.pendingRect + stats.reviewing + stats.rejected, 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {showAbnormalDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-navy-800 border border-navy-600 rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-600">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                异常详情
              </h3>
              <button
                onClick={() => setShowAbnormalDetail(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(() => {
                const relatedRect = rectifications.find(
                  (r) => r.abnormalId === showAbnormalDetail.abnormal.id
                );
                const currentResponsible = relatedRect?.handler || relatedRect?.reviewer || '待分配';
                const getNextAction = () => {
                  const status = relatedRect?.status || 'pending';
                  switch (status) {
                    case 'pending':
                      return { text: '等待开始整改', action: '需指定处理人并开始整改', color: 'text-yellow-500' };
                    case 'processing':
                      return { text: '整改进行中', action: '处理人完成后提交复核', color: 'text-blue-500' };
                    case 'reviewing':
                      return { text: '等待复核', action: '复核人需确认整改结果', color: 'text-purple-500' };
                    case 'rejected':
                      return { text: '复核不通过', action: '需重新整改并再次提交', color: 'text-orange-500' };
                    case 'resolved':
                      return { text: '已闭环', action: '整改完成，无需操作', color: 'text-green-500' };
                    default:
                      return { text: '待处理', action: '请跟进处理', color: 'text-slate-400' };
                  }
                };
                const nextAction = getNextAction();

                return (
                  <>
                    {relatedRect && (
                      <div className="p-3 bg-tech-blue/10 border border-tech-blue/30 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-tech-blue font-medium flex items-center gap-1">
                            <Hash size={12} />
                            关联整改工单
                          </span>
                          <span className="text-xs font-mono text-tech-blue bg-tech-blue/20 px-2 py-0.5 rounded">
                            ZG{relatedRect.id.padStart(4, '0')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400">当前责任人: </span>
                            <span className="text-white">{currentResponsible}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">下一步: </span>
                            <span className={nextAction.color}>{nextAction.text}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{nextAction.action}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          巡检任务
                        </label>
                        <p className="text-white text-sm">{showAbnormalDetail.inspection.taskName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          整改状态
                        </label>
                        {renderRectificationStatusBadge(showAbnormalDetail.abnormal.status)}
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          检查点
                        </label>
                        <p className="text-white text-sm">{showAbnormalDetail.abnormal.checkpointName}</p>
                        <p className="text-xs text-slate-400">{showAbnormalDetail.abnormal.checkpointCode}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          位置
                        </label>
                        <p className="text-white text-sm">{showAbnormalDetail.abnormal.location}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          上报人
                        </label>
                        <p className="text-white text-sm">{showAbnormalDetail.abnormal.reporter}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          上报时间
                        </label>
                        <p className="text-white text-sm font-mono text-xs">
                          {showAbnormalDetail.abnormal.reportTime}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        异常描述
                      </label>
                      <p className="text-white text-sm p-3 bg-navy-900/50 border border-navy-600/50 rounded-md">
                        {showAbnormalDetail.abnormal.description}
                      </p>
                    </div>
                    {relatedRect && relatedRect.timeline.length > 0 && (
                      <div>
                        <label className="text-xs text-slate-400 block mb-2 flex items-center gap-1">
                          <History size={12} />
                          处置时间线
                        </label>
                        <div className="relative pl-5">
                          {relatedRect.timeline.map((tl, i) => {
                            const dotColor =
                              tl.action === 'report' ? 'bg-red-500'
                                : tl.action === 'start' || tl.action === 'rework' ? 'bg-blue-500'
                                : tl.action === 'submit_review' ? 'bg-purple-500'
                                : tl.action === 'review_pass' ? 'bg-green-500'
                                : tl.action === 'review_reject' ? 'bg-orange-500'
                                : 'bg-yellow-500';
                            return (
                              <div key={tl.id} className="relative pb-4 last:pb-0">
                                {i < relatedRect.timeline.length - 1 && (
                                  <div className="absolute left-[-14px] top-4 w-0.5 h-full bg-navy-600" />
                                )}
                                <div className={`absolute left-[-18px] top-0 w-3 h-3 rounded-full border-2 border-navy-800 ${dotColor}`} />
                                <div className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-md">
                                  <div className="flex items-center justify-between mb-1">
                                    {renderTimelineAction(tl.action)}
                                    <span className="text-xs text-slate-500 font-mono">{tl.time}</span>
                                  </div>
                                  <p className="text-xs text-slate-400">操作人: {tl.operator}</p>
                                  {tl.note && (
                                    <p className="text-xs text-slate-300 mt-1">{tl.note}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="px-6 py-4 border-t border-navy-600 flex justify-end gap-3">
              <button
                onClick={() => setShowAbnormalDetail(null)}
                className="px-4 py-2 bg-navy-700/50 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors"
              >
                关闭
              </button>
              {showAbnormalDetail.abnormal.status !== 'resolved' && (
                <button
                  onClick={() => {
                    const rect = rectifications.find(
                      (r) => r.abnormalId === showAbnormalDetail.abnormal.id
                    );
                    if (rect) {
                      setShowRectificationDetail(rect);
                      setRectificationForm({
                        handler: rect.handler || '',
                        handleNote: rect.handleNote || '',
                      });
                      setReviewForm({ reviewer: '', reviewNote: '' });
                    }
                    setShowAbnormalDetail(null);
                  }}
                  className="px-4 py-2 bg-tech-blue text-white text-sm rounded-md hover:bg-tech-blue/90 transition-colors flex items-center gap-1"
                >
                  <ArrowRight size={14} />
                  前往整改
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showRectificationDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-navy-800 border border-navy-600 rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-600">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Wrench size={18} className="text-yellow-500" />
                整改项详情
              </h3>
              <button
                onClick={() => {
                  setShowRectificationDetail(null);
                  setRectificationForm({ handler: '', handleNote: '' });
                  setReviewForm({ reviewer: '', reviewNote: '' });
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">整改项</span>
                  {renderRectificationStatusBadge(showRectificationDetail.status)}
                </div>
                <p className="text-white text-sm">{showRectificationDetail.abnormalDescription}</p>
                <div className="mt-2 pt-2 border-t border-navy-600/50 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">检查点: </span>
                    <span className="text-slate-300">{showRectificationDetail.checkpointName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">位置: </span>
                    <span className="text-slate-300">{showRectificationDetail.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">所属任务: </span>
                    <span className="text-slate-300">{showRectificationDetail.inspectionName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">上报时间: </span>
                    <span className="text-slate-300 font-mono">{showRectificationDetail.reportTime}</span>
                  </div>
                </div>
              </div>

              {showRectificationDetail.handler && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      处理人
                    </label>
                    <p className="text-white text-sm">{showRectificationDetail.handler}</p>
                  </div>
                  {showRectificationDetail.handleTime && (
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        处理时间
                      </label>
                      <p className="text-white text-sm font-mono text-xs">
                        {showRectificationDetail.handleTime}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {showRectificationDetail.handleNote && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    处理说明
                  </label>
                  <p className="text-white text-sm p-3 bg-navy-900/50 border border-navy-600/50 rounded-md">
                    {showRectificationDetail.handleNote}
                  </p>
                </div>
              )}

              {showRectificationDetail.reviewer && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      复核人
                    </label>
                    <p className="text-white text-sm">{showRectificationDetail.reviewer}</p>
                  </div>
                  {showRectificationDetail.reviewTime && (
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        复核时间
                      </label>
                      <p className="text-white text-sm font-mono text-xs">
                        {showRectificationDetail.reviewTime}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {showRectificationDetail.reviewNote && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    复核意见
                  </label>
                  <p className={`text-white text-sm p-3 rounded-md border ${
                    showRectificationDetail.status === 'rejected'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-navy-900/50 border-navy-600/50'
                  }`}>
                    {showRectificationDetail.reviewNote}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 block mb-2 flex items-center gap-1">
                  <History size={12} />
                  处理时间线
                </label>
                <div className="relative pl-5">
                  {showRectificationDetail.timeline.map((tl, i) => (
                    <div key={tl.id} className="relative pb-4 last:pb-0">
                      {i < showRectificationDetail.timeline.length - 1 && (
                        <div className="absolute left-[-14px] top-4 w-0.5 h-full bg-navy-600" />
                      )}
                      <div className={`absolute left-[-18px] top-0 w-3 h-3 rounded-full border-2 border-navy-800 ${
                        tl.action === 'report' ? 'bg-red-500'
                          : tl.action === 'start' ? 'bg-blue-500'
                          : tl.action === 'submit_review' ? 'bg-purple-500'
                          : tl.action === 'review_pass' ? 'bg-green-500'
                          : tl.action === 'review_reject' ? 'bg-orange-500'
                          : 'bg-yellow-500'
                      }`} />
                      <div className="p-3 bg-navy-900/50 border border-navy-600/50 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          {renderTimelineAction(tl.action)}
                          <span className="text-xs text-slate-500 font-mono">{tl.time}</span>
                        </div>
                        <p className="text-xs text-slate-400">操作人: {tl.operator}</p>
                        {tl.note && (
                          <p className="text-xs text-slate-300 mt-1">{tl.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(showRectificationDetail.status === 'pending' ||
                showRectificationDetail.status === 'processing' ||
                showRectificationDetail.status === 'reviewing' ||
                showRectificationDetail.status === 'rejected') && (
                <div className="pt-2 border-t border-navy-600/50">
                  {showRectificationDetail.status !== 'reviewing' && (
                    <>
                      <div className="pt-2">
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
                            value={rectificationForm.handler}
                            onChange={(e) =>
                              setRectificationForm({
                                ...rectificationForm,
                                handler: e.target.value,
                              })
                            }
                            className="w-full h-9 pl-8 pr-3 bg-navy-900 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50"
                            placeholder="请输入处理人姓名"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="text-sm text-slate-300 block mb-1">
                          处理说明
                          {(showRectificationDetail.status !== 'pending') && (
                            <span className="text-red-500"> *</span>
                          )}
                        </label>
                        <textarea
                          rows={3}
                          value={rectificationForm.handleNote}
                          onChange={(e) =>
                            setRectificationForm({
                              ...rectificationForm,
                              handleNote: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50 resize-none"
                          placeholder={
                            showRectificationDetail.status === 'pending'
                              ? '请输入整改计划（选填）'
                              : '请输入整改完成说明'
                          }
                        />
                      </div>
                    </>
                  )}

                  {showRectificationDetail.status === 'reviewing' && (
                    <>
                      <div className="pt-2">
                        <label className="text-sm text-slate-300 block mb-1">
                          复核人 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type="text"
                            value={reviewForm.reviewer}
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                reviewer: e.target.value,
                              })
                            }
                            className="w-full h-9 pl-8 pr-3 bg-navy-900 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50"
                            placeholder="请输入复核人姓名"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="text-sm text-slate-300 block mb-1">
                          复核意见 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={reviewForm.reviewNote}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              reviewNote: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-navy-900 border border-navy-600 rounded-md text-sm text-white focus:outline-none focus:border-tech-blue/50 resize-none"
                          placeholder="如不通过请说明原因..."
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-navy-600 flex justify-end gap-3 flex-wrap">
              <button
                onClick={() => {
                  setShowRectificationDetail(null);
                  setRectificationForm({ handler: '', handleNote: '' });
                  setReviewForm({ reviewer: '', reviewNote: '' });
                }}
                className="px-4 py-2 bg-navy-700/50 border border-navy-600 rounded-md text-sm text-slate-300 hover:bg-navy-700 transition-colors"
              >
                关闭
              </button>
              {showRectificationDetail.status === 'pending' && (
                <button
                  onClick={handleStartRectification}
                  disabled={!rectificationForm.handler.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-navy-700 disabled:text-slate-500 transition-colors flex items-center gap-1"
                >
                  <Play size={14} />
                  开始整改
                </button>
              )}
              {showRectificationDetail.status === 'processing' && (
                <button
                  onClick={handleSubmitReview}
                  disabled={!rectificationForm.handler.trim() || !rectificationForm.handleNote.trim()}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:bg-navy-700 disabled:text-slate-500 transition-colors flex items-center gap-1"
                >
                  <Send size={14} />
                  提交复核
                </button>
              )}
              {showRectificationDetail.status === 'rejected' && (
                <button
                  onClick={handleSubmitReview}
                  disabled={!rectificationForm.handler.trim() || !rectificationForm.handleNote.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-navy-700 disabled:text-slate-500 transition-colors flex items-center gap-1"
                >
                  <Wrench size={14} />
                  重新整改提交复核
                </button>
              )}
              {showRectificationDetail.status === 'reviewing' && (
                <>
                  <button
                    onClick={handleReviewReject}
                    disabled={!reviewForm.reviewer.trim() || !reviewForm.reviewNote.trim()}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:bg-navy-700 disabled:text-slate-500 transition-colors flex items-center gap-1"
                  >
                    <ThumbsDown size={14} />
                    复核不通过
                  </button>
                  <button
                    onClick={handleReviewPass}
                    disabled={!reviewForm.reviewer.trim()}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-navy-700 disabled:text-slate-500 transition-colors flex items-center gap-1"
                  >
                    <ThumbsUp size={14} />
                    复核通过
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
