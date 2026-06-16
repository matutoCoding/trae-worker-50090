import { AlarmRecord, EmergencyPlan, EmergencySupply, Equipment } from '@/types';

export const alarmRecords: AlarmRecord[] = [
  {
    id: '1',
    type: 'gas',
    level: 'critical',
    location: '滨江路燃气管廊 K2+150',
    description: '甲烷浓度超标，达到0.32%VOL',
    timestamp: '2026-06-17 08:45:23',
    status: 'processing',
    handler: '张建国'
  },
  {
    id: '2',
    type: 'equipment',
    level: 'warning',
    location: '中央大道综合管廊 K2+200',
    description: '2号变电站温度偏高，达42℃',
    timestamp: '2026-06-17 09:12:45',
    status: 'unhandled'
  },
  {
    id: '3',
    type: 'waterlogging',
    level: 'warning',
    location: '老城区改造管廊 K0+800',
    description: '积水预警，水位达到15cm',
    timestamp: '2026-06-17 07:30:18',
    status: 'processing',
    handler: '李明辉'
  },
  {
    id: '4',
    type: 'temperature',
    level: 'info',
    location: '科技路电力管廊 K1+300',
    description: '环境温度偏高预警，达29.5℃',
    timestamp: '2026-06-17 10:05:33',
    status: 'resolved',
    handler: '王志强',
    resolvedTime: '2026-06-17 10:25:00'
  },
  {
    id: '5',
    type: 'fire',
    level: 'critical',
    location: '新城区综合管廊 K3+500',
    description: '烟雾探测器报警',
    timestamp: '2026-06-17 06:18:47',
    status: 'resolved',
    handler: '陈美玲',
    resolvedTime: '2026-06-17 06:45:00'
  },
  {
    id: '6',
    type: 'intrusion',
    level: 'warning',
    location: '中央大道综合管廊 3号井口',
    description: '非法入侵检测告警',
    timestamp: '2026-06-17 02:33:12',
    status: 'resolved',
    handler: '安保队',
    resolvedTime: '2026-06-17 02:50:00'
  },
  {
    id: '7',
    type: 'gas',
    level: 'warning',
    location: '滨江路燃气管廊 K1+800',
    description: 'CO浓度接近预警值',
    timestamp: '2026-06-17 09:58:05',
    status: 'unhandled'
  }
];

export const alarmStats = {
  today: 7,
  unhandled: 2,
  processing: 2,
  resolved: 3,
  critical: 2,
  warning: 4,
  info: 1
};

export const emergencyPlans: EmergencyPlan[] = [
  {
    id: '1',
    name: '火灾应急预案',
    type: 'fire',
    level: 'level1',
    description: '管廊内发生火灾时的应急处置方案',
    steps: [
      '立即启动火灾报警系统',
      '关闭相关区域通风系统',
      '启动消防喷淋系统',
      '组织人员疏散',
      '通知消防部门',
      '启动应急照明和疏散指示'
    ],
    responsiblePerson: '安全总监',
    contactPhone: '13900139000'
  },
  {
    id: '2',
    name: '燃气泄漏应急预案',
    type: 'gas',
    level: 'level1',
    description: '燃气管道泄漏时的应急处置方案',
    steps: [
      '立即关闭泄漏段两端阀门',
      '启动强制通风系统',
      '疏散周边人员',
      '设置警戒区域',
      '通知燃气公司抢修',
      '实时监测气体浓度'
    ],
    responsiblePerson: '运行部经理',
    contactPhone: '13900139001'
  },
  {
    id: '3',
    name: '水浸应急预案',
    type: 'waterlogging',
    level: 'level2',
    description: '管廊内发生水浸时的应急处置方案',
    steps: [
      '启动排水泵',
      '切断受影响区域电源',
      '检查管道泄漏情况',
      '转移重要设备',
      '安排人员值守',
      '记录水情数据'
    ],
    responsiblePerson: '运维部经理',
    contactPhone: '13900139002'
  },
  {
    id: '4',
    name: '地震应急预案',
    type: 'earthquake',
    level: 'level1',
    description: '地震发生时的应急处置方案',
    steps: [
      '立即启动地震应急响应',
      '组织管廊内人员撤离',
      '检查结构损坏情况',
      '关停危险设备',
      '排查管线损伤',
      '组织灾后评估'
    ],
    responsiblePerson: '总经理',
    contactPhone: '13900139003'
  }
];

