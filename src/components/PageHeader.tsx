import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  return (
    <section className="bg-white border-b border-slate-300 hc-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Você está em" className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {idx > 0 && <span aria-hidden="true">/</span>}
                  {crumb.to ? (
                    <Link to={crumb.to} className="text-[#0047B3] hover:underline font-medium">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-slate-900 font-bold" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl">
            {badge && (
              <span className="block text-sm font-bold text-[#0047B3] mb-1 hc-accent">
                {badge}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              {title}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-700 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
        </div>
      </div>
    </section>
  );
};
