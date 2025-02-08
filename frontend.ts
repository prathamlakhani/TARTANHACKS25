// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchStudents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch('/api/events');
    const data = await response.json();
    setEvents(data);
  };

  const fetchStudents = async () => {
    const response = await fetch('/api/students');
    const data = await response.json();
    setStudents(data);
  };

  return (
    <div className="App">
      <h1>Campus XRP App</h1>
      
      <div className="events-section">
        <h2>Events</h2>
        {events.map(event => (
          <div key={event._id} className="event-card">
            <h3>{event.name}</h3>
            <p>Price: {event.price} XRP</p>
            <button onClick={() => purchaseTicket(event._id)}>
              Purchase Ticket
            </button>
          </div>
        ))}
      </div>

      <div className="meal-exchange">
        <h2>Meal Credit Exchange</h2>
        {/* Add meal exchange form here */}
      </div>
    </div>
  );
}

export default App;

// frontend/src/App.css
.App {
  padding: 20px;
  max-width: 1200px;# Dockerfile
  FROM node:18
  
  WORKDIR /app
  
  # Copy package files
  COPY package*.json ./
  RUN npm install
  
  # Copy source code
  COPY . .
  
  # Build frontend
  RUN cd frontend && npm install && npm run build
  
  EXPOSE 3000
  CMD ["npm", "start"]
  
  # docker-compose.yml
  version: '3'
  services:
    app:
      build: .
      ports:
        - "3000:3000"
      environment:
        - MONGODB_URI=mongodb://mongodb:27017/campus_xrp
        - XRPL_NODE=wss://s.altnet.rippletest.net:51233
      depends_on:
        - mongodb
  
    mongodb:
      image: mongo:latest
      ports:
        - "27017:27017"
      volumes:
        - mongodb_data:/data/db
  
  volumes:
    mongodb_data:
  margin: 0 auto;
}

.event-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
}