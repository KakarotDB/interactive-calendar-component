import { CalendarContainer } from './components/CalendarContainer';
import { HeroPane } from './components/HeroPane';
import { RightPane } from './components/RightPane';
import { useCalendarState } from './hooks/useCalendarState';
import './index.css';

export default function App() {
  const { state, dispatch } = useCalendarState();
  return (
    <CalendarContainer>
      <HeroPane />
      <RightPane state={state} dispatch={dispatch} />
    </CalendarContainer>
  );
}