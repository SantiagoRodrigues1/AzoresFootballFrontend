import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI error', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.16),_transparent_36%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] px-6">
          <div className="w-full max-w-md rounded-[32px] border border-border/70 bg-card/95 p-8 text-center shadow-[0_32px_70px_-36px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">Algo correu mal</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Ocorreu um erro inesperado. Recarregar a aplicação normalmente resolve falhas transitórias sem perder o estado do servidor.
            </p>
            <Button className="mt-6 rounded-full" onClick={this.handleReload}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Recarregar aplicação
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}