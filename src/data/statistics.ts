import { TenantUnit, BillRecord } from '@/types';

export const tenantUnits: TenantUnit[] = [
  {
    id: '1',
    name: '市供电公司',
    type: 'power',
    contactPerson: '张经理',
    contactPhone: '13800138101',
    contractStart: '2021-01-01',
    contractEnd: '2026-12-31',
    fee: 580000,
    status: 'active',
    pipelineCount: 4,
    personnelCount: 12
  },
  {
    id: '2',
    name: '市燃气集团',
    type: 'gas',
    contactPerson: '李经理',
    contactPhone: '13800138102',
    contractStart: '2020-06-01',
    contractEnd: '2025-05-31',
    fee: 420000,
    status: 'expired',
    pipelineCount: 2,
    personnelCount: 8
  },
  {
    id: '3',
    name: '市自来水公司',
    type: 'water',
    contactPerson: '王经理',
    contactPhone: '13800138103',
    contractStart: '2021-03-15',
    contractEnd: '2026-03-14',
    fee: 360000,
    status: 'active',
    pipelineCount: 2,
    personnelCount: 6
  },
  {
    id: '4',
    name: '电信公司',
    type: 'communication',
    contactPerson: '赵经理',
    contactPhone: '13800138104',
    contractStart: '2021-05-01',
    contractEnd: '2026-04-30',
    fee: 180000,
    status: 'active',
    pipelineCount: 1,
    personnelCount: 4
  },
  {
    id: '5',
    name: '移动公司',
    type: 'communication',
    contactPerson: '刘经理',
    contactPhone: '13800138105',
    contractStart: '2021-07-01',
    contractEnd: '2026-06-30',
    fee: 180000,
    status: 'active',
    pipelineCount: 1,
    personnelCount: 4
  },
  {
    id: '6',
    name: '联通公司',
    type: 'communication',
    contactPerson: '陈经理',
    contactPhone: '13800138106',
    contractStart: '2023-01-01',
    contractEnd: '2027-12-31',
    fee: 150000,
    status: 'pending',
    pipelineCount: 0,
    personnelCount: 0
  }
];

export const billRecords: BillRecord[] = [
  { id: '1', unitId: '1', unitName: '市供电公司', period: '2026-05', amount: 48500, status: 'paid', dueDate: '2026-06-15', paidDate: '2026-06-10', items: [{ name: '舱位使用费', amount: 35000 }, { name: '运维服务费', amount: 13500 }] },
  { id: '2', unitId: '2', unitName: '市燃气集团', period: '2026-05', amount: 35000, status: 'paid', dueDate: '2026-06-15', paidDate: '2026-06-12', items: [{ name: '舱位使用费', amount: 25000 }, { name: '运维服务费', amount: 10000 }] },
  { id: '3', unitId: '3', unitName: '市自来水公司', period: '2026-05', amount: 30000, status: 'unpaid', dueDate: '2026-06-15', items: [{ name: '舱位使用费', amount: 22000 }, { name: '运维服务费', amount: 8000 }] },
  { id: '4', unitId: '4', unitName: '电信公司', period: '2026-05', amount: 15000, status: 'paid', dueDate: '2026-06-15', paidDate: '2026-06-08', items: [{ name: '舱位使用费', amount: 10000 }, { name: '运维服务费', amount: 5000 }] },
  { id: '5', unitId: '5', unitName: '移动公司', period: '2026-05', amount: 15000, status: 'unpaid', dueDate: '2026-06-15', items: [{ name: '舱位使用费', amount: 10000 }, { name: '运维服务费', amount: 5000 }] },
  { id: '6', unitId: '1', unitName: '市供电公司', period: '2026-04', amount: 48500, status: 'paid', dueDate: '2026-05-15', paidDate: '2026-05-12', items: [{ name: '舱位使用费', amount: 35000 }, { name: '运维服务费', amount: 13500 }] },
  { id: '7', unitId: '2', unitName: '市燃气集团', period: '2026-04', amount: 35000, status: 'paid', dueDate: '2026-05-15', paidDate: '2026-05-10', items: [{ name: '舱位使用费', amount: 25000 }, { name: '运维服务费', amount: 10000 }] },
  { id: '8', unitId: '3', unitName: '市自来水公司', period: '2026-04', amount: 30000, status: 'overdue', dueDate: '2026-05-15', items: [{ name: '舱位使用费', amount: 22000 }, { name: '运维服务费', amount: 8000 }] },
];

export const feeStats = {
  monthlyTotal: 143500,
  yearlyTotal: 1722000,
  paid: 98500,
  unpaid: 45000,
  overdue: 30000,
  collectionRate: 68.7
};

export const operationStats = {
  totalSections: 6,
  totalLength: 21,
  totalPipelines: 10,
  totalTenants: 6,
  safetyDays: 1287,
  inspectionCount: 356,
  alarmCount: 23,
  equipmentCount: 86,
  utilizationRate: 78.5
};

export const monthlyData = [
  { month: '1月', 巡检次数: 28, 告警数量: 5, 维护工单: 12, 入廊人次: 156 },
  { month: '2月', 巡检次数: 25, 告警数量: 3, 维护工单: 10, 入廊人次: 142 },
  { month: '3月', 巡检次数: 32, 告警数量: 7, 维护工单: 15, 入廊人次: 178 },
  { month: '4月', 巡检次数: 30, 告警数量: 4, 维护工单: 14, 入廊人次: 165 },
  { month: '5月', 巡检次数: 35, 告警数量: 6, 维护工单: 18, 入廊人次: 190 },
  { month: '6月', 巡检次数: 33, 告警数量: 7, 维护工单: 16, 入廊人次: 185 },
];

export const typeDistribution = [
  { name: '电力管线', value: 4, color: '#0EA5E9' },
  { name: '燃气管线', value: 2, color: '#F59E0B' },
  { name: '给水管线', value: 2, color: '#10B981' },
  { name: '通信管线', value: 2, color: '#8B5CF6' },
];
