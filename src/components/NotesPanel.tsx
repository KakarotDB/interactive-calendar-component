import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarState, CalendarAction } from '../types';
import styles from './NotesPanel.module.css';

interface Props {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
}

export function NotesPanel({ state, dispatch }: Props) {
  const [text, setText] = useState('');

  const getKey = () => {
    if (!state.startDate) return '';
    if (!state.endDate || state.startDate.getTime() === state.endDate.getTime()) {
      return format(state.startDate, 'yyyy-MM-dd');
    }
    return `${format(state.startDate, 'yyyy-MM-dd')}_${format(state.endDate, 'yyyy-MM-dd')}`;
  };

  const key = getKey();

  useEffect(() => {
    if (state.view === 'NOTES' && key) {
      setText(state.notes[key] || '');
    }
  }, [state.view, key, state.notes]);

  const handleSave = () => {
    dispatch({ type: 'SAVE_NOTE', key, text });
    dispatch({ type: 'CLOSE_NOTES' });
  };

  const displayTitle = state.startDate && state.endDate && state.startDate.getTime() !== state.endDate.getTime()
    ? `${format(state.startDate, 'MMM d')} - ${format(state.endDate, 'MMM d')}`
    : state.startDate ? format(state.startDate, 'MMM d, yyyy') : '';

  return (
    <div className={`${styles.overlay} ${state.view === 'NOTES' ? styles.visible : ''}`}>
      <header className={styles.header}>
        <h3 className={styles.title}>Notes for {displayTitle}</h3>
      </header>
      <textarea 
        className={styles.textarea}
        placeholder="Write something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus={state.view === 'NOTES'}
      />
      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => dispatch({ type: 'CLOSE_NOTES' })}>Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>Save & Return</button>
      </div>
    </div>
  );
}