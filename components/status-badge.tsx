import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  isActive: boolean;
  label?: string;
}

export function StatusBadge({ isActive, label }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        'font-medium',
        isActive
          ? 'bg-green-100 text-green-800 hover:bg-green-100'
          : 'bg-red-100 text-red-800 hover:bg-red-100'
      )}
    >
      {label || (isActive ? 'Active' : 'Inactive')}
    </Badge>
  );
}
