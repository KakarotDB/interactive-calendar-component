declare module 'react-pretext' {
  import { FC, ReactNode } from 'react';
  
  export interface PretextLineInfo {
    key: string;
    text: string;
    width: number;
    y: number;
    index: number;
  }

  export const Pretext: {
    Root: FC<{ text: string; width: number; font?: string; lineHeight?: number; children?: ReactNode }>;
    Lines: FC<{ children: (line: PretextLineInfo, index: number) => ReactNode }>;
  };
}