import { useCalendarApp, ScheduleXCalendar} from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import "./CalendarView.css";
 
function CalendarView() {
    const calendar = useCalendarApp({
    views: [
        createViewDay(), 
        createViewWeek(), 
        createViewMonthGrid(), 
        createViewMonthAgenda()
    ],
    events: [
     
    ],

    plugins:[
      createEventModalPlugin(),
      createDragAndDropPlugin()
    ]
  })
 
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default CalendarView;