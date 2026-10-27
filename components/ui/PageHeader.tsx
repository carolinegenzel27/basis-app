import { ui } from "@/lib/ui";

// The same header on every in-app screen: an illustration tile, the title,
// a short subtitle, and optional actions on the other side.
export function PageHeader({
  title,
  subtitle,
  icon,
  tint = "bg-sky-soft",
  actions,
}: {
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  tint?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        {icon && (
          <div className={`w-14 h-14 rounded-2xl ${tint} flex items-center justify-center shrink-0`} aria-hidden="true">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className={ui.h1}>{title}</h1>
          {subtitle && <p className={`${ui.muted} mt-1`}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
