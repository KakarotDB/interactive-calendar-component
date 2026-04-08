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
    if (!state.startDate) return 'general';
    if (!state.endDate || state.startDate.getTime() === state.endDate.getTime()) {
      return format(state.startDate, 'yyyy-MM-dd');
    }
    return `${format(state.startDate, 'yyyy-MM-dd')}_${format(state.endDate, 'yyyy-MM-dd')}`;
  };

  const key = getKey();

  useEffect(() => {
    setText(state.notes[key] || '');
  }, [key, state.notes]);

  const handleSave = () => {
    dispatch({ type: 'SAVE_NOTE', key, text });
  };

  const displayTitle = state.startDate && state.endDate && state.startDate.getTime() !== state.endDate.getTime()
    ? `${format(state.startDate, 'MMM d')} - ${format(state.endDate, 'MMM d')}`
    : state.startDate ? format(state.startDate, 'MMM d, yyyy') : 'General Notes';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3 className={styles.title}>{displayTitle}</h3>
      </header>
      <textarea 
        className={styles.textarea}
        placeholder="Write your memo here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
      />
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}