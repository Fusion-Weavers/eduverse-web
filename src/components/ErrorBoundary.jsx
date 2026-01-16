import React from 'react';
import { IoWarningOutline, IoRefreshOutline, IoBugOutline, IoChevronDownOutline } from 'react-icons/io5';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });

    if (process.env.NODE_ENV === 'production') {
      // Integration point for Sentry/LogRocket
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;

      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
          />
        );
      }

      return (
        <div className="relative flex items-center justify-center min-h-400px w-full p-6 md:p-12 overflow-hidden">
          {/* Ambient Background Blur for continuity */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-300px h-300px bg-rose-200/40 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 w-full max-w-2xl bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 text-center">
            
            {/* Visual Indicator */}
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-sm border border-rose-100/50 transition-transform duration-500 hover:rotate-12">
              <IoWarningOutline />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
              Interface <span className="text-rose-500">Interruption</span>
            </h2>
            
            <p className="text-slate-500 font-medium mb-10 leading-relaxed max-w-md mx-auto">
              We encountered an unexpected rendering issue. Our team has been notified, and we're ready to recover your session.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button
                onClick={this.handleRetry}
                className="group flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg shadow-slate-900/20 transition-all duration-300 hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-1 active:scale-95"
              >
                <IoRefreshOutline className="text-xl group-hover:rotate-180 transition-transform duration-500" />
                <span>Restore Component</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 text-slate-600 font-bold rounded-full hover:bg-slate-100 transition-colors"
              >
                Reload Experience
              </button>
            </div>

            {/* Error Details Accordion */}
            {showDetails && this.state.error && (
              <div className="text-left">
                <details className="group border-t border-slate-100 pt-6">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <IoBugOutline /> Developer Insight
                    </span>
                    <IoChevronDownOutline className="transition-transform group-open:rotate-180" />
                  </summary>
                  
                  <div className="mt-6 p-6 bg-slate-900 rounded-3xl overflow-hidden shadow-inner">
                    <pre className="text-[11px] font-mono text-rose-400 leading-relaxed overflow-x-auto max-h-200px scrollbar-thin scrollbar-thumb-slate-700">
                      <span className="text-indigo-400 font-bold uppercase block mb-2">Error Trace:</span>
                      {this.state.error.toString()}
                      <div className="mt-4 border-t border-slate-800 pt-4 text-slate-500">
                         {this.state.errorInfo.componentStack}
                      </div>
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;