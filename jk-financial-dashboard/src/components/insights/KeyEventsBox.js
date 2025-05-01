import React, { useEffect, useState } from 'react';
import './KeyEventsBox.css';

const KeyEventsBox = ({ selectedYear }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${selectedYear}`);
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Failed to load event annotations", err);
      }
    };

    fetchEvents();
  }, [selectedYear]);

  return (
    <div className="key-events-box">
      <h3 className="key-events-title">📌 Key Events in {selectedYear}</h3>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul className="event-list">
          {events.map((event, idx) => (
            <li key={idx}>• {event}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default KeyEventsBox;
