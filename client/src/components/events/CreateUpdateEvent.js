import axios from "axios";
import { useEffect, useState } from "react";
import { AlertCircleOutline, CloseOutline } from "react-ionicons";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Badge,
  Button,
  ButtonToolbar,
  Col,
  Collapse,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Alert,
} from "reactstrap";
import { DateTime } from "luxon";
import Error from "../Error";

export default function CreateUpdateEvent() {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [contacts, setContacts] = useState([]);
  const [possibleContacts, setPossibleContacts] = useState([]);
  const [modified, setModified] = useState(false);
  const [modal, setModal] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const toggle = () => setModal(!modal);
  const navigate = useNavigate();

  let { id } = useParams();

  const [titleMessage, setTitleMessage] = useState(undefined);
  const [eventDateMessage, setEventDateMessage] = useState(undefined);
  const [eventTimeMessage, setEventTimeMessage] = useState(undefined);
  const [locationMessage, setLocationMessage] = useState(undefined);
  const [notesMessage, setNotesMessage] = useState(undefined);
  const [contactsMessage, setContactsMessage] = useState(undefined);

  useEffect(() => {
    if (id !== undefined) {
      axios
        .get("/api/event/" + id)
        .then((res) => {
          setTitle(res.data.title);
          setEventDate(
            DateTime.fromISO(res.data.eventDateTime).toFormat("yyyy-LL-dd")
          );
          setEventTime(DateTime.fromISO(res.data.eventDateTime).toFormat("T"));
          setLocation(res.data.location);
          setNotes(res.data.notes);
          setContacts(res.data.contacts);
        })
        .catch((err) => {
          setNotFound(true);
        });
    }

    axios.get("/api/contact/").then((res, err) => {
      setPossibleContacts(res.data);
    });
  }, [setTitle, setLocation, setNotes, setContacts, id]);

  const changeTitle = (e) => {
    let value = e.target.value;
    if (value.length <= 50) {
      setTitle(value);
    }
  };

  const changeEventDate = (e) => {
    let value = e.target.value;
    if (value.length <= 50) {
      setEventDate(value);
    }
  };

  const changeEventTime = (e) => {
    let value = e.target.value;
    if (value.length <= 50) {
      setEventTime(value);
    }
  };

  const changeLocation = (e) => {
    let value = e.target.value;
    if (value.length <= 50) {
      setLocation(value);
    }
  };

  const changeNotes = (e) => {
    let value = e.target.value;
    if (value.length <= 500) {
      setNotes(value);
    }
  };

  const changeContacts = (e) => {
    let value = e.target.value;
    if (value.length <= 3) {
      setContacts(value);
    }
  };

  const validateForm = () => {
    const regexLocation = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const regexNotes = new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);
    var isOk = true;

    setTitleMessage(undefined);
    setEventDateMessage(undefined);
    setEventTimeMessage(undefined);
    setLocationMessage(undefined);
    setNotesMessage(undefined);
    setContactsMessage(undefined);

    if (!(title != "" && title != null)) {
      setTitleMessage(<FormFeedback>Title cannot be empty.</FormFeedback>);
      isOk = false;
    }

    if (!(eventDate != "" && eventDate != null)) {
      setEventDateMessage(
        <FormFeedback>Event time cannot be empty.</FormFeedback>
      );
      isOk = false;
    }

    if (!(eventTime != "" && eventTime != null)) {
      setEventTimeMessage(
        <FormFeedback>Event time cannot be empty.</FormFeedback>
      );
      isOk = false;
    }

    if (!(location != "" && location != null)) {
      setLocationMessage(
        <FormFeedback>Not a valid location address.</FormFeedback>
      );
      isOk = false;
    }

    if (notes.length > 500) {
      setNotesMessage(<FormFeedback>Notes is too long.</FormFeedback>);
      isOk = false;
    }

    if (!(contacts.length > 0)) {
      setContactsMessage(
        <FormFeedback>Please select one or more contacts.</FormFeedback>
      );
      isOk = false;
    }

    return isOk;
  };

  const deleteEvent = () => {
    const asyncProcess = async () => {
      let res = await axios.delete("/api/event/" + id);
      navigate("/events/");
    };

    asyncProcess();
  };

  const saveEvent = () => {
    let contactIds = contacts.map((x) => {
      return x._id;
    });

    const asyncProcess = async () => {
      let res = await axios.put("/api/event/" + id, {
        title: title,
        eventDateTime: DateTime.fromJSDate(
          new Date(eventDate + "T" + eventTime)
        ).toUTC(),
        notes: notes,
        location: location,
        contacts: contactIds,
      });
      navigate("/");

    };

    if (validateForm()) {
      asyncProcess();
    }
  };

  const createEvent = () => {
    let contactIds = contacts.map((x) => {
      return x._id;
    });

    const asyncProcess = async () => {
      let res = await axios.post("/api/event/new", {
        title: title,
        eventDateTime: DateTime.fromJSDate(
          new Date(eventDate + "T" + eventTime)
        ).toUTC(),
        notes: notes,
        location: location,
        contacts: contactIds,
      });

      if (res.data._id !== undefined) {
        navigate("/events/" + res.data._id);
      }
      navigate("/");
    };

    if (validateForm()) {
      asyncProcess();
    }
  };

  return !notFound ? (
    <div className="edit-event">
      {possibleContacts.length == 0 && (
        <Alert color="primary">
          <AlertCircleOutline color="#084298" />
          &ensp; You don't have any contacts setup yet!&ensp;Why don't you&ensp;
          <Link to="/contacts" className="alert-link">
            add a contact
          </Link>
          ?
        </Alert>
      )}

      <h2>{id !== undefined ? "Edit Event" : "New Event"}</h2>
      <Form
        className="event-form"
        onSubmit={(e) => {
          e.preventDefault();
          id !== undefined ? saveEvent() : createEvent();
        }}
      >
        <Row>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Meeting w/ John"
              value={title}
              onChange={changeTitle}
              invalid={titleMessage === undefined ? false : true}
            />
            {titleMessage}
          </FormGroup>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="eventDate">Event Date</Label>
              <Input
                type="date"
                name="eventDate"
                id="eventDate"
                placeholder=""
                value={eventDate}
                onChange={changeEventDate}
                invalid={eventDateMessage === undefined ? false : true}
              />
              {eventDateMessage}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="eventTime">Event Time</Label>
              <Input
                type="time"
                name="eventTime"
                id="eventTime"
                placeholder=""
                value={eventTime}
                onChange={changeEventTime}
                invalid={eventTimeMessage === undefined ? false : true}
              />
              {eventTimeMessage}
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="location">Location</Label>
          <Input
            type="text"
            name="location"
            id="location"
            placeholder="12345 S Example Rd, Meadowville, NY"
            value={location}
            onChange={changeLocation}
            invalid={locationMessage === undefined ? false : true}
          />
          {locationMessage}
        </FormGroup>
        <FormGroup>
          <Label for="notes">Notes</Label>
          <Input
            type="textarea"
            name="notes"
            id="notes"
            placeholder="Anything that would help people find you..."
            value={notes}
            onChange={changeNotes}
            invalid={notesMessage === undefined ? false : true}
          />
          {notesMessage}
        </FormGroup>
        <FormGroup>
          <Label for="contacts">Contacts</Label>
          <ContactInput
            name="contacts"
            id="contacts"
            placeholder="Search a contact's name..."
            value={contacts}
            possibleValues={possibleContacts}
            onChange={changeContacts}
            invalid={contactsMessage === undefined ? false : true}
            className="is-invalid"
          />
          {contactsMessage}
          <FormText>Select up to 3 contacts.</FormText>
        </FormGroup>
        <ButtonToolbar>
          {id !== undefined ? (
            <>
              <Button color="danger" onClick={toggle}>
                Delete
              </Button>
              &ensp;
              <Button type="submit" color={!modified ? "primary" : "warning"}>
                Save
              </Button>
            </>
          ) : (
            <Button type="submit" color="primary">
              Create
            </Button>
          )}
          &ensp;
        </ButtonToolbar>
      </Form>
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Are you sure?</ModalHeader>
        <ModalBody>Are you sure you want to delete this event?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteEvent}>
            Yes, Delete It
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  ) : (
    <Error text="There was an error accessing that event." />
  );
}

