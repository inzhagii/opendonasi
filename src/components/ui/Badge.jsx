/**
 * Komponen Badge untuk kategori dan label status semantik
 */

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 leading-none',
    md: 'text-xs px-2.5 py-1 gap-1.5 leading-none',
  };

  const variantStyles = {
    primary: 'bg-primary-soft text-primary border border-primary/20',
    success: 'bg-green-50 text-success border border-green-200',
    warning: 'bg-amber-50 text-warning border border-amber-200',
    error: 'bg-red-50 text-error border border-red-200',
    neutral: 'bg-gray-100 text-text-secondary border border-border',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    >
      {Icon && <span className="shrink-0">{Icon}</span>}
      <span>{children}</span>
    </span>
  );
}
