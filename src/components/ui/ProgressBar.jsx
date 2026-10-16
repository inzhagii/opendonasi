/**
 * Komponen ProgressBar untuk visualisasi progres dana kampanye
 * Menggunakan warna brand #2E7DFA dan background track #E5E7EB
 */

export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  className = '',
  showLabel = false,
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`w-full bg-border rounded-full overflow-hidden ${sizeStyles[size] || sizeStyles.md}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs font-semibold text-primary">
          {percentage}%
        </div>
      )}
    </div>
  );
}
