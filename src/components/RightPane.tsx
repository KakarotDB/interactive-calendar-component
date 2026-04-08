import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pretext } from 'pretext';
import { CalendarState, CalendarAction } from '../types';
import { Grid } from './Grid';
import { NotesPanel } from './NotesPanel';
import styles from './RightPane.module.css';

interface Props {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
}

export function RightPane({ state, dispatch }: Props) {
  return (
    <div className={styles.pane}>
      <div 
        style={{ 
          opacity: state.view === 'NOTES' ? 0 : 1, 
          transition: 'opacity 0.3s', 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>
            <Pretext>{format(state.currentMonth, 'MMMM yyyy')}</Pretext>
          </h2>
          <div className={styles.nav}>
            <button className={styles.btn} onClick={() => dispatch({ type: 'PREV_MONTH' })}><ChevronLeft size={20}/></button>
            <button className={styles.btn} onClick={() => dispatch({ type: 'NEXT_MONTH' })}><ChevronRight size={20}/></button>
          </div>
        </header>
        <Grid state={state} dispatch={dispatch} />
      </div>
      <NotesPanel state={state} dispatch={dispatch} />
    </div>
  );
}