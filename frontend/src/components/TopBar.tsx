import { Button, Container, Nav, Navbar } from "react-bootstrap";
import "./TopBar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../StreetWaveLogo.png";
import logo1 from "../StreetWaveLogoSmall.bmp"
import React, { SyntheticEvent, useState } from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// sending props through to show the correct navigation bar
// depending on whether the user is logged in they will see an empty navigation bar (if not logged in)
// or they will see a navigation bar with different links (if they are logged in)
function TopBar(props: { userInfo: any; handleLogout: any; isLogeedInn: any }) {

  // using react hooks below similarly like in signin explained on signin
  const loggedIn = localStorage.getItem("isLoggedIn")
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/';
  const isSignUpPage = location.pathname === '/signup';
  // dictates when to render the navbar buttons
  const renderNavItems = loggedIn || (!loggedIn && !isHomePage && !isSignUpPage);
  // Logout function below
  const logout = async (e: SyntheticEvent) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    toast.info("Logged Out"); // showing a logged out message to clarify the user is now logged out
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("access_token");
    props.handleLogout();
    navigate("/");
  };

  const loggedInMenuItems = (
      <>
      <Nav className = "loggedInNavItems ms-auto">
          <Nav.Item className="ms-auto middlebutton">
            <Link to="/compare">
              <Button size="sm" variant="outline-light" className="navbutton">
                Compare
              </Button>
            </Link>
          </Nav.Item>
          <Nav.Item className="ms-auto middlebutton">
            <Link to="/edit-profile">
              <Button size="sm" variant="outline-light" className="navbutton editprofilebutton">
                Edit Profile
              </Button>
            </Link>
          </Nav.Item>
          <Nav.Item className="ms-auto middlebutton">
            <Link to="/">
              <Button
                size="sm"
                variant="outline-light"
                className="navbutton"
                onClick={logout}
              >
                Sign Out
              </Button>
            </Link>
          </Nav.Item>
        </Nav>
      </>
  );

  const loggedOutMenuItems = (
    <>
      <Nav className="ms-auto">
        <Nav.Item className="ms-auto middlebutton">
          <Link to="/signup">
            <Button size="sm" variant="outline-light" className="navbutton">
              Sign Up
            </Button>
          </Link>
        </Nav.Item>
        <Nav.Item className="ms-middlebutton">
          <Link to="/">
            <Button size="sm" variant="outline-light" className="navbutton">
              Sign In
            </Button>
          </Link>
        </Nav.Item>
      </Nav>
    </>
  );

  return (
    <Navbar id="topbar" className="py-0" expand="md">
      <Container fluid className="containermargins">
        <Navbar.Brand>
          <Link to="/">
            <img src={logo} id="logo" data-testid="logo" alt="logo" />
            <img src={logo1} id="logo1" data-testid="logo1" alt="logo1" />
          </Link>
        </Navbar.Brand>
        {renderNavItems && (
            <>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="container-fluid">
            {loggedIn ? loggedInMenuItems : loggedOutMenuItems}
          </Nav>
        </Navbar.Collapse>
            </>
        )}
      </Container>
    </Navbar>
  );
}

export default TopBar;