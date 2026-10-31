import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Events({ token }) {
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [registering, setRegistering] = useState(null); // eventId being registered

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await axios.get(`${API}/api/events`);
      setEvents(res.data.data || []);
    } catch (err) {
      setMessage("Failed to load events. Please check your connection.");
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!token) return;
    setLoadingRegs(true);
    try {
      const res = await axios.get(`${API}/api/registrations/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyRegs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRegs(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, [token]);

  const registerForEvent = async (eventId) => {
    if (!token) {
      setMessage("Please log in to register for events.");
      return;
    }
    setRegistering(eventId);
    setMessage("");
    try {
      await axios.post(
        `${API}/api/registrations`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Successfully registered! 🎉");
      fetchEvents();
      fetchRegistrations();
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setRegistering(null);
    }
  };

  const isRegistered = (eventId) =>
    myRegs.some((r) => r.event?._id === eventId || r.event === eventId);

  return (
    <div>
      <h2>TechFest 2026 Events</h2>
      {message && (
        <p style={{ color: message.includes("Successfully") ? "#b3ffb3" : "#ffb3b3" }}>
          {message}
        </p>
      )}

      <div style={{ display: "flex", gap: "20px" }}>
        {/* All Events */}
        <div style={{ flex: 1 }}>
          <h3>All Events</h3>
          {loadingEvents ? (
            <p style={{ color: "#aaa" }}>Loading events...</p>
          ) : events.length === 0 ? (
            <p style={{ color: "#aaa" }}>No events found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "15px",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              }}
            >
              {events.map((ev) => (
                <div key={ev._id} className="card">
                  <h4 style={{ color: "#a8c0ff" }}>{ev.name}</h4>
                  <div style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "15px" }}>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        padding: "2px 8px",
                        borderRadius: "10px",
                      }}
                    >
                      {ev.category}
                    </span>
                  </div>
                  {ev.description && (
                    <p style={{ fontSize: "0.85rem", color: "#bbb" }}>{ev.description}</p>
                  )}
                  <p>
                    <strong>Date:</strong> {new Date(ev.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Fee:</strong> ₹{ev.fee}
                  </p>
                  <p>
                    <strong>Seats Left:</strong>{" "}
                    <span style={{ color: ev.seats === 0 ? "#ff6b6b" : "#b3ffb3" }}>
                      {ev.seats}
                    </span>
                  </p>
                  <button
                    style={{ width: "100%", marginTop: "10px" }}
                    onClick={() => registerForEvent(ev._id)}
                    disabled={registering === ev._id || ev.seats === 0 || isRegistered(ev._id)}
                  >
                    {registering === ev._id
                      ? "Registering..."
                      : isRegistered(ev._id)
                      ? "✓ Registered"
                      : ev.seats === 0
                      ? "Full"
                      : "Register"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Registrations — only shown when logged in */}
        {token && (
          <div style={{ flex: 1 }}>
            <h3>My Registrations</h3>
            {loadingRegs ? (
              <p style={{ color: "#aaa" }}>Loading...</p>
            ) : myRegs.length === 0 ? (
              <p style={{ color: "#aaa" }}>You have no registrations yet.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "15px",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                }}
              >
                {myRegs.map((reg) => (
                  <div
                    key={reg._id}
                    className="card"
                    style={{ background: "rgba(255, 255, 255, 0.05)" }}
                  >
                    <h4 style={{ color: "#a8c0ff" }}>{reg.event?.name || "Unknown Event"}</h4>
                    {reg.event?.category && (
                      <p style={{ fontSize: "0.85rem", color: "#ccc" }}>{reg.event.category}</p>
                    )}
                    {reg.event?.date && (
                      <p>
                        <strong>Date:</strong> {new Date(reg.event.date).toLocaleDateString()}
                      </p>
                    )}
                    <p>
                      <strong>Registered on:</strong>{" "}
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
