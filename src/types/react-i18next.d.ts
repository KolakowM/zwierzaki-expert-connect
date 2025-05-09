
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  // Extend the TransProps interface
  interface TransProps {
    children?: ReactNode;
  }

  // Make ReactI18NextChildren compatible with ReactNode
  type ReactI18NextChildren = ReactNode;
}
