/**
 * Komponen SectionHeading untuk judul dan pengantar seksi
 * Mengikuti hierarki H2 desktop (24px) / mobile (22px)
 */

export function SectionHeading({
  title,
  subtitle,
  action,
  align = 'left',
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8 ${isCenter ? 'text-center md:flex-col md:items-center' : ''} ${className}`}
    >
      <div className={isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        <h2 className="text-h2-mobile md:text-h2 font-bold text-text-primary tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 md:mt-2 text-sm md:text-base text-text-secondary leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
