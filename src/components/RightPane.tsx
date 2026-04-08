import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { CalendarState, CalendarAction } from '../types';
import { Grid } from './Grid';
import { NotesPanel } from './NotesPanel';
import styles from './RightPane.module.css';

import { prepare, layout } from '@chenglou/pretext';

interface Props {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
}

export function RightPane({ state, dispatch }: Props) {
  useEffect(() => {
    const prepared = prepare(format(state.currentMonth, 'MMMM yyyy'), '600 28px system-ui');
    const { height } = layout(prepared, 200, 34);
    void height;
  }, [state.currentMonth]);

  const animClass = state.direction === 'next' ? styles.flipUp : state.direction === 'prev' ? styles.flipDown : '';

  return (
    <div className={styles.pane}>
      <div className={styles.notesContainer}>
        <NotesPanel state={state} dispatch={dispatch} />
      </div>
      <div className={styles.calendarContainer}>
        <header className={styles.header}>
          <h2 className={styles.title} style={{ textWrap: 'balance' }}>
            {format(state.currentMonth, 'MMMM yyyy')}
          </h2>
          <div className={styles.nav}>
            <button className={styles.btn} onClick={() => dispatch({ type: 'PREV_MONTH' })}><ChevronLeft size={20}/></button>
            <button className={styles.btn} onClick={() => dispatch({ type: 'NEXT_MONTH' })}><ChevronRight size={20}/></button>
          </div>
        </header>
        <div key={state.currentMonth.getTime()} className={`${styles.gridWrapper} ${animClass}`}>
          <Grid state={state} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}