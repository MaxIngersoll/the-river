import { Component } from 'react';
import { clearAllData } from '../utils/storage';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[River] Uncaught error:', error, info.componentStack);
  }

  handleRetry = () => {
    // Force a clean state re-read by reloading the page
    // This ensures localStorage cache is refreshed
    window.location.reload();
  };

  handleReset = () => {
    clearAllData();
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-6">
          <div className="max-w-sm w-full text-center">
            <div className="text-4xl mb-4">{'\u{1F30A}'}</div>
            <h1 className="text-text font-bold text-xl mb-2">
              Something went wrong
            </h1>
            <p className="text-text-3 text-sm mb-8 leading-relaxed">
              The river hit a snag. You can try again, or clear your data and start fresh.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full text-white font-semibold py-3.5 rounded-full text-sm active:scale-[0.97] transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(30,64,175,0.95))',
                  boxShadow: '0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                Try Again
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-full text-sm font-medium text-coral active:scale-[0.97] transition-all"
              >
                Clear Data &amp; Restart
              </button>
            </div>

            {this.state.error && (
              <p className="text-text-3 text-[10px] mt-6 font-mono break-all opacity-50">
                {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
