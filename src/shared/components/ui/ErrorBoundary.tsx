import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-chalk-bg flex items-center justify-center p-6">
          <Card className="max-w-[440px] w-full p-8 text-center">
            <span className="text-4xl mb-4 block">😵</span>

            <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-chalk-header mb-2">
              Щось пішло не так
            </h1>

            <p className="text-sm text-chalk-muted mb-6">
              Виникла непередбачена помилка. Спробуйте оновити сторінку або
              повернутися на головну.
            </p>

            {this.state.error && (
              <p className="text-[12px] text-chalk-muted bg-chalk-sidebar rounded-md px-3 py-2 mb-6 font-mono break-all text-left">
                {this.state.error.message}
              </p>
            )}

            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" size="sm" onClick={this.handleReset}>
                Спробувати ще
              </Button>
              <Button size="sm" onClick={this.handleReload}>
                На головну
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
