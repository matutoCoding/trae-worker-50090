import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  title,
  icon: Icon,
  action,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <div className={`bg-navy-800/60 border border-navy-600/50 rounded-lg overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-navy-600/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-tech-blue" />}
          <h3 className="font-medium text-white">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
