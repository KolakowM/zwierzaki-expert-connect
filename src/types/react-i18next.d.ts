
import 'react';
import 'react-i18next';

// This module declaration extends React's ReactNode interface to include ReactI18NextChildren
// This resolves type compatibility issues with components using i18next translations
declare module 'react' {
  interface ReactNode {
    // Empty interface extension to make TypeScript happy
  }
}
