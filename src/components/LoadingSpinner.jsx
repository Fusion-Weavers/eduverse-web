import React from 'react';

export default function LoadingSpinner({ 
  size = 'medium', 
  message = 'Processing...', 
  overlay = false,
  color = 'primary',
  showProgress = false,
  progress = 0
}) {
  const sizeStyles = {
    small: { ring: 'w-12 h-12', text: 'text-[10px]', stroke: 2, container: 'gap-3' },
    medium: { ring: 'w-24 h-24', text: 'text-xs', stroke: 3, container: 'gap-6' },
    large: { ring: 'w-40 h-40', text: 'text-lg', stroke: 4, container: 'gap-8' }
  };

  const colorConfig = {
    primary: 'stroke-indigo-500 text-indigo-600 bg-indigo-500/10',
    secondary: 'stroke-slate-900 text-slate-900 bg-slate-900/10',
    success: 'stroke-emerald-500 text-emerald-600 bg-emerald-500/10',
    warning: 'stroke-amber-500 text-amber-600 bg-amber-500/10',
    danger: 'stroke-rose-500 text-rose-600 bg-rose-500/10'
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;
  const currentColor = colorConfig[color] || colorConfig.primary;

  const content = (
    <div className={`flex flex-col items-center justify-center ${currentSize.container}`}>
      <div className={`relative ${currentSize.ring} flex items-center justify-center`}>
        {/* Ambient Glow Background */}
        <div className={`absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse ${currentColor.split(' ')[2]}`} />
        
        {/* Glass Ring Base */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth={currentSize.stroke}
            className="text-slate-200/40"
          />
          {/* Animated Progress/Spin Ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth={currentSize.stroke}
            strokeLinecap="round"
            strokeDasharray={showProgress ? `${283 * (progress / 100)} 283` : "70 283"}
            className={`${currentColor.split(' ')[0]} transition-all duration-700 ease-out ${!showProgress && 'animate-[spin_2s_linear_infinite]'}`}
          />
        </svg>

        {/* Center Text/Icon */}
        <div className="relative z-10 flex flex-col items-center">
          {showProgress ? (
            <span className={`${currentSize.text} font-black tracking-tighter text-slate-900`}>
              {Math.round(progress)}%
            </span>
          ) : (
             <div className={`w-2 h-2 rounded-full animate-bounce ${currentColor.split(' ')[2].replace('/10', '')}`} />
          )}
        </div>
      </div>

      {message && (
        <div className="relative">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">
            {message}
          </p>
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-50/60 backdrop-blur-xl animate-in fade-in duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-400px h-400px bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative bg-white/40 border border-white/60 p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50">
          {content}
        </div>
      </div>
    );
  }

  return <div className="p-8 flex justify-center items-center">{content}</div>;
}