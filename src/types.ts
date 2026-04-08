export type ViewState = 'CALENDAR' | 'NOTES';
export type SelectionPhase = 'IDLE' | 'SELECTING_START' | 'SELECTING_END';

export interface CalendarState {
  currentMonth: Date;
  view: ViewState;
  phase: SelectionPhase;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  notes: Record<string, string>; // Key: "YYYY-MM-DD" or "YYYY-MM-DD_YYYY-MM-DD"
}

export type CalendarAction = 
  | { type: 'NEXT_MONTH' }
  | { type: 'PREV_MONTH' }
  | { type: 'CLICK_DATE'; date: Date }
  | { type: 'HOVER_DATE'; date: Date }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'OPEN_NOTES' }
  | { type: 'CLOSE_NOTES' }
  | { type: 'SAVE_NOTE'; key: string; text: string };