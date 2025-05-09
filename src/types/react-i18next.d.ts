import 'react';
import 'react-i18next';

// This module tells TypeScript that the standard ReactNode type
// should also accept the ReactI18NextChildren type from react-i18next.
// This resolves the type mismatch when you use t()
// directly as children of UI components that expect ReactNode.
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ReactNode extends import('react-i18next').ReactI18NextChildren {}
}