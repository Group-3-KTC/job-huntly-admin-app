import React, { type ReactNode } from "react";
import Error500 from "../features/error/Error500";

interface State {
  hasError: boolean;
}

class AppErrorBoundary extends React.Component<{ children: ReactNode }, State> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App crashed: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Error500 />;
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
