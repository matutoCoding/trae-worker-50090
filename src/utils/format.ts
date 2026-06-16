export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss');
};

export const formatNumber = (num: number, decimals: number = 1): string => {
  return num.toFixed(decimals);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatLength = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${meters} m`;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    normal: 'text-green-500 bg-green-500/10 border-green-500/30',
    active: 'text-green-500 bg-green-500/10 border-green-500/30',
    completed: 'text-green-500 bg-green-500/10 border-green-500/30',
    resolved: 'text-green-500 bg-green-500/10 border-green-500/30',
    paid: 'text-green-500 bg-green-500/10 border-green-500/30',
    sufficient: 'text-green-500 bg-green-500/10 border-green-500/30',
    online: 'text-green-500 bg-green-500/10 border-green-500/30',
    on_duty: 'text-green-500 bg-green-500/10 border-green-500/30',
    
    warning: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    maintenance: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    processing: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    in_progress: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    unpaid: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    insufficient: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    charging: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    off_duty: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    
    critical: 'text-red-500 bg-red-500/10 border-red-500/30',
    fault: 'text-red-500 bg-red-500/10 border-red-500/30',
    abnormal: 'text-red-500 bg-red-500/10 border-red-500/30',
    unhandled: 'text-red-500 bg-red-500/10 border-red-500/30',
    expired: 'text-red-500 bg-red-500/10 border-red-500/30',
    overdue: 'text-red-500 bg-red-500/10 border-red-500/30',
    scrapped: 'text-red-500 bg-red-500/10 border-red-500/30',
    on_leave: 'text-red-500 bg-red-500/10 border-red-500/30',
    in_tunnel: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
    
    info: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    decommissioned: 'text-gray-500 bg-gray-500/10 border-gray-500/30',
  };
  return colorMap[status] || 'text-gray-500 bg-gray-500/10 border-gray-500/30';
};

export const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    normal: '正常',
    active: '有效',
    completed: '已完成',
    resolved: '已解决',
    paid: '已缴费',
    sufficient: '充足',
    online: '在线',
    on_duty: '在岗',
    
    warning: '预警',
    maintenance: '维护中',
    pending: '待处理',
    processing: '处理中',
    in_progress: '进行中',
    unpaid: '未缴费',
    insufficient: '不足',
    charging: '充电中',
    off_duty: '下班',
    
    critical: '严重',
    fault: '故障',
    abnormal: '异常',
    unhandled: '未处理',
    expired: '已过期',
    overdue: '逾期',
    scrapped: '已报废',
    on_leave: '休假',
    in_tunnel: '在廊内',
    
    info: '提示',
    decommissioned: '已退役',
  };
  return textMap[status] || status;
};

export const getTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    comprehensive: '综合管廊',
    power: '电力',
    gas: '燃气',
    water: '给水',
    communication: '通信',
    other: '其他',
    fire: '火灾',
    waterlogging: '水浸',
    temperature: '温度',
    equipment: '设备',
    intrusion: '入侵',
    robot: '机器人',
    manual: '人工',
  };
  return textMap[type] || type;
};
