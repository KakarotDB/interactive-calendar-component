import { useReducer, useEffect } from 'react';
import { addMonths, subMonths, isBefore, isSameDay } from 'date-fns';
import { CalendarState, CalendarAction } from '../types';

const getInitialState = (): CalendarState => {
  const saved = localStorage.getItem('calendarNotesArray');
  // migrate old format if needed, but for simplicity we assume fresh start or handle empty
  let parsedNotes = [];
  try {
    if (saved) parsedNotes = JSON.parse(saved);
  } catch (e) {}

  return {
    currentMonth: new Date(),
    view: 'CALENDAR',
    phase: 'IDLE',
    startDate: null,
    endDate: null,
    hoverDate: null,
    notes: Array.isArray(parsedNotes) ? parsedNotes : [],
    direction: 'none',
  };
};

function reducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'NEXT_MONTH':
      return { ...state, currentMonth: addMonths(state.currentMonth, 1), direction: 'next' };
    case 'PREV_MONTH':
      return { ...state, currentMonth: subMonths(state.currentMonth, 1), direction: 'prev' };
    case 'CLICK_DATE':
      if (state.phase === 'IDLE') {
        // If clicking the exactly selected single date again, unselect it for better UX
        if (state.startDate && state.endDate && isSameDay(state.startDate, action.date) && isSameDay(state.endDate, action.date)) {
          return { ...state, phase: 'IDLE', startDate: null, endDate: null, hoverDate: null, direction: 'none' };
        }
        return { ...state, phase: 'SELECTING_END', startDate: action.date, endDate: null, hoverDate: null, direction: 'none' };
      }
      if (state.phase === 'SELECTING_END') {
        if (!state.startDate) return state;
        
        let start = state.startDate;
        let end = action.date;
        
        if (isBefore(end, start)) {
          start = action.date;
          end = state.startDate;
        }
        
        return { ...state, phase: 'IDLE', startDate: start, endDate: end, direction: 'none' };
      }
      return state;
    case 'HOVER_DATE':
      if (state.phase !== 'SELECTING_END') return state;
      return { ...state, hoverDate: action.date };
    case 'CLEAR_SELECTION':
      return { ...state, phase: 'IDLE', startDate: null, endDate: null, hoverDate: null, direction: 'none' };
    case 'OPEN_NOTES':
      return { ...state, view: 'NOTES' };
    case 'CLOSE_NOTES':
      return { ...state, view: 'CALENDAR', phase: 'IDLE', startDate: null, endDate: null, hoverDate: null, direction: 'none' };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.note] };
    case 'REMOVE_NOTE':
      return { ...state, notes: state.notes.filter(n => n.id !== action.id) };
    default:
      return state;
  }
}

export function useCalendarState() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  useEffect(() => {
    localStorage.setItem('calendarNotesArray', JSON.stringify(state.notes));
  }, [state.notes]);

  return { state, dispatch };
}