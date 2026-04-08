import { useReducer, useEffect } from 'react';
import { addMonths, subMonths, isBefore } from 'date-fns';
import { CalendarState, CalendarAction } from '../types';

const getInitialState = (): CalendarState => {
  const saved = localStorage.getItem('calendarNotes');
  return {
    currentMonth: new Date(),
    view: 'CALENDAR',
    phase: 'IDLE',
    startDate: null,
    endDate: null,
    hoverDate: null,
    notes: saved ? JSON.parse(saved) : {},
  };
};

function reducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'NEXT_MONTH':
      return { ...state, currentMonth: addMonths(state.currentMonth, 1) };
    case 'PREV_MONTH':
      return { ...state, currentMonth: subMonths(state.currentMonth, 1) };
    case 'CLICK_DATE':
      if (state.phase === 'IDLE') {
        return { ...state, phase: 'SELECTING_END', startDate: action.date, endDate: null, hoverDate: null };
      }
      if (state.phase === 'SELECTING_END') {
        if (!state.startDate) return state;
        
        let start = state.startDate;
        let end = action.date;
        
        if (isBefore(end, start)) {
          start = action.date;
          end = state.startDate;
        }
        
        return { ...state, phase: 'IDLE', startDate: start, endDate: end, view: 'NOTES' };
      }
      return state;
    case 'HOVER_DATE':
      if (state.phase !== 'SELECTING_END') return state;
      return { ...state, hoverDate: action.date };
    case 'CLEAR_SELECTION':
      return { ...state, phase: 'IDLE', startDate: null, endDate: null, hoverDate: null };
    case 'OPEN_NOTES':
      return { ...state, view: 'NOTES' };
    case 'CLOSE_NOTES':
      return { ...state, view: 'CALENDAR', phase: 'IDLE', startDate: null, endDate: null, hoverDate: null };
    case 'SAVE_NOTE':
      return { ...state, notes: { ...state.notes, [action.key]: action.text } };
    default:
      return state;
  }
}

export function useCalendarState() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  useEffect(() => {
    localStorage.setItem('calendarNotes', JSON.stringify(state.notes));
  }, [state.notes]);

  return { state, dispatch };
}