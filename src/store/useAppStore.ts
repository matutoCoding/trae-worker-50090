import { create } from 'zustand';
import {
  TunnelSection,
  AlarmRecord,
  Pipeline,
  InspectionRecord,
  RectificationItem,
  RectificationTimeline,
  AbnormalDetail,
  AlarmProcessRecord,
  ApprovalHistoryItem,
} from '@/types';
import { tunnelSections } from '@/data/tunnel';
import { alarmRecords as initialAlarms } from '@/data/alarm';
import { pipelines as initialPipelines } from '@/data/pipeline';
import { inspectionRecords as initialInspections } from '@/data/inspection';
import { checkPoints } from '@/data/inspection';

interface PipelineFormData {
  name: string;
  type: 'power' | 'gas' | 'water' | 'communication';
  diameter: number;
  length: number;
  owner: string;
  inDate: string;
  voltage?: string;
  pressure?: string;
  material?: string;
  sectionIds: string[];
  note?: string;
}

interface AlarmProcessData {
  handler: string;
  handleNote: string;
  handleResult: 'processing' | 'resolved';
}

interface RectificationUpdateData {
  handler: string;
  handleNote: string;
  status: 'processing' | 'reviewing';
}

interface RectificationReviewData {
  reviewer: string;
  reviewNote: string;
  passed: boolean;
}

interface AppState {
  sidebarCollapsed: boolean;
  currentPage: string;
  selectedSection: TunnelSection | null;
  alarms: AlarmRecord[];
  tunnels: TunnelSection[];
  pipelines: Pipeline[];
  inspections: InspectionRecord[];
  rectifications: RectificationItem[];

  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  setSelectedSection: (section: TunnelSection | null) => void;

  addAlarm: (alarm: AlarmRecord) => void;
  updateAlarmStatus: (
    id: string,
    status: AlarmRecord['status'],
    handler?: string
  ) => void;
  processAlarm: (alarmId: string, data: AlarmProcessData) => void;

  addPipeline: (data: PipelineFormData) => void;
  deletePipeline: (id: string) => void;
  approvePipeline: (id: string, approver: string, note?: string) => void;
  rejectPipeline: (id: string, approver: string, note: string) => void;
  resubmitPipeline: (id: string, note?: string) => void;

  getTaskCheckpoints: (inspectionId: string) => typeof checkPoints;
  completeCheckpoint: (
    inspectionId: string,
    checkpointId: string,
    checkpointName: string,
    checkpointCode: string,
    checkpointLocation: string,
    hasAbnormal: boolean,
    abnormalNote?: string,
    reporter?: string
  ) => void;
  finishInspection: (inspectionId: string) => void;

  updateRectification: (
    rectificationId: string,
    data: RectificationUpdateData
  ) => void;
  submitRectificationForReview: (
    rectificationId: string,
    handler: string,
    handleNote: string
  ) => void;
  reviewRectification: (
    rectificationId: string,
    data: RectificationReviewData
  ) => void;
  resolveRectification: (
    rectificationId: string,
    handler: string,
    handleNote: string
  ) => void;
}

const generatePipelineCode = (type: string, count: number): string => {
  const prefixMap: Record<string, string> = {
    power: 'DL',
    gas: 'RQ',
    water: 'GS',
    communication: 'TX',
  };
  const prefix = prefixMap[type] || 'GL';
  const num = String(count + 1).padStart(3, '0');
  return `${prefix}-${num}`;
};

const generateId = () => String(Date.now()) + Math.random().toString(36).substr(2, 9);

const formatDateTime = () =>
  new Date().toISOString().replace('T', ' ').split('.')[0];

const createTimelineItem = (
  action: RectificationTimeline['action'],
  operator: string,
  note?: string
): RectificationTimeline => ({
  id: generateId(),
  action,
  operator,
  time: formatDateTime(),
  note,
});

const initialRectifications: RectificationItem[] = initialInspections
  .filter((r) => r.abnormalities && r.abnormalities.length > 0)
  .flatMap((r) =>
    (r.abnormalities || [])
      .filter((a) => a.status !== 'resolved')
      .map((a) => ({
        id: generateId(),
        inspectionId: r.id,
        inspectionName: r.taskName,
        abnormalId: a.id,
        abnormalDescription: a.description,
        checkpointName: a.checkpointName,
        checkpointCode: a.checkpointCode,
        location: a.location,
        reporter: a.reporter,
        reportTime: a.reportTime,
        status: a.status as RectificationItem['status'],
        timeline: [
          createTimelineItem('report', a.reporter, a.description),
        ],
      }))
  );

