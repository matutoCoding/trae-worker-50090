import { getStatusColor, getStatusText } from '@/utils/format';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export default function StatusBadge({ status, size = 'md', dot = true }: StatusBadgeProps) {
  const colorClass = getStatusColor(status);
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-medium ${colorClass} ${sizeClasses[size]}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
      {getStatusText(status)}
    </span>
  );
}
