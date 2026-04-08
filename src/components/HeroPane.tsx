import { format } from 'date-fns';
import styles from './HeroPane.module.css';

export function HeroPane() {
  const today = new Date();
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.todayDate}>
          <span className={styles.day}>{format(today, 'dd')}</span>
          <span className={styles.month}>{format(today, 'MMMM yyyy')}</span>
        </div>
      </div>
    </div>
  );
}