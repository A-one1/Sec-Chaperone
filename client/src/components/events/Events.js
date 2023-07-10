import {
  AddCircleOutline,
  LocationOutline,
  PersonOutline,
  TimeOutline,
} from "react-ionicons";
import { Route,  Routes, useNavigate } from "react-router-dom";
import CreateUpdateEvent from "./CreateUpdateEvent";
import { useEffect, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";

export default function Events() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ListEvents />} />
        <Route path="/new" element={<CreateUpdateEvent />} />
        <Route path="/:id" element={<CreateUpdateEvent />} />
      </Routes>
    </div>
  );
}

function ListEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/api/event/allevents").then((res, err) => {
      if (res.status !== 500) {
        const sortedEvents = res.data.sort((a, b) => {
          return new Date(b.eventDateTime) - new Date(a.eventDateTime);
        });
        setEvents(sortedEvents);
      }
    });
  }, [setEvents]);

  const eventRender = events.map((x) => {
    return (
      <li
        key={x._id}
        onClick={() => {
          navigate("/events/" + x._id);
        }}
      >
        <div className="header">
          <div className="primary">
            {x.title}
            <hr />
          </div>
          <div className="secondary">
            <TimeOutline />{" "}
            {DateTime.fromISO(x.eventDateTime).toLocaleString({
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              timeZoneName: "short",
            })}
            <br />
            <LocationOutline /> {x.location}
            <br />
            <PersonOutline /> {x.contacts.length + " Contacts"}
          </div>
        </div>
      </li>
    );
  });

  return (
    <div className="events">
      <h3>Events</h3>
      <div className="event-list">
        <ul>
          <li
            className="event-list-add"
            onClick={() => {
              navigate("/events/new");
            }}
          >
            <div className="header">
              <AddCircleOutline /> Add Event
            </div>
          </li>
        </ul>
      </div>
      <br/><br/>

      <h3>Previous Events</h3>
      <div className="event-list">
        <ul>{eventRender}</ul>
      </div>
    </div>
  );
}