function ContactInput({
  name,
  id,
  placeholder,
  value,
  possibleValues,
  onChange,
  invalid,
}) {
  const [listResults, setListResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const changeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const updateList = () => {
    let tListResults = possibleValues.filter((x) => {
      var isOk = true;
      value.forEach((element) => {
        if (element._id == x._id) {
          isOk = false;
        }
      });

      return (
        ((x.firstName.toLowerCase() + x.lastName.toLowerCase()).includes(
          searchTerm.toLowerCase()
        ) ||
          searchTerm == "") &&
        isOk
      );
    });
    setListResults(tListResults.slice(0, 4));
  };

  useEffect(() => {
    updateList();
  }, [value, searchTerm, possibleValues]);

  let badges = value.map((x) => {
    return (
      <Badge
        key={x._id}
        onClick={(e) => {
          let tvalue = value.filter((y) => {
            if (x._id != y._id) {
              return true;
            } else {
              return false;
            }
          });

          onChange({ target: { value: tvalue } });
          updateList();
        }}
      >
        {x.firstName} <CloseOutline height="1em" width="1em" color="white" />
      </Badge>
    );
  });

  let listResultsRender = listResults.map((x) => {
    return (
      <ListGroupItem
        key={x._id}
        action={true}
        onClick={(e) => {
          e.preventDefault();
          let tvalue = [...value];
          tvalue.push(x);
          onChange({ target: { value: tvalue } });
        }}
        className="clickable"
      >
        <ListGroupItemHeading>
          {x.firstName} {x.lastName}
        </ListGroupItemHeading>
      </ListGroupItem>
    );
  });

  return (
    <>
      <div
        className="contact-input"
        tabIndex={10}
        onFocus={(e) => {
          setIsOpen(true);
        }}
        onBlur={(e) => {
          setIsOpen(false);
        }}
        aria-invalid={invalid}
      >
        <div className="contact-badges">{badges}</div>
        <Input
          type="text"
          name={name}
          id={id}
          placeholder={placeholder}
          onChange={changeSearchTerm}
          value={searchTerm}
          autoComplete="off"
          invalid={invalid}
          disabled={possibleValues.length == 0}
        />
        <Collapse isOpen={isOpen}>
          <ListGroup>{listResultsRender}</ListGroup>
        </Collapse>
      </div>
      <Input type="hidden" invalid={invalid} />
    </>
  );
}
/*
export default function CreateUpdateEvent() {
  axios.post("/api/event/new", {
    events: ["6323acbeb363a7754c0aec5e"],
    title: "Meeting w/ Josh",
    location: "Meadow Bridge",
    notes: "Black pickup truck.",
    eventDateTime: "2022-09-14T06:59:12.000Z",
  });

  return <div>Added</div>;
}
*/
