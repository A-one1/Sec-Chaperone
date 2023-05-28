import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Button,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";

export default function Navigation({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const signin = () => {
    window.location = "/api/auth/login/google";
  };

  const signout = () => {
    window.location = "/api/auth/logout";
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsSignedIn(
      JSON.stringify(user) !== JSON.stringify({ status: "Not Authorized" })
    );
  }, [user, setIsSignedIn]);

  return (
    <Navbar color="light" expand="sm">
      <NavbarBrand tag={Link} to="/">
        Secret Chaperone
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      {isSignedIn ? (
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/events/">
                Events
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/contacts/">
                Contacts
              </NavLink>
            </NavItem>
          </Nav>
          <UncontrolledDropdown>
            <DropdownToggle nav caret>
              Hi, {user.name?.split(" ")[0]}
            </DropdownToggle>
            <DropdownMenu flip>
              <DropdownItem tag={Link} to="/settings/">
                Settings
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={signout}>Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Collapse>
      ) : (
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/about/">
                About
              </NavLink>
            </NavItem>
          </Nav>
          <Button onClick={signin}>Login</Button>
        </Collapse>
      )}
    </Navbar>
  );
}
