import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function NavbarComponent() {
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      // Redirect to login page or handle logout accordingly
    } catch {
      console.log("Failed to log out");
    }
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">
        Your App Name
      </Navbar.Brand>
      <Nav className="ml-auto">
        {currentUser && (
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}
