'use client';

import { useId } from 'react';

// Hook para gerar IDs únicos e consistentes
export function useStableId(prefix: string = 'id'): string {
  const id = useId();
  return `${prefix}-${id}`;
}