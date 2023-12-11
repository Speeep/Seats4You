
// Auth.jsx
// The Login screen

import React, { useState } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import './Auth.css';

import axios from 'axios';
import Cookies from 'universal-cookie';

// Constants
import * as Constants from '../../constants';

const Auth = () => {

    const navigate = useNavigate();

    const testCredentials =  [
        {
            userType: "Admin",
            username: "admin",
            password: "admin",
            cookie: "ADMINADMIN"
        },
        {
            userType: "VenueManager",
            username: "test",
            password: "test",
            cookie: "TESTTEST"
        }
    ];

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const cookies = new Cookies();
    const vmCookie = cookies.get('VMToken');
    const adminCookie = cookies.get('AdminToken');
  
    if (vmCookie === undefined && adminCookie === undefined) {
        return (
            <div>
                <h1 id="pageTitle">Login</h1>
                <div className="loginSection">
                    <div className="loginPageForm">
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input type="text" name="username" id="username" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" id="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        </FormGroup>
                        <button className="btn btn-primary" onClick={() => {
                            let credFound = false;
                            // Check both the Admin and VenueManger DBs for a matching username and password
                            for (let i = 0; i < testCredentials.length; i++) {
                                if (testCredentials[i].username === username && testCredentials[i].password === password) {
                                    // If found, set the cookie for that user
                                    if (testCredentials[i].userType === "Admin") {
                                        cookies.set('AdminToken', testCredentials[i].cookie, { path: '/' });
                                        // Navigate to the respective dashboard
                                        navigate('/adminDashboard');
                                    } else if (testCredentials[i].userType === "VenueManager") {
                                        cookies.set('VMToken', testCredentials[i].cookie, { path: '/' });
                                        // Navigate to the respective dashboard
                                        navigate('/venueDashboard');
                                    }
                                    credFound = true;
                                }
                            }
                            if (!credFound) {
                                alert("Incorrect username or password");
                            }
                        }}>Login</button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <button id="logout" className="btn btn-primary" onClick={() => {
                    // Remove the AdminToken and VMToken cookies from the session
                    cookies.remove('AdminToken', { path: '/' });
                    cookies.remove('VMToken', { path: '/' });
                    // Navigate to the home page
                    navigate('/');
                }}>Logout</button>
            </div>
        )
    }
};

export default Auth;