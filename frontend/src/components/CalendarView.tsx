import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { useEffect } from 'react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import 'temporal-polyfill/global'
import "@schedule-x/theme-default/dist/index.css";
import "./CalendarView.css";
import { createEventModalPlugin } from '@schedule-x/event-modal';

function CalendarView() {
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda()
    ],
    events: [
      {
        id: 1,
        title: 'something',
        description: 'Some Text',
        start: Temporal.PlainDate.from('2026-04-15'),
        end: Temporal.PlainDate.from('2026-04-15')
      }
    ],
    plugins: [createEventModalPlugin()]
  });

  const loadEvents = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await fetch(`/api/tasks?userId=${userId}`);
      const data = await res.json();

      const formatted = data.map((task: any) => ({
        id: task.id,
        title: task.name,
        description: task.description,
        start: Temporal.ZonedDateTime.from(task.startTime),
        end: Temporal.ZonedDateTime.from(task.endTime),
      }));

      calendar?.events?.set?.(formatted);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    loadEvents();

    const refreshHandler = () => {
      loadEvents();
    };

    window.addEventListener("refreshCalendar", refreshHandler);

    return () => {
      window.removeEventListener("refreshCalendar", refreshHandler);
    };
  }, [calendar]);

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarView;
