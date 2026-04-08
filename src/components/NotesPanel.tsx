import { useState, useEffect } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { Trash2, Check } from 'lucide-react';
import { CalendarState, CalendarAction } from '../types';
import styles from './NotesPanel.module.css';

interface Props {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
}

export function NotesPanel({ state, dispatch }: Props) {
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 1. Determine what the user has currently selected.
  const hasSelection = state.startDate !== null;
  const activeStart = state.startDate;
  const activeEnd = state.endDate || state.startDate; // fallback to start if end not picked yet

  // 2. Filter notes that overlap with the current selection.
  // If no selection, maybe show notes for the whole month? Or just say "Select a date".
  const overlappingNotes = state.notes.filter(note => {
    if (!activeStart || !activeEnd) return false;
    const noteStart = parseISO(note.startStr);
    const noteEnd = parseISO(note.endStr);
    
    // Two intervals overlap if Max(start1, start2) <= Min(end1, end2)
    const maxStart = activeStart > noteStart ? activeStart : noteStart;
    const minEnd = activeEnd < noteEnd ? activeEnd : noteEnd;
    
    return maxStart <= minEnd;
  });

  const handleAddNote = () => {
    if (!text.trim() || !activeStart || !activeEnd) return;
    
    setIsSaving(true);
    
    // Simulate a tiny network delay for tactile feedback
    setTimeout(() => {
      dispatch({ 
        type: 'ADD_NOTE', 
        note: {
          id: crypto.randomUUID(),
          startStr: format(activeStart, 'yyyy-MM-dd'),
          endStr: format(activeEnd, 'yyyy-MM-dd'),
          text: text.trim()
        }
      });
      setText(''); // clear input
      setIsSaving(false);
    }, 400);
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_NOTE', id });
  };

  const formatRange = (startStr: string, endStr: string) => {
    if (startStr === endStr) return format(parseISO(startStr), 'MMM do, yyyy');
    return `${format(parseISO(startStr), 'MMM do')} - ${format(parseISO(endStr), 'MMM do, yyyy')}`;
  };

  const selectionTitle = activeStart && activeEnd
    ? formatRange(format(activeStart, 'yyyy-MM-dd'), format(activeEnd, 'yyyy-MM-dd'))
    : 'Select a Date';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3 className={styles.title}>Notes: {selectionTitle}</h3>
      </header>

      {hasSelection ? (
        <>
          <div className={styles.addNoteSection}>
            <textarea 
              className={styles.textarea}
              placeholder={`Add a note for ${selectionTitle}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className={styles.actions}>
              <button 
                className={`${styles.btnPrimary} ${isSaving ? styles.btnSuccess : ''}`}
                onClick={handleAddNote}
                disabled={!text.trim() || isSaving}
              >
                {isSaving ? <><Check size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }}/> Saved</> : 'Save Note'}
              </button>
            </div>
          </div>

          <h4 className={styles.sectionTitle}>Saved Memos</h4>
          <div className={styles.notesList}>
            {overlappingNotes.length === 0 ? (
              <div className={styles.emptyState}>No notes for this selection.</div>
            ) : (
              overlappingNotes.map(note => (
                <div key={note.id} className={styles.noteCard}>
                  <div className={styles.noteRange}>{formatRange(note.startStr, note.endStr)}</div>
                  <p className={styles.noteText}>{note.text}</p>
                  <button className={styles.deleteBtn} onClick={() => handleRemove(note.id)} aria-label="Delete note">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          Click a date or drag across multiple dates on the calendar to view or add notes.
        </div>
      )}
    </div>
  );
}