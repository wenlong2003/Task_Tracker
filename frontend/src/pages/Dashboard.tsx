import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [events, setEvents] = useState<any[]>([]);

  const formatDateTime = (value: string) => {
    return value.replace("T", " ") + ":00";
  };

  const handleCreateEvent = async (allDay: boolean) => {
    if (!token) {
      alert("You are not authenticated. Please log in again.");
      return;
    }

    if (!title) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      let payload: any = {
        name: title,
        description,
        isAllDay: allDay,
      };

      if (allDay) {
        const dateOnly = startTime.split("T")[0];

        payload.startTime = dateOnly + " 00:00:00";
        payload.endTime = dateOnly + " 23:59:59";
      } else {
        if (!startTime || !endTime) {
          alert("Please fill all required fields");
          setLoading(false);
          return;
        }

        payload.startTime = formatDateTime(startTime);
        payload.endTime = formatDateTime(endTime);
      }

      await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      alert("Event created! Go to calendar to see it.");
      fetchEvents();

      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!token) {
      alert("You are not authenticated. Please log in again.");
      return;
    }

    if (!deleteId) {
      alert("Please enter an event ID to delete");
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      alert("Event deleted successfully");
      setDeleteId("");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  const fetchEvents = async () => {
    if (!token) return;

    try {
      const res = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  return (
    <main className="dashboard-container">
      {/* LEFT COLUMN */}
      <div className="content-left">

        {/* CREATE EVENT */}
        <section className="container-create">
          <h1 className="dashboard-title">Create Event</h1>

          <form
            className="event-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="input"
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>Start Time</label>
            <input
              className="input"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <label>End Time</label>
            <input
              className="input"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />

            <div className="btn-group">
              <button
                className="create-event-btn"
                type="button"
                disabled={loading}
                onClick={() => handleCreateEvent(false)}
              >
                {loading ? "Creating..." : "Timed Event"}
              </button>

              <button
                className="create-event-btn"
                type="button"
                disabled={loading}
                onClick={() => handleCreateEvent(true)}
              >
                {loading ? "Creating..." : "All Day Event"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* RIGHT COLUMN */}
      <section className="container-events">
        <h2 className="dashboard-title">Upcoming Events</h2>

        <div className="event-list">
          {events.length === 0 ? (
            <p>No events schedule</p>
          ) : (
            [...events]
              .sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              )
              .map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-card-header">
                    <div className="event-actions">
                      <button
                        className="edit-btn"
                        onClick={() => alert(`Edit event ${event.id} (implement later)`)}
                      >
                      <i className="bi bi-pencil-square editIcon"></i>
                      </button>
                      <button
                        className="delete-btn"
                        onClick={async () => {
                          if (!token) {
                            alert("You are not authenticated. Please log in again.");
                            return;
                          }

                          try {
                            const res = await fetch(`/api/tasks/${event.id}`, {
                              method: "DELETE",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            });

                            if (!res.ok) throw new Error("Failed to delete");

                            alert("Event deleted successfully");
                            fetchEvents();
                          } catch (err) {
                            console.error(err);
                            alert("Failed to delete event");
                          }
                        }}
                      >
                      <i className="bi bi-trash deleteIcon"></i>
                      </button>
                    </div>
                  </div>

                  <strong>{event.name}</strong>
                  <p>{event.description}</p>
                  <small>
                    {event.startTime} - {event.endTime}
                  </small>
                </div>
              ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;