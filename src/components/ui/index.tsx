import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   BUTTON
   ═══════════════════════════════════════════════════════════ */
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/40',
  secondary: 'border-2 border-surface-200 text-surface-800 hover:bg-surface-50 hover:border-surface-300',
  success: 'bg-tertiary-500 hover:bg-tertiary-600 text-white shadow-md shadow-tertiary-500/25 hover:shadow-lg hover:shadow-tertiary-500/40',
  ghost: 'text-surface-700 hover:bg-surface-100 hover:text-surface-900',
  danger: 'bg-error text-white hover:opacity-90 shadow-md',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-7 py-3.5 text-base gap-2.5 rounded-2xl',
};

export function Button({ variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight, loading, children, className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center font-heading font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={loading || props.disabled}
      {...(props as any)}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
      {IconRight && <IconRight className="w-4 h-4" />}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════
   CARD
   ═══════════════════════════════════════════════════════════ */
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  accent?: 'primary' | 'success' | 'warning' | 'none';
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', hover = false, accent = 'none', padding = 'md' }: CardProps) {
  const paddingMap = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  const accentMap = {
    none: '',
    primary: 'border-l-4 border-l-primary-500',
    success: 'border-l-4 border-l-tertiary-500',
    warning: 'border-l-4 border-l-warning',
  };
  const Wrapper = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { y: -4, boxShadow: '0 10px 25px -5px rgba(17, 85, 242, 0.1), 0 8px 10px -6px rgba(17, 85, 242, 0.1)' },
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  } : {};

  return (
    <Wrapper
      className={`bg-white rounded-3xl shadow-sm border border-surface-200/60 ${paddingMap[padding]} ${accentMap[accent]} ${hover ? 'cursor-pointer' : ''} ${className}`}
      {...(hoverProps as any)}
    >
      {children}
    </Wrapper>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════════════════════ */
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: string;
}

export function StatCard({ label, value, icon: Icon, trend, color = 'primary' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-500',
    secondary: 'bg-secondary-50 text-secondary-500',
    success: 'bg-tertiary-50 text-tertiary-500',
    warning: 'bg-amber-50 text-amber-500',
  };
  return (
    <Card hover className="flex items-start gap-4">
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.primary}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-surface-700 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-heading font-bold text-surface-900 mt-1">{value}</p>
        {trend && (
          <p className={`text-xs font-medium mt-1 ${trend.positive ? 'text-tertiary-400' : 'text-error'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════
   BADGE
   ═══════════════════════════════════════════════════════════ */
interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'neutral' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'primary', size = 'sm', className = '' }: BadgeProps) {
  const colors: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-600 border-primary-200',
    success: 'bg-tertiary-50 text-tertiary-600 border-tertiary-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    neutral: 'bg-surface-200 text-surface-700 border-surface-300',
    error: 'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span className={`inline-flex items-center font-label font-semibold uppercase tracking-wider rounded-full border ${colors[variant]} ${size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'} ${className}`.trim()}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
  color?: 'primary' | 'success' | 'gradient';
}

export function ProgressBar({ value, max = 100, label, showValue = true, size = 'md', color = 'gradient' }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const barColor = {
    primary: 'bg-primary-500',
    success: 'bg-tertiary-400',
    gradient: 'gradient-success',
  };
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-surface-700">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-surface-800">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full rounded-full bg-surface-200 overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          className={`h-full rounded-full ${barColor[color]}`}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AVATAR
   ═══════════════════════════════════════════════════════════ */
export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`rounded-full gradient-primary flex items-center justify-center font-heading font-bold text-white ${sizeMap[size]}`}>
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════ */
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-surface-900">{title}</h2>
        {subtitle && <p className="text-surface-700 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════ */
export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary-400" />
      </div>
      <h3 className="font-heading font-bold text-lg text-surface-900 mb-2">{title}</h3>
      <p className="text-sm text-surface-700 max-w-sm">{description}</p>
    </div>
  );
}
