import { isSameMonth, isSameDay, format, isWithinInterval, isBefore, parseISO } from 'date-fns';
import { getCalendarDays } from '../utils/date';
import { CalendarState, CalendarAction } from '../types';
import styles from './Grid.module.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
}

export function Grid({ state, dispatch }: Props) {
  const days = getCalendarDays(state.currentMonth);

  const checkInRange = (date: Date) => {
    if (!state.startDate) return false;
    if (state.endDate) {
      return isWithinInterval(date, { start: state.startDate, end: state.endDate });
    }
    if (state.hoverDate) {
      const s = isBefore(state.startDate, state.hoverDate) ? state.startDate : state.hoverDate;
      const e = isBefore(state.startDate, state.hoverDate) ? state.hoverDate : state.startDate;
      return isWithinInterval(date, { start: s, end: e });
    }
    return false;
  };

  const hasNote = (date: Date) => {
    // Check if the date falls within ANY of the saved notes' ranges
    return state.notes.some(note => {
      const start = parseISO(note.startStr);
      const end = parseISO(note.endStr);
      return isWithinInterval(date, { start, end });
    });
  };

  return (
    <div>
      <div className={styles.grid}>
        {DAYS.map(d => <div key={d} className={styles.dayName}>{d}</div>)}
        {days.map(date => {
          const isSelected = (state.startDate && isSameDay(date, state.startDate)) || (state.endDate && isSameDay(date, state.endDate));
          const inRange = checkInRange(date);
          const isMuted = !isSameMonth(date, state.currentMonth);
          const dateHasNote = hasNote(date);
          
          let cls = styles.cell;
          if (isSelected) cls += ` ${styles.selected}`;
          else if (inRange) cls += ` ${styles.inRange}`;
          if (isMuted && !isSelected) cls += ` ${styles.muted}`;

          return (
            <div 
              key={date.toISOString()} 
              className={cls}
              onClick={() => dispatch({ type: 'CLICK_DATE', date })}
              onMouseEnter={() => dispatch({ type: 'HOVER_DATE', date })}
            >
              <span className={styles.dayNum}>{format(date, 'd')}</span>
              {dateHasNote && !isSelected && <div className={styles.noteIndicator}></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}