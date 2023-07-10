import axios from "axios";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Countdown from "react-countdown";

export default function CheckInModal({
  nextEvent,
  trigger,
  showModal,
  setshowModal,
}) {
  const [modal, setModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [stopChecking, setStopChecking] = useState(undefined);
  const [checkInInterval, setCheckInInterval] = useState(10);
  const [countdownDate, setCountdownDate] = useState(null);

  const Completionist = () => <span>Message sent successfully!</span>;

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <span>
          {minutes}:{seconds}
        </span>
      );
    }
  };

  useEffect(() => {
    if (nextEvent !== undefined && showModal == false) {
      const shouldOpen =
        DateTime.fromISO(nextEvent.nextCheckIn) <= DateTime.now();
      if (setModal === false && shouldOpen) {
        setNotes(nextEvent.notes);
      }
      setModal(shouldOpen);
    } else if (nextEvent !== undefined && showModal == true) {
      const shouldOpen = true;
      if (modal === false && shouldOpen) {
        setNotes(nextEvent.notes);
        setModal(shouldOpen);
      }
    }
  }, [nextEvent]);

  useEffect(() => {
    if (nextEvent?.nextCheckIn) {
      setCountdownDate(DateTime.fromISO(nextEvent.nextCheckIn) + 600000);
    }
  }, [showModal, nextEvent]);

  return (
    <Modal isOpen={modal}>
      <ModalHeader>
        <div className="header-container">
          <div>It's Time to Check In</div>
          <div className="countdown-container">
            <Countdown date={countdownDate} renderer={renderer} />
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup tag="fieldset">
            <Label className="emph">Do you feel safe?</Label>
            <FormGroup check className="radio-checkin">
              <Input
                name="radio1"
                id="opt1"
                type="radio"
                value="true"
                checked={stopChecking === "true"}
                onChange={(e) => {
                  setStopChecking(e.target.value);
                }}
              />{" "}
              <Label check htmlFor="opt1">
                <Alert color="success">
                  <h5>Yes</h5>
                  <h6>We will not check in with you again.</h6>
                </Alert>
              </Label>
            </FormGroup>
            <FormGroup check className="radio-checkin">
              <Input
                name="radio1"
                id="opt2"
                type="radio"
                value="false"
                checked={stopChecking === "false"}
                onChange={(e) => {
                  setStopChecking(e.target.value);
                }}
              />{" "}
              <Label check htmlFor="opt2">
                <Alert color="warning">
                  <h5>I'm Unsure</h5>
                  <h6>That's alright we'll check back with you later.</h6>
                </Alert>
              </Label>
            </FormGroup>
            <FormGroup>
              <Label check htmlFor="checkInInterval">
                Check-In After? (minutes):
              </Label>
              <Input
                type="number"
                id="checkInInterval"
                value={checkInInterval}
                onChange={(e) => setCheckInInterval(e.target.value)}
                min={1}
                max={60}
              />
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <Label className="emph" htmlFor="textarea">
              Update your notes?
            </Label>
            <Input
              type="textarea"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              placeholder="Anything details that would help a friend find you..."
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={(e) => {
            axios
              .post("/api/event/" + nextEvent._id + "/checkin", {
                stopChecking: stopChecking === "true" ? true : false,
                notes: notes,
                checkInInterval: checkInInterval,
              })
              .then((e) => {
                setModal(false);
                setshowModal(false);
                if (trigger && typeof trigger === "function") {
                  trigger();
                } else {
                  console.log("NO TRIGGER FUNCTION!!!");
                }
              })
              .catch((err) => {
                console.log("modal error", err);
              });
          }}
        >
          Check In
        </Button>
      </ModalFooter>
    </Modal>
  );
}
