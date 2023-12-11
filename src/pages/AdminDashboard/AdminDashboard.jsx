
// AdminDashboard.jsx
// Admin Dashboard

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import axios from 'axios';
import * as Constants from '../../constants';

import './AdminDashboard.css';

const AdminDashboard = () => {

    const [venues, setVenues] = useState([]);

    useEffect(() => {
        axios.get(Constants.API_TEST_STAGE + Constants.LIST_VENUES)
            .then(res => {
                setVenues(res.data.body);
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
        console.log(venues);
    }, []);

    const navigate = useNavigate();

    const viewVenue = (id) => (e) => {
        e.preventDefault();
        navigate(`/adminDashboard/viewVenue/${id}`);
    }

    return (
        <div>
            <h1 id="pageTitle">Admin Dashboard</h1>
            <div className="actions">
                <Link to="showReport" className="generateShowReport">Generate Show Report</Link>
            </div>
            <div className="venues">
                <h3>Venues</h3>
                {venues?.map((venue, index) => (
                    <div key={index}>
                        <a href="" className="venue" onClick={viewVenue(venue.id)}>
                            {venue.name}
                            {/* ({venue.numberOfShows} {venue.numberOfShows > 1 ? "shows" : "show"}) */}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default AdminDashboard;