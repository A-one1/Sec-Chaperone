import axios from "axios";
import md5 from "blueimp-md5";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Label,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  ButtonToolbar,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormFeedback,
} from "reactstrap";
import Error from "../Error";

export default function CreateUpdateContact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [modified, setModified] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const navigate = useNavigate();

  let { id } = useParams();

  const [firstNameMessage, setFirstNameMessage] = useState(undefined);
  const [lastNameMessage, setLastNameMessage] = useState(undefined);
  const [emailMessage, setEmailMessage] = useState(undefined);
  const [phoneMessage, setPhoneMessage] = useState(undefined);

  useEffect(() => {
    if (id !== undefined) {
      axios
        .get("/api/contact/" + id)
        .then((res) => {
          setFirstName(res.data.firstName);
          setLastName(res.data.lastName);
          setPhone(res.data.phone);
          setEmail(res.data.email);
        })
        .catch((err) => {
          console.log("🚀 ~ file: CreateUpdateContact.js:51 ~ useEffect ~ err:", err)
          
          setNotFound(true);
        });
    }
  }, [setFirstName, setLastName, setPhone, setEmail, id]);

  const changeFirstName = (e) => {
    let value = e.target.value;
    if (value.length <= 20) {
      setFirstName(value);
    }
  };

  const changeLastName = (e) => {
    let value = e.target.value;
    if (value.length <= 20) {
      setLastName(value);
    }
  };

  const changePhone = (e) => {
    const addDashes = (input, previousValue) => {
      input = input.replaceAll(/[^0-9]/g, "");
      if (
        input.replaceAll(/[^0-9]/g, "") >
        previousValue.replaceAll(/[^0-9]/g, "")
      ) {
        input = input.replaceAll(/[^0-9]/g, "");
        if (input.length >= 3) {
          //input = input.split("").splice(4, 0, "-").join("");
          input = input.split("");
          input.splice(3, 0, "-");
          input = input.join("");
        }

        if (input.length >= 7) {
          input = input.split("");
          input.splice(7, 0, "-");
          input = input.join("");
        }
      }
      return input;
    };

    let value = e.target.value;
    if (value.length <= 12) {
      setPhone(addDashes(value, phone));
    }
  };

  const changeEmail = (e) => {
    let value = e.target.value;
    if (value.length <= 50) {
      setEmail(value);
    }
  };

  const validateForm = () => {
    const regexEmail = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const regexPhone = new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);
    var isOk = true;

    setFirstNameMessage(undefined);
    setLastNameMessage(undefined);
    setEmailMessage(undefined);
    setPhoneMessage(undefined);

    if (!(firstName !== "" && firstName !== null)) {
      setFirstNameMessage(
        <FormFeedback>First name cannot be empty.</FormFeedback>
      );
      isOk = false;
    }
    if (!(lastName !== "" && lastName !== null)) {
      setLastNameMessage(
        <FormFeedback>Last name cannot be empty.</FormFeedback>
      );
      isOk = false;
    }
    if (!regexEmail.test(email)) {
      setEmailMessage(<FormFeedback>Not a valid email address.</FormFeedback>);
      isOk = false;
    }
    if (phone.replaceAll("-", "").length !== 10) {
      setPhoneMessage(<FormFeedback>Number must be 10 digits.</FormFeedback>);
      isOk = false;
    } else if (!regexPhone.test(phone)) {
      setPhoneMessage(
        <FormFeedback>
          Not formatted as a valid US number, XXX-XXX-XXXX.
        </FormFeedback>
      );
      isOk = false;
    }
    return isOk;
  };

  const deleteContact = () => {
    const asyncProcess = async () => {
      let res = await axios.delete("/api/contact/" + id);
      navigate("/contacts/");
    };

    asyncProcess();
  };

  const saveContact = () => {
    const asyncProcess = async () => {
      let res = await axios.put("/api/contact/" + id, {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
      });
      navigate("/contacts");
    };

    if (validateForm()) {
      asyncProcess();
    }
  };

  const createContact = () => {
    const asyncProcess = async () => {
      let res = await axios.post("/api/contact/new", {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
      });

      if (res.data._id !== undefined) {
        navigate("/contacts/" + res.data._id);
      }
      navigate("/contacts");
    };

    if (validateForm()) {
      asyncProcess();
    }
  };

  return !notFound ? (
    <div className="edit-contact">
      <h2>{id !== undefined ? "Edit Contact" : "New Contact"}</h2>
      <Form
        className="contact-form"
        onSubmit={(e) => {
          e.preventDefault();
          id !== undefined ? saveContact() : createContact();
        }}
      >
        <div className="img-container">
          <img
            src={
              "https://www.gravatar.com/avatar/" +
              md5(email.toLowerCase().trim()) +
              "?d=mp"
            }
          />
        </div>
        <div className="name">
          {firstName}&ensp;{lastName}
        </div>
        <hr />
        <Row>
          <Col>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={changeFirstName}
                invalid={firstNameMessage === undefined ? false : true}
              />
              {firstNameMessage}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Smith"
                value={lastName}
                onChange={changeLastName}
                invalid={lastNameMessage === undefined ? false : true}
              />
              {lastNameMessage}
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="john@example.com"
            value={email}
            onChange={changeEmail}
            invalid={emailMessage === undefined ? false : true}
          />
          {emailMessage}
        </FormGroup>
        <FormGroup>
          <Label for="phone">Phone #</Label>
          <Input
            type="phone"
            name="phone"
            id="phone"
            placeholder="1234567890"
            value={phone}
            onChange={changePhone}
            invalid={phoneMessage === undefined ? false : true}
          />
          {phoneMessage}
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
        <ModalBody>Are you sure you want to delete this contact?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteContact}>
            Yes, Delete It
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  ) : (
    <Error text="There was an error accessing that contact." />
  );
}
