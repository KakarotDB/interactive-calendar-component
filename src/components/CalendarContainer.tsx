import { ReactNode } from 'react';
import styles from './CalendarContainer.module.css';

export function CalendarContainer({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {children}
      </div>
    </div>
  );
}