export const emergencySupplies: EmergencySupply[] = [
  { id: '1', name: '正压式空气呼吸器', type: '呼吸防护', quantity: 20, unit: '套', location: '1号应急物资库', lastCheck: '2026-06-10', status: 'sufficient' },
  { id: '2', name: '便携式气体检测仪', type: '检测设备', quantity: 15, unit: '台', location: '各运维班', lastCheck: '2026-06-15', status: 'sufficient' },
  { id: '3', name: '消防服', type: '防护装备', quantity: 30, unit: '套', location: '1号应急物资库', lastCheck: '2026-05-20', status: 'sufficient' },
  { id: '4', name: '应急照明手电', type: '照明设备', quantity: 50, unit: '把', location: '各出入口', lastCheck: '2026-06-01', status: 'insufficient' },
  { id: '5', name: '急救箱', type: '医疗用品', quantity: 12, unit: '个', location: '各运维站', lastCheck: '2026-04-15', status: 'expired' },
  { id: '6', name: '安全带', type: '防护装备', quantity: 25, unit: '条', location: '1号应急物资库', lastCheck: '2026-06-08', status: 'sufficient' },
  { id: '7', name: '堵漏工具', type: '抢修工具', quantity: 8, unit: '套', location: '2号应急物资库', lastCheck: '2026-05-30', status: 'sufficient' },
  { id: '8', name: '对讲机', type: '通讯设备', quantity: 40, unit: '台', location: '运维中心', lastCheck: '2026-06-12', status: 'sufficient' },
];

export const equipments: Equipment[] = [
  { id: '1', name: '通风机', code: 'SB-TF-001', type: '通风设备', location: '中央大道管廊 K0+500', installDate: '2021-05-20', lastMaintenance: '2026-05-15', nextMaintenance: '2026-08-15', status: 'normal', manufacturer: '风机厂', model: 'HTF-I-NO.8' },
  { id: '2', name: '排水泵', code: 'SB-PS-001', type: '给排水设备', location: '中央大道管廊 K1+200', installDate: '2021-06-10', lastMaintenance: '2026-04-20', nextMaintenance: '2026-07-20', status: 'normal', manufacturer: '水泵厂', model: 'WQ100-15-7.5' },
  { id: '3', name: '变压器', code: 'SB-BY-001', type: '电力设备', location: '中央大道管廊 K2+200', installDate: '2021-07-01', lastMaintenance: '2026-03-10', nextMaintenance: '2026-09-10', status: 'maintenance', manufacturer: '变压器厂', model: 'SCB10-500kVA' },
  { id: '4', name: '消防泵', code: 'SB-XF-001', type: '消防设备', location: '中央大道管廊 K0+800', installDate: '2021-06-25', lastMaintenance: '2026-05-20', nextMaintenance: '2026-11-20', status: 'normal', manufacturer: '消防泵厂', model: 'XBD5/30G-FLG' },
  { id: '5', name: '巡检机器人1号', code: 'SB-JQR-001', type: '智能设备', location: '中央大道管廊', installDate: '2022-03-15', lastMaintenance: '2026-06-01', nextMaintenance: '2026-09-01', status: 'normal', manufacturer: '机器人公司', model: 'IR-2000' },
  { id: '6', name: '气体监测装置', code: 'SB-JC-001', type: '监测设备', location: '滨江路燃气管廊 K1+500', installDate: '2020-11-20', lastMaintenance: '2026-06-10', nextMaintenance: '2026-07-10', status: 'fault', manufacturer: '仪器厂', model: 'GDA-2000' },
];

export const equipmentStats = {
  total: 86,
  normal: 78,
  maintenance: 5,
  fault: 3,
  dueMaintenance: 8,
  thisMonthMaintenance: 12
};
