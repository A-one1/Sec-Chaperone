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
import useInterval from "use-interval";

export default function CheckInModal({ nextEvent, trigger }) {
  const [modal, setModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [stopChecking, setStopChecking] = useState(undefined);

  useEffect(() => {
    if (nextEvent != undefined) {
      const shouldOpen =
        DateTime.fromISO(nextEvent.nextCheckIn) <= DateTime.now();
      if (setModal == false && shouldOpen) {
        setNotes(nextEvent.notes);
      }
      setModal(shouldOpen);
    }
  }, [nextEvent]);

  return (
    <Modal isOpen={modal}>
      <ModalHeader>It's Time to Check In</ModalHeader>
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
                  <h6>
                    That's alright we'll check back with you in 15 minutes.
                  </h6>
                </Alert>
              </Label>
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
              })
              .then((e) => {
                trigger();
                setModal(false);
              });
          }}
        >
          Check In
        </Button>
      </ModalFooter>
    </Modal>
  );
}
