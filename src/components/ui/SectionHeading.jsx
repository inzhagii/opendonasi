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
      className={`flex flex-col ${
        isCenter
          ? 'items-center text-center justify-center'
          : 'md:flex-row md:items-end justify-between'
      } gap-3 mb-6 md:mb-8 ${className}`}
    >
      <div className={isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        <h2 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
