const toneClasses = {
  slate: {
    shell: 'border-slate-200 bg-slate-50/90 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200',
    icon: 'bg-white text-slate-900 shadow-[0_12px_24px_rgba(15,23,42,0.08)] dark:bg-slate-950 dark:text-white dark:shadow-none',
    title: 'text-slate-950 dark:text-white',
    description: 'text-slate-600 dark:text-slate-300',
  },
  sky: {
    shell: 'border-sky-100 bg-[linear-gradient(135deg,rgba(224,242,254,0.88),rgba(255,255,255,0.96))] text-sky-950 dark:border-sky-900/40 dark:bg-[linear-gradient(135deg,rgba(12,74,110,0.35),rgba(15,23,42,0.9))] dark:text-sky-100',
    icon: 'bg-white text-sky-700 shadow-[0_14px_30px_rgba(14,165,233,0.15)] dark:bg-slate-950 dark:text-sky-300 dark:shadow-none',
    title: 'text-slate-950 dark:text-white',
    description: 'text-slate-700 dark:text-slate-200',
  },
  emerald: {
    shell: 'border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(255,255,255,0.96))] text-emerald-950 dark:border-emerald-900/40 dark:bg-[linear-gradient(135deg,rgba(6,78,59,0.34),rgba(15,23,42,0.9))] dark:text-emerald-100',
    icon: 'bg-white text-emerald-700 shadow-[0_14px_30px_rgba(16,185,129,0.14)] dark:bg-slate-950 dark:text-emerald-300 dark:shadow-none',
    title: 'text-slate-950 dark:text-white',
    description: 'text-slate-700 dark:text-slate-200',
  },
};

export const AuthSectionHeader = ({ eyebrow, badge, title, description }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        {eyebrow}
      </span>
      {badge ? (
        <span className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sky-800 dark:border-sky-900/40 dark:bg-sky-950/40 dark:text-sky-200">
          {badge}
        </span>
      ) : null}
    </div>

    <div className="space-y-3">
      <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-950 dark:text-white sm:text-[2.35rem]">
        {title}
      </h2>
      <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[0.97rem]">
        {description}
      </p>
    </div>
  </div>
);

export const AuthInputField = ({ label, icon, hint, className = '', ...props }) => (
  <label className="block">
    <div className="mb-2 flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {hint ? <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{hint}</span> : null}
    </div>

    <div className="group relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-700 dark:text-slate-500 dark:group-focus-within:text-sky-300">
        {icon}
      </span>
      <input
        {...props}
        className={`block w-full rounded-xl border border-slate-300 bg-white px-12 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 ${className}`}
        required
      />
    </div>
  </label>
);

export const AuthDivider = ({ label }) => (
  <div className="relative py-1 text-center">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-slate-200 dark:border-slate-800" />
    </div>
    <span className="relative inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:shadow-none">
      {label}
    </span>
  </div>
);

export const AuthFootnote = ({ children }) => (
  <p className="text-center text-xs text-slate-500 dark:text-slate-400">
    {children}
  </p>
);

export const AuthInfoCard = ({ icon, title, description, tone = 'slate', children }) => {
  const currentTone = toneClasses[tone] || toneClasses.slate;

  return (
    <div className={`rounded-[1.6rem] border px-4 py-4 shadow-[0_18px_36px_rgba(15,23,42,0.05)] ${currentTone.shell}`}>
      <div className="flex items-start gap-3">
        <div className={`inline-flex rounded-2xl p-3 ${currentTone.icon}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-extrabold uppercase tracking-[0.16em] ${currentTone.title}`}>
            {title}
          </div>
          {description ? (
            <p className={`mt-2 text-sm leading-6 ${currentTone.description}`}>{description}</p>
          ) : null}
          {children ? <div className="mt-3">{children}</div> : null}
        </div>
      </div>
    </div>
  );
};
