import type { ReactNode } from 'react';
import { InitialPath } from './navigation';

export function Router({ path, children }: { path: string; children: ReactNode }) {
  return <InitialPath.Provider value={path}>{children}</InitialPath.Provider>;
}
