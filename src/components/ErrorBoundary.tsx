import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-text-cool text-center">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-text-cool hover:text-primary">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 