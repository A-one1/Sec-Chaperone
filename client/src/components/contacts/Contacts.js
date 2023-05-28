import axios from "axios";
import md5 from "blueimp-md5";
import { useEffect, useState } from "react";
import {
  AddCircleOutline,
  AddOutline,
  CallOutline,
  MailOutline,
  PersonAddOutline,
} from "react-ionicons";
import { Route, Router, Routes, useNavigate } from "react-router-dom";
import CreateUpdateContact from "./CreateUpdateContact";

export default function Contacts() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ListContacts />} />
        <Route path="/new" element={<CreateUpdateContact />} />
        <Route path="/:id" element={<CreateUpdateContact />} />
      </Routes>
    </div>
  );
}

function ListContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get("/api/contact").then((res, err) => {
      setContacts(res.data);
    });
  }, [setContacts]);

  const contactRender = contacts.map((x) => {
    return (
      <li
        key={x._id}
        onClick={() => {
          navigate("/contacts/" + x._id);
        }}
      >
        <div className="img-container">
          <img
            src={
              "https://www.gravatar.com/avatar/" +
              md5(x.email.toLowerCase().trim()) +
              "?d=mp"
            }
          />{" "}
        </div>
        <div className="header">
          {x.firstName} {x.lastName}
        </div>
        <div className="properties">
          <div>
            <CallOutline /> {x.phone}
          </div>
          <div>
            <MailOutline /> {x.email}
          </div>
        </div>
      </li>
    );
  });

  return (
    <div className="contacts">
      <h2>Contacts</h2>
      <div className="contact-list">
        <ul>
          <li
            className="contact-list-add"
            onClick={() => {
              navigate("/contacts/new");
            }}
          >
            <div className="header">
              <PersonAddOutline /> Add Contact
            </div>
          </li>
          {contactRender}
        </ul>
      </div>
    </div>
  );
}
