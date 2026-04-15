import { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const formatDateTime = (value: string) => {
    return value.replace("T", " ") + ":00";
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in");
      return;
    }

    if (!title || !startTime || !endTime) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          description,
          startTime: formatDateTime(startTime),
          endTime: formatDateTime(endTime),
          userId,
        }),
      });

      alert("Event created! Go to calendar to see it.");

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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Create Event</h1>

      <form className="event-form" onSubmit={handleCreateEvent}>
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

        <button className="create-event-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default Dashboard;