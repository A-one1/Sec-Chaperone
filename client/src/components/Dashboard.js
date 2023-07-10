import { useEffect, useState } from "react";
import axios from "axios";
import {
  AddSharp,
  LocationOutline,
  ReceiptOutline,
  SettingsOutline,
  TimeOutline,
} from "react-ionicons";
import { Badge } from "reactstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import Events from "./events/Events";
import Contacts from "./contacts/Contacts";
import useInterval from "use-interval";
import CheckInModal from "./CheckInModal";
const { DateTime } = require("luxon");
const md5 = require("blueimp-md5");

export default function Dashboard({ nextEvent, trigger }) {
  useEffect(() => {}, [nextEvent]);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<UpcomingEvent nextEvent={nextEvent} trigger={trigger} />}
          exact
        />
        <Route path="/events/*" element={<Events />} />
        <Route path="/contacts/*" element={<Contacts />} />
      </Routes>
    </div>
  );
}

function UpcomingEvent({ nextEvent, trigger }) {
  let navigate = useNavigate();

  const [showModal, setshowModal] = useState();

  const checkInModal = () => {
    console.log("BUTTON CLICKEDD");
    setshowModal(true);
  };

  useEffect(() => {}, [nextEvent, showModal]);

  let badge = <Badge pill color="info"></Badge>;
  let show_checkin = false;
  let checkin_button =
    DateTime.fromISO(nextEvent?.eventDateTime).diffNow(["minutes"]) < 10;

  let checkin_status = (
    <Badge
      pill
      color={
        DateTime.fromISO(nextEvent?.nextCheckIn).diffNow(["minutes"]) >= 0
          ? "primary"
          : "danger"
      }
    >
      {DateTime.fromISO(nextEvent?.nextCheckIn).diffNow(["minutes"]) >= 0
        ? DateTime.fromISO(nextEvent?.nextCheckIn)
            .diffNow(["minutes"])
            .toHuman({ maximumFractionDigits: 0 }) + " until checkin"
        : "awaiting check in"}
    </Badge>
  );

  if (
    DateTime.fromISO(nextEvent?.eventDateTime).diffNow(["hours"]) >=
    1000 * 3600 * 24
  ) {
    badge = (
      <Badge pill color="info">
        {DateTime.fromISO(nextEvent?.eventDateTime).toRelativeCalendar()}
      </Badge>
    );
  } else if (
    DateTime.fromISO(nextEvent?.eventDateTime).diffNow(["minutes"]) >= 5
  ) {
    badge = (
      <Badge pill color="info">
        {DateTime.fromISO(nextEvent?.eventDateTime).toRelative()}
      </Badge>
    );
  } else {
    show_checkin = true;
    badge = (
      <Badge pill color="success">
        now
      </Badge>
    );
  }

  var contactRender = nextEvent?.contacts.map((x,index) => {
    return (
      <li key={index}>
        <img
          src={
            "https://www.gravatar.com/avatar/" +
            md5(x.email.toLowerCase().trim()) +
            "?d=mp"
          }
        />{" "}
        {x.firstName} {x.lastName}
      </li>
    );
  });

  return nextEvent !== undefined && nextEvent !== [] ? (
    <div className="upcoming-events">
      <h2>Up Next</h2>
      <div className="event-card">
        <div className="header">
          <h3>
            <b>{nextEvent.title}</b>
            <br />
            {badge} {show_checkin ? checkin_status : undefined}
          </h3>
          <SettingsOutline
            cssClasses={"clickable"}
            onClick={(e) => {
              navigate("/events/" + nextEvent._id);
            }}
          />
        </div>
        <div className="content">
          <div className="detail-panel">
            <h4>Details</h4>
            <ul>
              <li>
                <TimeOutline />{" "}
                {DateTime.fromISO(nextEvent.eventDateTime).toLocaleString({
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  timeZoneName: "short",
                })}
              </li>
              <li>
                <LocationOutline /> {nextEvent.location}
              </li>
              <li className="disappear">
                <hr />
              </li>
              <li>
                <ReceiptOutline /> Notes: <br />{" "}
                <div className="desc">{nextEvent.notes}</div>
              </li>
            </ul>
          </div>
          <div className="spacer"></div>
          <div className="contact-list">
            <h4>Contacts</h4>
            <ul>{contactRender}</ul>
          </div>
        </div>
        <div>
          {checkin_button && (
            <button
              type="button"
              className="btn btn-info"
              onClick={checkInModal}
            >
              Check In
            </button>
          )}
          {showModal && (
            <CheckInModal
              nextEvent={nextEvent}
              showModal={showModal}
              setshowModal={setshowModal}
              trigger={trigger}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="upcoming-events">
      <h2>Up Next</h2>
      <div
        className="event-card clickable"
        onClick={() => navigate("/events/new")}
      >
        <div className="header">
          <AddSharp />
          &ensp;
          <h4>Tap to add an event</h4>
        </div>
      </div>
    </div>
  );
}
