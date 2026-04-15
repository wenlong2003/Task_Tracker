import { useState, useEffect } from "react";

export type Event = {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  userId: number;
};

export function useTasks() {
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch all tasks from Flask API
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/tasks");
      const data: Event[] = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  // Add a new task
  const addEvent = async (event: Event) => {
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { events, fetchTasks, addEvent };
}