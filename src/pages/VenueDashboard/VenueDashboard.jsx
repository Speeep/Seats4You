
// VenueDashboard.jsx
// The Venue Manager's Dashboard

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, redirect } from "react-router-dom";

import './VenueDashboard.css';

import axios from 'axios';

// Constants
import * as Constants from '../../constants';

const VenueDashboard = () => {

    // TEMP DATA
    // const venues = Constants.venues;

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

    // Define a navigation hook object to move between pages
    const navigate = useNavigate();

    const viewVenue = (id) => (e) => {
        e.preventDefault();
        navigate(`/venueDashboard/viewVenue/${id}`);
    }
        
    return ( 
        <div>
            <h1 id="pageTitle">Venue Management</h1>

            <div className="actions">
                <Link to="createVenue" className="createVenue">Create a Venue</Link>
                <Link to="createShow" className="createShow">Create a Show</Link>
                <Link to="showReport" className="generateShowReport">Generate Show Report</Link>
            </div>
            <div className="allVenues">
                <div>
                    <h3>Venues</h3>
                </div>
                {/* Loop over all venues to make a table */}
                {venues?.map((venue, index) => (
                    <div key={index}>
                        <div>
                            <a href="" className="venueName" onClick={viewVenue(venue.id)}>
                                {venue.name}
                                {/* ({venue.numberOfShows} {venue.numberOfShows > 1 ? "shows" : "show"}) */}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
    
};

export default VenueDashboard;