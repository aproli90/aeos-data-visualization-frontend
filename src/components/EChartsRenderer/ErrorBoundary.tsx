import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ChartErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-1">
              Chart Rendering Error
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">
              {this.state.error?.message || 'An error occurred while rendering the chart'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}