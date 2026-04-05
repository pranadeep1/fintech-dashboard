import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: '40px 20px',
          textAlign: 'center',
          gap: '16px'
        }}>
          <AlertTriangle size={48} strokeWidth={1.5} style={{ color: '#eab308' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: 400 }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--gradient-primary)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginTop: '8px'
            }}
          >
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
