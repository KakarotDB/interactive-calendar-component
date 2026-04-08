# Interactive Calendar Component

A premium, interactive web component built with React and Vite. It mimics a physical wall calendar aesthetic while offering an intuitive day-range selection mechanic and a spatial "zoom-in" interaction for context-aware notes. 

## Features

- **Wall Calendar Aesthetic:** A modern, side-by-side split layout (stacking on mobile) with a prominent hero image.
- **Range Selection State Machine:** Select a single day or click and hover to drag-select an entire range with smooth visual previews.
- **Context-Aware Notes (Zoom Flow):** Instead of a static text box, clicking a date or selecting a range triggers a smooth transition, opening a focused notes panel. Notes are persisted directly to `localStorage`.
- **Typographic Polish:** Utilizes Cheng Lou's `pretext` for perfectly balanced month headers without orphans.
- **Performant & Lightweight:** Built directly with Vite and React (via `useReducer` for complex state), using `date-fns` exclusively for bulletproof calendar math and CSS Modules for scalable, scoped styling.

## Tech Stack

- **React 18** (TypeScript)
- **Vite** (Build Tooling)
- **CSS Modules** (Vanilla, Scoped Styling)
- **date-fns** (Date Math)
- **pretext** (Typographic Balancing)
- **lucide-react** (Icons)

## Quick Start

### Prerequisites
- Node.js (v18+)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Component Architecture

- **`useCalendarState`:** The core state machine using `useReducer` to manage selection phases (`IDLE`, `SELECTING_START`, `SELECTING_END`) and the view transitions between the `CALENDAR` view and `NOTES` view.
- **`CalendarContainer`:** The main layout wrapper governing the responsive flexbox structure.
- **`Grid` & `RightPane`:** Handles the generation of the 42-cell array via `date-fns` and orchestrates the localized selection/hover logic.
- **`NotesPanel`:** An overlay component that handles the reading and writing of `localStorage` data, tightly coupled to the active date selection.