import React from 'react';
import { IoWarningOutline, IoRefreshOutline, IoPlanetOutline, IoLockClosedOutline, IoWifiOutline } from 'react-icons/io5';

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  icon = <IoWarningOutline aria-hidden="true" />,
  showRetry = true,
  onRetry,
  showReload = false,
  variant = "default", // "default" | "network" | "notFound" | "permission"
  size = "medium" // "small" | "medium" | "large"
}) {
  
  // Dynamic Configuration based on Variant
  const variantConfig = {
    default: {
      accent: 'rose',
      orbColor: 'bg-rose-200/40',
      iconBg: 'bg-rose-50',
      iconText: 'text-rose-500',
      defaultIcon: <IoWarningOutline />
    },
    network: {
      accent: 'amber',
      orbColor: 'bg-amber-200/40',
      iconBg: 'bg-amber-50',
      iconText: 'text-amber-600',
      defaultIcon: <IoWifiOutline />
    },
    notFound: {
      accent: 'indigo',
      orbColor: 'bg-indigo-200/40',
      iconBg: 'bg-indigo-50',
      iconText: 'text-indigo-600',
      defaultIcon: <IoPlanetOutline />
    },
    permission: {
      accent: 'slate',
      orbColor: 'bg-slate-200/40',
      iconBg: 'bg-slate-100',
      iconText: 'text-slate-600',
      defaultIcon: <IoLockClosedOutline />
    }
  };

  const config = variantConfig[variant] || variantConfig.default;

  const sizeStyles = {
    small: { container: 'p-6 rounded-3xl', icon: 'w-12 h-12 text-xl', title: 'text-lg', message: 'text-xs' },
    medium: { container: 'p-10 rounded-[2.5rem]', icon: 'w-20 h-20 text-4xl', title: 'text-2xl', message: 'text-sm' },
    large: { container: 'p-16 rounded-[3.5rem]', icon: 'w-28 h-28 text-6xl', title: 'text-4xl', message: 'text-base' }
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <div className="relative flex items-center justify-center w-full min-h-300px transition-all duration-700">
      
      {/* Ambient Backdrop - Changes color based on error type */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 ${config.orbColor} rounded-full blur-[100px] pointer-events-none animate-pulse`} />

      <div className={`relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-slate-200/50 flex flex-col items-center text-center ${currentSize.container}`}>
        
        {/* Animated Icon Container */}
        <div className={`${currentSize.icon} ${config.iconBg} ${config.iconText} rounded-[30%] flex items-center justify-center mb-6 shadow-sm border border-white/50 transition-transform duration-500 hover:rotate-12`}>
          {icon || config.defaultIcon}
        </div>

        <h3 className={`${currentSize.title} font-black text-slate-900 tracking-tighter mb-3 leading-tight`}>
          {title}
        </h3>
        
        <p className={`${currentSize.message} text-slate-500 font-medium mb-8 leading-relaxed max-w-xs mx-auto`}>
          {message}
        </p>

        {(showRetry || showReload) && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {showRetry && onRetry && (
              <button
                onClick={onRetry}
                className="group flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-full font-bold shadow-lg shadow-slate-900/20 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 active:scale-95"
              >
                <IoRefreshOutline className="text-lg group-hover:rotate-180 transition-transform duration-500" />
                <span>Try Again</span>
              </button>
            )}
            
            {showReload && (
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3.5 text-slate-600 font-bold rounded-full hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-200"
              >
                Reload Page
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}