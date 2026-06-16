import { create } from 'zustand';
import { TunnelSection, AlarmRecord, Pipeline, InspectionRecord } from '@/types';
import { tunnelSections } from '@/data/tunnel';
import { alarmRecords } from '@/data/alarm';
import { pipelines } from '@/data/pipeline';
import { inspectionRecords } from '@/data/inspection';

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
  updateAlarmStatus: (id: string, status: AlarmRecord['status']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  currentPage: 'dashboard',
  selectedSection: null,
  alarms: alarmRecords,
  tunnels: tunnelSections,
  pipelines: pipelines,
  inspections: inspectionRecords,
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedSection: (section) => set({ selectedSection: section }),
  addAlarm: (alarm) => set((state) => ({ alarms: [alarm, ...state.alarms] })),
  updateAlarmStatus: (id, status) => set((state) => ({
    alarms: state.alarms.map((a) => a.id === id ? { ...a, status } : a)
  })),
}));
