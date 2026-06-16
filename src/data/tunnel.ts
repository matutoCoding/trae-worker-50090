import { TunnelSection } from '@/types';

export const tunnelSections: TunnelSection[] = [
  {
    id: '1',
    name: '中央大道综合管廊',
    code: 'GL-ZY-001',
    length: 3500,
    width: 8.5,
    height: 4.2,
    type: 'comprehensive',
    status: 'normal',
    buildDate: '2021-06-15',
    location: '中央大道下方，从人民路到建设路',
    description: '综合舱包含电力、通信、给水等多种管线',
    floors: 2,
    cabins: ['综合舱', '电力舱', '燃气舱']
  },
  {
    id: '2',
    name: '科技路电力管廊',
    code: 'GL-KJ-002',
    length: 2800,
    width: 5.2,
    height: 3.5,
    type: 'power',
    status: 'normal',
    buildDate: '2022-03-20',
    location: '科技路下方，从创新街到创业路',
    description: '专用电力管廊，敷设110kV及220kV高压电缆',
    floors: 1,
    cabins: ['高压电力舱', '中压电力舱']
  },
  {
    id: '3',
    name: '滨江路燃气管廊',
    code: 'GL-BJ-003',
    length: 4200,
    width: 3.8,
    height: 3.2,
    type: 'gas',
    status: 'maintenance',
    buildDate: '2020-11-08',
    location: '滨江路下方，从港口大道到临江路',
    description: '专用燃气管廊，敷设中压及高压燃气管道',
    floors: 1,
    cabins: ['燃气舱']
  },
  {
    id: '4',
    name: '新城区综合管廊',
    code: 'GL-XC-004',
    length: 5600,
    width: 10.5,
    height: 4.8,
    type: 'comprehensive',
    status: 'normal',
    buildDate: '2023-08-30',
    location: '新城区核心区域，覆盖主要道路',
    description: '大型综合管廊，包含多种舱室和管线类型',
    floors: 3,
    cabins: ['综合舱', '电力舱', '燃气舱', '污水舱']
  },
  {
    id: '5',
    name: '工业园区给水管廊',
    code: 'GL-GY-005',
    length: 3100,
    width: 4.5,
    height: 3.8,
    type: 'water',
    status: 'normal',
    buildDate: '2022-09-12',
    location: '工业园区内部，从净水厂到各企业',
    description: '专用给水管道管廊，供应工业及生活用水',
    floors: 1,
    cabins: ['给水舱']
  },
  {
    id: '6',
    name: '老城区改造管廊',
    code: 'GL-LC-006',
    length: 1800,
    width: 6.0,
    height: 3.6,
    type: 'comprehensive',
    status: 'fault',
    buildDate: '2019-05-25',
    location: '老城区主干道下方',
    description: '老城区改造建设的综合管廊',
    floors: 1,
    cabins: ['综合舱', '电力舱']
  }
];

export const sectionStats = {
  totalLength: 21000,
  totalSections: 6,
  normalCount: 4,
  maintenanceCount: 1,
  faultCount: 1,
  totalCabins: 12
};
