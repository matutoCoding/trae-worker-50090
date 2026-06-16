import { InspectionRecord, CheckPoint, Personnel } from '@/types';

const generateCheckPoints = (): CheckPoint[] => {
  const cps: CheckPoint[] = [];
  const sections = ['1', '2', '3', '4', '5', '6'];
  const types: Array<'environment' | 'equipment' | 'safety'> = ['environment', 'equipment', 'safety'];
  
  sections.forEach((sectionId) => {
    for (let i = 1; i <= 10; i++) {
      const idx = (parseInt(sectionId) - 1) * 10 + i;
      const type = types[(i - 1) % 3];
      const typeNames = {
        environment: '环境监测点',
        equipment: '设备检查点',
        safety: '安全检查点'
      };
      const locations = [
        '入口井', 'K0+500', 'K1+000', 'K1+500', 'K2+000',
        'K2+500', 'K3+000', 'K3+500', 'K4+000', '出口井'
      ];
      cps.push({
        id: String(idx),
        name: `${typeNames[type]}${i}`,
        code: `CP-${String(idx).padStart(3, '0')}`,
        sectionId,
        location: locations[i - 1],
        type,
        status: Math.random() > 0.9 ? 'abnormal' : 'normal'
      });
    }
  });
  return cps;
};

export const checkPoints: CheckPoint[] = generateCheckPoints();

export const inspectionRecords: InspectionRecord[] = [
  {
    id: '1',
    type: 'robot',
    taskName: '中央大道管廊日常巡检',
    sectionIds: ['1'],
    startTime: '2026-06-17 08:00:00',
    endTime: '2026-06-17 10:30:00',
    status: 'completed',
    checkpoints: 10,
    completedCheckpoints: 10,
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
    checkpoints: 10,
    completedCheckpoints: 10,
    abnormalities: [
      {
        id: 'abn-1',
        checkpointId: '15',
        checkpointName: '设备检查点5',
        checkpointCode: 'CP-015',
        description: '3号接头温度偏高',
        location: 'K2+000',
        reporter: '巡检机器人2号',
        reportTime: '2026-06-17 10:15:00',
        status: 'resolved'
      }
    ]
  },
  {
    id: '3',
    type: 'robot',
    taskName: '新城区综合管廊巡检',
    sectionIds: ['4'],
    startTime: '2026-06-17 10:00:00',
    status: 'in_progress',
    checkpoints: 10,
    completedCheckpoints: 6,
    abnormalities: []
  },
  {
    id: '4',
    type: 'manual',
    taskName: '滨江路燃气管廊人工巡检',
    inspector: '张建国',
    sectionIds: ['3'],
    startTime: '2026-06-17 07:30:00',
    endTime: '2026-06-17 09:45:00',
    status: 'abnormal',
    checkpoints: 10,
    completedCheckpoints: 10,
    abnormalities: [
      {
        id: 'abn-2',
        checkpointId: '27',
        checkpointName: '安全检查点7',
        checkpointCode: 'CP-027',
        description: '阀门A-12有轻微泄漏',
        location: 'K3+000',
        reporter: '张建国',
        reportTime: '2026-06-17 08:50:00',
        status: 'pending'
      }
    ]
  },
  {
    id: '5',
    type: 'manual',
    taskName: '工业园区给水管廊巡检',
    inspector: '李明辉',
    sectionIds: ['5'],
    startTime: '2026-06-17 08:30:00',
    status: 'in_progress',
    checkpoints: 10,
    completedCheckpoints: 5,
    abnormalities: []
  },
  {
    id: '6',
    type: 'manual',
    taskName: '老城区改造管廊安全检查',
    inspector: '王志强',
    sectionIds: ['6'],
    startTime: '2026-06-17 09:30:00',
    status: 'pending',
    checkpoints: 10,
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
    checkpoints: 20,
    completedCheckpoints: 20,
    abnormalities: []
  }
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
