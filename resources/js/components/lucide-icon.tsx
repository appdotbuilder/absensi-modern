import React from 'react';
import {
    Calendar,
    CalendarDays,
    CalendarX,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    AlertTriangle,
    BarChart3,
    TrendingUp,
    Activity,
    Zap,
    Settings,
    MapPin,
    History,
    LogIn,
    LogOut,
    Loader2,
    Table,
    Award,
    Circle,
    type LucideProps
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
    'calendar': Calendar,
    'calendar-days': CalendarDays,
    'calendar-x': CalendarX,
    'clock': Clock,
    'users': Users,
    'check-circle': CheckCircle,
    'x-circle': XCircle,
    'alert-triangle': AlertTriangle,
    'bar-chart-3': BarChart3,
    'trending-up': TrendingUp,
    'activity': Activity,
    'zap': Zap,
    'settings': Settings,
    'map-pin': MapPin,
    'history': History,
    'log-in': LogIn,
    'log-out': LogOut,
    'loader-2': Loader2,
    'table': Table,
    'award': Award,
    'face-id': Circle,
    'user': Users, // Fallback to Users icon
} as const;

export type IconName = keyof typeof iconMap;

interface LucideIconProps extends Omit<LucideProps, 'ref'> {
    name: IconName;
}

export function LucideIcon({ name, className, ...props }: LucideIconProps) {
    const IconComponent = iconMap[name] || Calendar;
    return <IconComponent className={cn('h-4 w-4', className)} {...props} />;
}