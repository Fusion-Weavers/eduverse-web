// Shared Design System Components for Eduverse

// --- Background Components ---
export const AmbientBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50">
    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] opacity-70" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] opacity-70" />
    <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-sky-200/40 rounded-full blur-[80px] opacity-60" />
  </div>
);

// --- Glass Card Component ---
export const GlassCard = ({ children, className = "", hoverEffect = true, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-sm 
      ${hoverEffect ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/80' : ''} 
      ${onClick ? 'cursor-pointer' : ''}
      ${className}`}
  >
    <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/50 pointer-events-none" />
    {children}
  </div>
);

// --- Button Components ---
export const PrimaryButton = ({ children, onClick, className = "", disabled = false, type = "button" }) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`group flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-1 hover:bg-slate-800 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, onClick, className = "", disabled = false, type = "button" }) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`group flex items-center justify-center gap-2 px-8 py-4 bg-white/50 backdrop-blur-md border border-slate-200 text-slate-700 rounded-full font-bold text-sm transition-all duration-300 hover:bg-white hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const BackButton = ({ onClick, className = "" }) => (
  <button 
    onClick={onClick}
    className={`group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-slate-600 font-bold text-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-x-1 ${className}`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    Back
  </button>
);

// --- Badge Components ---
export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    primary: "bg-indigo-50 text-indigo-700 border-indigo-100",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const DifficultyBadge = ({ difficulty }) => {
  const variants = {
    Easy: "success",
    Beginner: "success",
    beginner: "success",
    Medium: "warning",
    Intermediate: "warning",
    intermediate: "warning",
    Hard: "danger",
    Advanced: "danger",
    advanced: "danger",
  };

  return <Badge variant={variants[difficulty] || "default"}>{difficulty}</Badge>;
};

// --- Heading Components ---
export const PageHeader = ({ title, subtitle, icon: Icon, badge }) => (
  <div className="mb-12">
    {badge && (
      <div className="mb-4">
        {badge}
      </div>
    )}
    <div className="flex items-center gap-3 mb-4">
      {Icon && (
        <div className="p-2 bg-slate-100 rounded-xl text-slate-900">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{title}</h1>
    </div>
    {subtitle && <p className="text-lg text-slate-500 max-w-2xl font-medium">{subtitle}</p>}
  </div>
);

export const SectionHeading = ({ icon: Icon, title, subtitle, action }) => (
  <div className="mb-8 flex items-end justify-between">
    <div>
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="p-2 bg-slate-100 rounded-xl text-slate-900">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-slate-500 text-base max-w-2xl">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// --- Input Components ---
export const Input = ({ icon: Icon, label, error, className = "", ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
        {label}
      </label>
    )}
    <div className="relative group">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Icon className="text-xl" />
        </div>
      )}
      <input
        className={`block w-full rounded-2xl border-0 bg-slate-50/80 py-4 ${Icon ? 'pl-12' : 'pl-4'} pr-4 text-slate-900 shadow-inner ring-1 ring-slate-200/50 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:scale-[1.01] ${className}`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-xs text-red-600 ml-1">{error}</p>
    )}
  </div>
);

// --- Alert Components ---
export const Alert = ({ children, variant = "info", icon: Icon, className = "" }) => {
  const variants = {
    info: "border-blue-100 bg-blue-50/80 text-blue-600",
    success: "border-emerald-100 bg-emerald-50/80 text-emerald-600",
    warning: "border-amber-100 bg-amber-50/80 text-amber-600",
    error: "border-red-100 bg-red-50/80 text-red-600",
  };

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 backdrop-blur-sm animate-fadeIn ${variants[variant]} ${className}`}>
      {Icon && <Icon className="mt-0.5 shrink-0 text-lg" />}
      <div className="font-medium">{children}</div>
    </div>
  );
};

// --- Empty State Component ---
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/40 py-20 px-6 text-center backdrop-blur-xl">
    {Icon && (
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400 shadow-inner">
        <Icon className="h-10 w-10" />
      </div>
    )}
    <h3 className="mb-3 text-2xl font-bold text-slate-900">{title}</h3>
    {description && (
      <p className="mb-8 max-w-md text-slate-500">{description}</p>
    )}
    {action && <div>{action}</div>}
  </div>
);

// --- Loading Spinner ---
export const Spinner = ({ size = "md" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div className={`animate-spin rounded-full border-slate-200 border-t-slate-900 ${sizes[size]}`} />
  );
};

// --- Stat Card Component ---
export const StatCard = ({ icon: Icon, value, label, colorClass = "bg-indigo-500" }) => (
  <GlassCard className="p-6" hoverEffect={true}>
    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-xl ${colorClass}`} />
    <div className="relative z-10 flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass.replace('bg-', 'bg-opacity-10 bg-')} text-xl`}>
        <Icon className={colorClass.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-3xl font-black tracking-tight text-slate-900">{value}</p>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  </GlassCard>
);
