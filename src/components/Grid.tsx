import { useMemo } from 'react';
import { isSameMonth, isSameDay, format, isWithinInterval, isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import { getCalendarDays } from '../utils/date';
import { CalendarState, CalendarAction } from '../types';
import styles from './Grid.module.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
}

export function Grid({ state, dispatch }: Props) {
  const days = useMemo(() => getCalendarDays(state.currentMonth), [state.currentMonth]);

  // Pre-calculate selection interval to avoid repeated checks
  const selectionInterval = useMemo(() => {
    if (!state.startDate) return null;
    
    let start = state.startDate;
    let end = state.endDate || state.hoverDate || state.startDate;
    
    if (isBefore(end, start)) {
      [start, end] = [end, start];
    }
    
    return { start: startOfDay(start), end: endOfDay(end) };
  }, [state.startDate, state.endDate, state.hoverDate]);

  // Pre-calculate which days have notes using a Set for O(1) lookup
  const daysWithNotes = useMemo(() => {
    const noteDays = new Set<string>();
    state.notes.forEach(note => {
      const start = parseISO(note.startStr);
      const end = parseISO(note.endStr);
      
      // We only care about days visible in the current grid
      days.forEach(day => {
        if (isWithinInterval(day, { start, end })) {
          noteDays.add(day.toDateString());
        }
      });
    });
    return noteDays;
  }, [state.notes, days]);

  return (
    <div>
      <div className={styles.grid}>
        {DAYS.map(d => <div key={d} className={styles.dayName}>{d}</div>)}
        {days.map(date => {
          const dateStr = date.toDateString();
          const isSelected = (state.startDate && isSameDay(date, state.startDate)) || (state.endDate && isSameDay(date, state.endDate));
          const inRange = selectionInterval ? isWithinInterval(date, selectionInterval) : false;
          const isMuted = !isSameMonth(date, state.currentMonth);
          const dateHasNote = daysWithNotes.has(dateStr);
          
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