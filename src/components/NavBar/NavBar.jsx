
// NavBar.jsx
// The navigation bar at the top of the page

// TODO 11/29 Removed list shows, add back

import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';

import './NavBar.css';

const NavBar = () => {

    return (
        <div>
            <Navbar color="light" expand="md" style={{ paddingLeft: "2em", paddingRight: "5em" }}>
                <NavbarBrand href="/">Seats4u</NavbarBrand>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <Link to="/" className="nav-link">Home</Link>
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    );
}

export default NavBar;