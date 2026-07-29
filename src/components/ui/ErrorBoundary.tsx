"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught production error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 font-bold text-2xl">
            !
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="font-serif text-3xl font-bold text-white">Something Went Wrong</h1>
            <p className="text-sm text-zinc-400">
              An unexpected error occurred while loading this page. Our technical team has been notified.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-gold px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
