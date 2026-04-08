export type ViewState = 'CALENDAR' | 'NOTES';
export type SelectionPhase = 'IDLE' | 'SELECTING_START' | 'SELECTING_END';

export interface CalendarNote {
  id: string;
  startStr: string;
  endStr: string;
  text: string;
}

export interface CalendarState {
  currentMonth: Date;
  view: ViewState;
  phase: SelectionPhase;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  notes: CalendarNote[];
  direction: 'next' | 'prev' | 'none';
}

export type CalendarAction = 
  | { type: 'NEXT_MONTH' }
  | { type: 'PREV_MONTH' }
  | { type: 'CLICK_DATE'; date: Date }
  | { type: 'HOVER_DATE'; date: Date }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'OPEN_NOTES' }
  | { type: 'CLOSE_NOTES' }
  | { type: 'ADD_NOTE'; note: CalendarNote }
  | { type: 'REMOVE_NOTE'; id: string };