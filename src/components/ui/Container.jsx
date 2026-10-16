/**
 * Komponen Container Layout Terpusat
 * Mengikuti batasan maksimal 1320px sesuai DESIGN_SYSTEM.md
 */

export function Container({ children, className = '', as: Component = 'div', ...props }) {
  return (
    <Component
      className={`w-full max-w-desktop mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
