import { create } from 'zustand';
import { TunnelSection, AlarmRecord, Pipeline, InspectionRecord } from '@/types';
import { tunnelSections } from '@/data/tunnel';
import { alarmRecords } from '@/data/alarm';
import { pipelines as initialPipelines } from '@/data/pipeline';
import { inspectionRecords as initialInspections } from '@/data/inspection';

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

interface AppState {
  sidebarCollapsed: boolean;
  currentPage: string;
  selectedSection: TunnelSection | null;
  alarms: AlarmRecord[];
  tunnels: TunnelSection[];
  pipelines: Pipeline[];
  inspections: InspectionRecord[];
  
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  setSelectedSection: (section: TunnelSection | null) => void;
  addAlarm: (alarm: AlarmRecord) => void;
  updateAlarmStatus: (id: string, status: AlarmRecord['status'], handler?: string) => void;
  
  addPipeline: (data: PipelineFormData) => void;
  deletePipeline: (id: string) => void;
  
  completeCheckpoint: (inspectionId: string, hasAbnormal: boolean, abnormalNote?: string) => void;
  finishInspection: (inspectionId: string) => void;
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

export const useAppStore = create<AppState>((set, get) => ({
  sidebarCollapsed: false,
  currentPage: 'dashboard',
  selectedSection: null,
  alarms: alarmRecords,
  tunnels: tunnelSections,
  pipelines: initialPipelines,
  inspections: initialInspections,
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedSection: (section) => set({ selectedSection: section }),
  addAlarm: (alarm) => set((state) => ({ alarms: [alarm, ...state.alarms] })),
  updateAlarmStatus: (id, status, handler) => set((state) => ({
    alarms: state.alarms.map((a) => a.id === id ? { 
      ...a, 
      status, 
      handler: handler || a.handler,
      resolvedTime: status === 'resolved' ? new Date().toISOString() : a.resolvedTime
    } : a)
  })),
  
  addPipeline: (data) => {
    const state = get();
    const count = state.pipelines.filter((p) => p.type === data.type).length;
    const newPipeline: Pipeline = {
      id: String(Date.now()),
      name: data.name,
      type: data.type,
      code: generatePipelineCode(data.type, count),
      diameter: data.diameter,
      length: data.length,
      owner: data.owner,
      inDate: data.inDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      sectionIds: data.sectionIds,
      voltage: data.voltage,
      pressure: data.pressure,
      material: data.material,
    };
    set({ pipelines: [newPipeline, ...state.pipelines] });
  },
  deletePipeline: (id) => set((state) => ({
    pipelines: state.pipelines.filter((p) => p.id !== id)
  })),
  
  completeCheckpoint: (inspectionId, hasAbnormal, abnormalNote) => set((state) => ({
    inspections: state.inspections.map((ins) => {
      if (ins.id !== inspectionId) return ins;
      const newCompleted = (ins.completedCheckpoints || 0) + 1;
      const isCompleted = newCompleted >= (ins.checkpoints || 1);
      const newAbnormalities = hasAbnormal && abnormalNote
        ? [...(ins.abnormalities || []), abnormalNote]
        : ins.abnormalities;
      return {
        ...ins,
        completedCheckpoints: newCompleted,
        abnormalities: newAbnormalities,
        status: isCompleted ? 'completed' : (newAbnormalities && newAbnormalities.length > 0 ? 'abnormal' : ins.status === 'pending' ? 'in_progress' : ins.status),
      };
    })
  })),
  finishInspection: (inspectionId) => set((state) => ({
    inspections: state.inspections.map((ins) => {
      if (ins.id !== inspectionId) return ins;
      return {
        ...ins,
        status: (ins.abnormalities && ins.abnormalities.length > 0) ? 'abnormal' : 'completed',
        endTime: new Date().toISOString().replace('T', ' ').split('.')[0],
        completedCheckpoints: ins.checkpoints,
      };
    })
  })),
}));
