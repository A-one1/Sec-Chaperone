import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";
import About from "./About";
import Dashboard from "./Dashboard";
import useInterval from "use-interval";
import { DateTime } from "luxon";
import CheckInModal from "./CheckInModal";

function App() {
  const [user, setUser] = useState({ status: "Not Authorized" });
  const [nextEvent, setNextEvent] = useState(undefined);
  const [connectionError, setConnectionError] = useState(false);

  const trigger = () => {
    fetchData();
    console.log("TRIGGEREDDD!!!!!")
  };

  const fetchData = () => {
    axios
      .get("/api/event")
      .then((res) => {
        if (res.data.length >= 1) {
          let nextEvent = res?.data[0];
          res.data.forEach((element) => {
            if (
              DateTime.fromISO(nextEvent.eventDateTime) >
                DateTime.fromISO(element.eventDateTime) &&
              element.stopChecking == false
            ) {
              nextEvent = element;
            }
          });
          setNextEvent(nextEvent);
          setConnectionError(false);
        } else {
          setNextEvent(undefined);
          setConnectionError(false);
        }

      })
      .catch((err) => {
        setConnectionError(true);
      });
  };

  useEffect(() => {
    axios.get("/api/auth/user").then((res) => {
      setUser(res.data);
      setConnectionError(false);
    });

    fetchData();
  }, []);

  useInterval(() => {
    if (connectionError) {
      axios.get("/api/auth/user").then((res) => {
        setUser(res.data);
        fetchData();
      });
    } else {
      fetchData();
    }
  }, 1000);

  return (
    <Router>
      <div className={`banner ${connectionError !== false ? "warning" : ""}`}>
        {connectionError !== false ? "Connection Error" : "Hilo"} &ensp;
      </div>
      <Navigation user={user} />
      <div className="App">
        <Routes>
          {JSON.stringify(user) ===
          JSON.stringify({ status: "Not Authorized" }) ? (
            <Route path="/*" element={<About />} />
          ) : (
            <Route path="/*" element={<Dashboard nextEvent={nextEvent} trigger={trigger}/>} />
          )}
        </Routes>
      </div>
      <CheckInModal nextEvent={nextEvent} trigger={trigger} showModal={false} />
    </Router>
  );
}

export default App;