const enhancedPipelines: Pipeline[] = initialPipelines.map((p) => ({
  ...p,
  approvalHistory: p.approvalStatus === 'approved'
    ? [
        {
          id: generateId(),
          action: 'submit' as const,
          operator: p.owner,
          time: p.inDate + ' 09:00:00',
        },
        {
          id: generateId(),
          action: 'approve' as const,
          operator: p.approver || '系统管理员',
          time: p.approvalTime || formatDateTime(),
          note: p.approvalNote || '审核通过，准予入廊',
        },
      ]
    : p.approvalStatus === 'pending'
    ? [
        {
          id: generateId(),
          action: 'submit' as const,
          operator: p.owner,
          time: p.inDate + ' 14:30:00',
          note: '提交入廊申请，请审批',
        },
      ]
    : [],
  lastRejectNote: p.approvalStatus === 'rejected' ? p.approvalNote : undefined,
}));

export const useAppStore = create<AppState>((set, get) => ({
  sidebarCollapsed: false,
  currentPage: 'dashboard',
  selectedSection: null,
  alarms: initialAlarms.map((a) => ({
    ...a,
    processRecords: a.processRecords || [],
  })),
  tunnels: tunnelSections,
  pipelines: enhancedPipelines,
  inspections: initialInspections,
  rectifications: initialRectifications,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedSection: (section) => set({ selectedSection: section }),

  addAlarm: (alarm) =>
    set((state) => ({ alarms: [alarm, ...state.alarms] })),
  updateAlarmStatus: (id, status, handler) =>
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              handler: handler || a.handler,
              resolvedTime:
                status === 'resolved'
                  ? new Date().toISOString()
                  : a.resolvedTime,
            }
          : a
      ),
    })),
  processAlarm: (alarmId, data) =>
    set((state) => {
      const processRecord: AlarmProcessRecord = {
        id: generateId(),
        alarmId,
        handler: data.handler,
        handleTime: formatDateTime(),
        handleNote: data.handleNote,
        handleResult: data.handleResult,
      };
      return {
        alarms: state.alarms.map((a) =>
          a.id === alarmId
            ? {
                ...a,
                status: data.handleResult,
                handler: data.handler,
                resolvedTime:
                  data.handleResult === 'resolved'
                    ? new Date().toISOString()
                    : a.resolvedTime,
                processRecords: [
                  ...(a.processRecords || []),
                  processRecord,
                ],
              }
            : a
        ),
      };
    }),

  addPipeline: (data) => {
    const state = get();
    const approvedCount = state.pipelines.filter(
      (p) => p.type === data.type && p.approvalStatus === 'approved'
    ).length;
    const pendingCount = state.pipelines.filter(
      (p) => p.type === data.type && p.approvalStatus === 'pending'
    ).length;

    const historyItem: ApprovalHistoryItem = {
      id: generateId(),
      action: 'submit',
      operator: data.owner,
      time: formatDateTime(),
      note: data.note || '提交入廊申请',
    };

    const newPipeline: Pipeline = {
      id: generateId(),
      name: data.name,
      type: data.type,
      code: generatePipelineCode(
        data.type,
        approvedCount + pendingCount
      ),
      diameter: data.diameter,
      length: data.length,
      owner: data.owner,
      inDate: data.inDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      approvalStatus: 'pending',
      sectionIds: data.sectionIds,
      voltage: data.voltage,
      pressure: data.pressure,
      material: data.material,
      approvalHistory: [historyItem],
    };
    set({ pipelines: [newPipeline, ...state.pipelines] });
  },
  deletePipeline: (id) =>
    set((state) => ({
      pipelines: state.pipelines.filter((p) => p.id !== id),
    })),
  approvePipeline: (id, approver, note) =>
    set((state) => {
      const historyItem: ApprovalHistoryItem = {
        id: generateId(),
        action: 'approve',
        operator: approver,
        time: formatDateTime(),
        note: note || '审核通过，准予入廊',
      };
      return {
        pipelines: state.pipelines.map((p) =>
          p.id === id
            ? {
                ...p,
                status: 'normal',
                approvalStatus: 'approved',
                approver,
                approvalTime: formatDateTime(),
                approvalNote: note,
                lastRejectNote: undefined,
                approvalHistory: [...p.approvalHistory, historyItem],
              }
            : p
        ),
      };
    }),
  rejectPipeline: (id, approver, note) =>
    set((state) => {
      const historyItem: ApprovalHistoryItem = {
        id: generateId(),
        action: 'reject',
        operator: approver,
        time: formatDateTime(),
        note,
      };
      return {
        pipelines: state.pipelines.map((p) =>
          p.id === id
            ? {
                ...p,
                status: 'pending',
                approvalStatus: 'rejected',
                approver,
                approvalTime: formatDateTime(),
                approvalNote: note,
                lastRejectNote: note,
                approvalHistory: [...p.approvalHistory, historyItem],
              }
            : p
        ),
      };
    }),
  resubmitPipeline: (id, note) =>
    set((state) => {
      const historyItem: ApprovalHistoryItem = {
        id: generateId(),
        action: 'resubmit',
        operator: '当前提交人',
        time: formatDateTime(),
        note: note || '修改后重新提交审批',
      };
      return {
        pipelines: state.pipelines.map((p) =>
          p.id === id
            ? {
                ...p,
                status: 'pending',
                approvalStatus: 'pending',
                approver: undefined,
                approvalTime: undefined,
                approvalNote: undefined,
                approvalHistory: [...p.approvalHistory, historyItem],
              }
            : p
        ),
      };
    }),

  getTaskCheckpoints: (inspectionId) => {
    const state = get();
    const inspection = state.inspections.find(
      (i) => i.id === inspectionId
    );
    if (!inspection) return [];
    const cps = checkPoints.filter((cp) =>
      inspection.sectionIds.includes(cp.sectionId)
    );
    const needed = inspection.checkpoints || 10;
    if (cps.length >= needed) {
      return cps.slice(0, needed);
    }
    const result = [...cps];
    let idx = cps.length + 1;
    while (result.length < needed) {
      result.push({
        id: `virtual-${inspectionId}-${idx}`,
        name: `巡检点${idx}`,
        code: `CP-VIRT-${String(idx).padStart(3, '0')}`,
        sectionId: inspection.sectionIds[0] || '1',
        location: `K${Math.floor(idx / 2)}+${(idx % 2) * 500}`,
        type: idx % 3 === 0 ? 'safety' : idx % 3 === 1 ? 'environment' : 'equipment',
        status: 'normal',
      });
      idx++;
    }
    return result;
  },
  completeCheckpoint: (
    inspectionId,
    checkpointId,
    checkpointName,
    checkpointCode,
    checkpointLocation,
    hasAbnormal,
    abnormalNote,
    reporter
  ) =>
    set((state) => {
      let newRectifications = [...state.rectifications];

      const newInspections = state.inspections.map((ins) => {
        if (ins.id !== inspectionId) return ins;
        const newCompleted = (ins.completedCheckpoints || 0) + 1;
        const isCompleted = newCompleted >= (ins.checkpoints || 1);

        let newAbnormalities = ins.abnormalities || [];

        if (hasAbnormal && abnormalNote) {
          const abnormal: AbnormalDetail = {
            id: generateId(),
            checkpointId,
            checkpointName,
            checkpointCode,
            description: abnormalNote,
            location: checkpointLocation,
            reporter: reporter || ins.inspector || '当前巡检员',
            reportTime: formatDateTime(),
            status: 'pending',
          };
          newAbnormalities = [...newAbnormalities, abnormal];

          const rectItem: RectificationItem = {
            id: generateId(),
            inspectionId,
            inspectionName: ins.taskName,
            abnormalId: abnormal.id,
            abnormalDescription: abnormal.description,
            checkpointName: abnormal.checkpointName,
            checkpointCode: abnormal.checkpointCode,
            location: abnormal.location,
            reporter: abnormal.reporter,
            reportTime: abnormal.reportTime,
            status: 'pending',
            timeline: [
              createTimelineItem('report', abnormal.reporter, abnormal.description),
            ],
          };
          newRectifications = [rectItem, ...newRectifications];
        }

        let newStatus: InspectionRecord['status'] = ins.status;
        if (isCompleted) {
          newStatus =
            newAbnormalities.length > 0 ? 'abnormal' : 'completed';
        } else if (ins.status === 'pending') {
          newStatus = 'in_progress';
        } else if (
          newAbnormalities.length > 0 &&
          ins.status !== 'abnormal'
        ) {
          newStatus = 'abnormal';
        }

        return {
          ...ins,
          completedCheckpoints: newCompleted,
          abnormalities: newAbnormalities,
          status: newStatus,
          endTime: isCompleted ? formatDateTime() : ins.endTime,
        };
      });

      return {
        inspections: newInspections,
        rectifications: newRectifications,
      };
    }),
  finishInspection: (inspectionId) =>
    set((state) => ({
      inspections: state.inspections.map((ins) => {
        if (ins.id !== inspectionId) return ins;
        return {
          ...ins,
          status:
            (ins.abnormalities && ins.abnormalities.length > 0)
              ? 'abnormal'
              : 'completed',
          endTime: formatDateTime(),
          completedCheckpoints: ins.checkpoints,
        };
      }),
    })),

  updateRectification: (rectificationId, data) =>
    set((state) => {
      const rect = state.rectifications.find(
        (r) => r.id === rectificationId
      );
      if (!rect) return state;

      const timeline = [
        ...rect.timeline,
        createTimelineItem(
          data.status === 'reviewing' ? 'submit_review' : 'start',
          data.handler,
          data.handleNote
        ),
      ];

      return {
        rectifications: state.rectifications.map((r) =>
          r.id === rectificationId
            ? {
                ...r,
                status: data.status,
                handler: data.handler,
                handleNote: data.handleNote,
                handleTime: formatDateTime(),
                timeline,
              }
            : r
        ),
        inspections: state.inspections.map((ins) => ({
          ...ins,
          abnormalities: (ins.abnormalities || []).map((a) =>
            a.id === rect.abnormalId
              ? {
                  ...a,
                  status: data.status === 'reviewing' ? 'processing' : data.status,
                }
              : a
          ),
        })),
      };
    }),
  submitRectificationForReview: (rectificationId, handler, handleNote) =>
    set((state) => {
      const rect = state.rectifications.find(
        (r) => r.id === rectificationId
      );
      if (!rect) return state;

      const timeline = [
        ...rect.timeline,
        createTimelineItem('submit_review', handler, handleNote),
      ];

      return {
        rectifications: state.rectifications.map((r) =>
          r.id === rectificationId
            ? {
                ...r,
                status: 'reviewing',
                handler,
                handleNote,
                handleTime: formatDateTime(),
                timeline,
              }
            : r
        ),
        inspections: state.inspections.map((ins) => ({
          ...ins,
          abnormalities: (ins.abnormalities || []).map((a) =>
            a.id === rect.abnormalId
              ? { ...a, status: 'processing' }
              : a
          ),
        })),
      };
    }),
  reviewRectification: (rectificationId, data) =>
    set((state) => {
      const rect = state.rectifications.find(
        (r) => r.id === rectificationId
      );
      if (!rect) return state;

      const action: RectificationTimeline['action'] = data.passed
        ? 'review_pass'
        : 'review_reject';
      const newStatus: RectificationItem['status'] = data.passed
        ? 'resolved'
        : 'rejected';
      const abnormalStatus: AbnormalDetail['status'] = data.passed
        ? 'resolved'
        : 'processing';

      const timeline = [
        ...rect.timeline,
        createTimelineItem(action, data.reviewer, data.reviewNote),
      ];

      return {
        rectifications: state.rectifications.map((r) =>
          r.id === rectificationId
            ? {
                ...r,
                status: newStatus,
                reviewer: data.reviewer,
                reviewNote: data.reviewNote,
                reviewTime: formatDateTime(),
                timeline,
              }
            : r
        ),
        inspections: state.inspections.map((ins) => ({
          ...ins,
          abnormalities: (ins.abnormalities || []).map((a) =>
            a.id === rect.abnormalId
              ? { ...a, status: abnormalStatus }
              : a
          ),
        })),
      };
    }),
  resolveRectification: (rectificationId, handler, handleNote) =>
    set((state) => {
      const rect = state.rectifications.find(
        (r) => r.id === rectificationId
      );
      if (!rect) return state;

      const timeline = [
        ...rect.timeline,
        createTimelineItem('review_pass', handler, handleNote),
      ];

      return {
        rectifications: state.rectifications.map((r) =>
          r.id === rectificationId
            ? {
                ...r,
                status: 'resolved',
                handler,
                handleNote,
                handleTime: formatDateTime(),
                reviewer: handler,
                reviewNote: handleNote,
                reviewTime: formatDateTime(),
                timeline,
              }
            : r
        ),
        inspections: state.inspections.map((ins) => ({
          ...ins,
          abnormalities: (ins.abnormalities || []).map((a) =>
            a.id === rect.abnormalId
              ? { ...a, status: 'resolved' }
              : a
          ),
        })),
      };
    }),
}));
