import { InspectionRecord, CheckPoint, Personnel } from '@/types';

export const inspectionRecords: InspectionRecord[] = [
  {
    id: '1',
    type: 'robot',
    taskName: '中央大道管廊日常巡检',
    sectionIds: ['1'],
    startTime: '2026-06-17 08:00:00',
    endTime: '2026-06-17 10:30:00',
    status: 'completed',
    checkpoints: 28,
    completedCheckpoints: 28,
    abnormalities: []
  },
  {
    id: '2',
    type: 'robot',
    taskName: '科技路电力管廊巡检',
    sectionIds: ['2'],
    startTime: '2026-06-17 09:00:00',
    endTime: '2026-06-17 11:15:00',
    status: 'completed',
    checkpoints: 22,
    completedCheckpoints: 22,
    abnormalities: ['3号接头温度偏高']
  },
  {
    id: '3',
    type: 'robot',
    taskName: '新城区综合管廊巡检',
    sectionIds: ['4'],
    startTime: '2026-06-17 10:00:00',
    status: 'in_progress',
    checkpoints: 45,
    completedCheckpoints: 28,
    abnormalities: []
  },
  {
    id: '4',
    type: 'manual',
    taskName: '滨江路燃气管廊人工巡检',
    inspector: '张工',
    sectionIds: ['3'],
    startTime: '2026-06-17 07:30:00',
    endTime: '2026-06-17 09:45:00',
    status: 'completed',
    checkpoints: 18,
    completedCheckpoints: 18,
    abnormalities: ['阀门A-12有轻微泄漏']
  },
  {
    id: '5',
    type: 'manual',
    taskName: '工业园区给水管廊巡检',
    inspector: '李工',
    sectionIds: ['5'],
    startTime: '2026-06-17 08:30:00',
    status: 'in_progress',
    checkpoints: 15,
    completedCheckpoints: 8,
    abnormalities: []
  },
  {
    id: '6',
    type: 'manual',
    taskName: '老城区改造管廊安全检查',
    inspector: '王工',
    sectionIds: ['6'],
    startTime: '2026-06-17 09:30:00',
    status: 'pending',
    checkpoints: 12,
    completedCheckpoints: 0,
    abnormalities: []
  },
  {
    id: '7',
    type: 'robot',
    taskName: '夜间安全巡检',
    sectionIds: ['1', '4'],
    startTime: '2026-06-16 22:00:00',
    endTime: '2026-06-17 01:30:00',
    status: 'completed',
    checkpoints: 56,
    completedCheckpoints: 56,
    abnormalities: []
  }
];

export const checkPoints: CheckPoint[] = [
  { id: '1', name: '入口环境监测点', code: 'CP-001', sectionId: '1', location: '1号入口井', type: 'environment', status: 'normal' },
  { id: '2', name: '中段环境监测点', code: 'CP-002', sectionId: '1', location: 'K1+500', type: 'environment', status: 'normal' },
  { id: '3', name: '末端环境监测点', code: 'CP-003', sectionId: '1', location: 'K3+200', type: 'environment', status: 'normal' },
  { id: '4', name: '1号变电站', code: 'CP-004', sectionId: '1', location: 'K0+800', type: 'equipment', status: 'normal' },
  { id: '5', name: '2号变电站', code: 'CP-005', sectionId: '1', location: 'K2+200', type: 'equipment', status: 'abnormal' },
  { id: '6', name: '消防泵房', code: 'CP-006', sectionId: '1', location: 'K1+200', type: 'safety', status: 'normal' },
  { id: '7', name: '通风机房1', code: 'CP-007', sectionId: '1', location: 'K0+500', type: 'equipment', status: 'normal' },
  { id: '8', name: '通风机房2', code: 'CP-008', sectionId: '1', location: 'K2+800', type: 'equipment', status: 'normal' },
];

export const inspectors: Personnel[] = [
  { id: '1', name: '张建国', department: '运维一部', position: '高级巡检员', phone: '13800138001', status: 'on_duty' },
  { id: '2', name: '李明辉', department: '运维一部', position: '巡检员', phone: '13800138002', status: 'in_tunnel', lastLocation: '给水管廊K1+200', lastUpdate: '2026-06-17 09:15:00' },
  { id: '3', name: '王志强', department: '运维二部', position: '巡检员', phone: '13800138003', status: 'on_duty' },
  { id: '4', name: '赵晓东', department: '运维二部', position: '班长', phone: '13800138004', status: 'on_leave' },
  { id: '5', name: '陈美玲', department: '安全部', position: '安全员', phone: '13800138005', status: 'on_duty' },
  { id: '6', name: '刘伟', department: '技术部', position: '工程师', phone: '13800138006', status: 'off_duty' },
];

export const robotStats = {
  total: 8,
  online: 6,
  charging: 2,
  todayTasks: 12,
  completedTasks: 8,
  totalDistance: 156.8
};
