export interface TunnelSection {
  id: string;
  name: string;
  code: string;
  length: number;
  width: number;
  height: number;
  type: 'comprehensive' | 'power' | 'gas' | 'water';
  status: 'normal' | 'maintenance' | 'fault';
  buildDate: string;
  location: string;
  description: string;
  floors: number;
  cabins: string[];
}

export interface EnvironmentData {
  id: string;
  sectionId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  oxygen: number;
  ch4: number;
  co: number;
  h2s: number;
  smoke: boolean;
  waterlogging: boolean;
}

export interface ApprovalHistoryItem {
  id: string;
  action: 'submit' | 'approve' | 'reject' | 'resubmit';
  operator: string;
  time: string;
  note?: string;
}

export interface Pipeline {
  id: string;
  type: 'power' | 'gas' | 'water' | 'communication';
  name: string;
  code: string;
  diameter: number;
  length: number;
  owner: string;
  inDate: string;
  status: 'normal' | 'maintenance' | 'decommissioned' | 'pending' | 'approved' | 'rejected';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approver?: string;
  approvalTime?: string;
  approvalNote?: string;
  lastRejectNote?: string;
  approvalHistory: ApprovalHistoryItem[];
  sectionIds: string[];
  voltage?: string;
  pressure?: string;
  material?: string;
}

export interface AbnormalDetail {
  id: string;
  checkpointId: string;
  checkpointName: string;
  checkpointCode: string;
  description: string;
  location: string;
  reporter: string;
  reportTime: string;
  status: 'pending' | 'processing' | 'resolved';
}

export interface InspectionRecord {
  id: string;
  type: 'robot' | 'manual';
  taskName: string;
  inspector?: string;
  sectionIds: string[];
  startTime: string;
  endTime?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'abnormal';
  abnormalities?: AbnormalDetail[];
  checkpoints?: number;
  completedCheckpoints?: number;
}

export interface AlarmProcessRecord {
  id: string;
  alarmId: string;
  handler: string;
  handleTime: string;
  handleNote: string;
  handleResult: 'processing' | 'resolved' | 'transferred';
}

export interface AlarmRecord {
  id: string;
  type: 'fire' | 'waterlogging' | 'gas' | 'temperature' | 'equipment' | 'intrusion';
  level: 'critical' | 'warning' | 'info';
  location: string;
  description: string;
  timestamp: string;
  status: 'unhandled' | 'processing' | 'resolved';
  handler?: string;
  resolvedTime?: string;
  processRecords?: AlarmProcessRecord[];
}

export interface TenantUnit {
  id: string;
  name: string;
  type: 'power' | 'gas' | 'water' | 'communication' | 'other';
  contactPerson: string;
  contactPhone: string;
  contractStart: string;
  contractEnd: string;
  fee: number;
  status: 'active' | 'expired' | 'pending';
  pipelineCount: number;
  personnelCount: number;
}

export interface Equipment {
  id: string;
  name: string;
  code: string;
  type: string;
  location: string;
  installDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'normal' | 'maintenance' | 'fault' | 'scrapped';
  manufacturer?: string;
  model?: string;
}

export interface EmergencyPlan {
  id: string;
  name: string;
  type: 'fire' | 'gas' | 'waterlogging' | 'earthquake' | 'power';
  level: 'level1' | 'level2' | 'level3';
  description: string;
  steps: string[];
  responsiblePerson: string;
  contactPhone: string;
}

export interface EmergencySupply {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  location: string;
  lastCheck: string;
  status: 'sufficient' | 'insufficient' | 'expired';
}

export interface BillRecord {
  id: string;
  unitId: string;
  unitName: string;
  period: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;
  paidDate?: string;
  items: { name: string; amount: number }[];
}

export interface CheckPoint {
  id: string;
  name: string;
  code: string;
  sectionId: string;
  location: string;
  type: 'environment' | 'equipment' | 'safety';
  status: 'normal' | 'abnormal';
}

export interface Personnel {
  id: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  status: 'on_duty' | 'off_duty' | 'on_leave' | 'in_tunnel';
  lastLocation?: string;
  lastUpdate?: string;
}

export interface RectificationTimeline {
  id: string;
  action: 'report' | 'start' | 'submit_review' | 'review_pass' | 'review_reject' | 'rework';
  operator: string;
  time: string;
  note?: string;
}

export interface RectificationItem {
  id: string;
  inspectionId: string;
  inspectionName: string;
  abnormalId: string;
  abnormalDescription: string;
  checkpointName: string;
  checkpointCode: string;
  location: string;
  reporter: string;
  reportTime: string;
  status: 'pending' | 'processing' | 'reviewing' | 'resolved' | 'rejected';
  handler?: string;
  handleNote?: string;
  handleTime?: string;
  reviewer?: string;
  reviewNote?: string;
  reviewTime?: string;
  timeline: RectificationTimeline[];
}
