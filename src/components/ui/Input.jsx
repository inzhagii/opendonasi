/**
 * Komponen Input Teks yang Aksesibel
 * Mendukung label, ikon awalan, pesan helper, dan pesan error validasi
 */

export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = inputId ? `${inputId}-error` : undefined;
  const helperId = inputId ? `${inputId}-helper` : undefined;

  const describedBy = [error ? errorId : null, helperText ? helperId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary mb-1.5 select-none"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative rounded-input">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
            {Icon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={`w-full rounded-input border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-background-soft disabled:text-disabled disabled:cursor-not-allowed ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-error focus:ring-error'
              : 'border-border hover:border-gray-400'
          }`}
          {...props}
        />
      </div>

      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-error flex items-center gap-1" role="alert">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1.5 text-xs text-text-secondary">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
