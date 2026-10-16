/**
 * Komponen Button Reusable
 * Variants: 'primary', 'secondary', 'outline', 'text'
 * Sizes: 'sm', 'md', 'lg'
 */

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-button';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px]',
  };

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark/90 shadow-sm border border-transparent',
    secondary:
      'bg-primary-soft text-primary hover:bg-blue-100 active:bg-blue-200 border border-primary/20',
    outline:
      'bg-white text-text-primary border border-border hover:bg-background-soft hover:border-gray-300 active:bg-gray-100 shadow-sm',
    text:
      'bg-transparent text-text-secondary hover:text-text-primary hover:bg-background-soft border border-transparent',
  };

  const widthStyle = isFullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${widthStyle} ${className}`}
      {...props}
    >
      {Icon && <span className="inline-flex shrink-0">{Icon}</span>}
      <span>{children}</span>
    </button>
  );
}
