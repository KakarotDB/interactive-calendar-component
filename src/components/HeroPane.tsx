import { format } from 'date-fns';
import styles from './HeroPane.module.css';
import heroImg from '../assets/hero.png';

export function HeroPane() {
  const today = new Date();
  return (
    <div className={styles.hero}>
      <img src={heroImg} alt="Calendar Hero" className={styles.heroImage} />
      <div className={styles.overlay}>
        <div className={styles.todayDate}>
          <span className={styles.day}>{format(today, 'dd')}</span>
          <span className={styles.month}>{format(today, 'MMMM yyyy')}</span>
        </div>
      </div>
    </div>
  );
}