
// Venue.jsx
// Shows an individual venue and allows the user to delete it

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import * as Constants from '../../constants';

import VenueLayout from '../../components/VenueLayout/VenueLayout';

import axios from 'axios';
import moment from 'moment';
import Cookies from 'universal-cookie';

import './Venue.css';

const Venue = () => {

    // TEMP DATA
    // const venues = Constants.venues;

    const navigate = useNavigate();

    let { venue_id } = useParams();

    const cookies = new Cookies();
    const adminCookie = cookies.get('AdminToken');

    const [venue, setVenue] = useState({});
    const [shows, setShows] = useState([]);

    const [refresh, setRefresh] = useState(0);

    const activateShow = (e) => {
        e.preventDefault();
        const show_id = e.target.id;
        console.log("Show ID: " + show_id);
        axios.post(Constants.API_TEST_STAGE + Constants.ACTIVATE_SHOW, {
            "showId": show_id
        })
        .then((response) => {
            console.log(response);
            setRefresh(refresh + 1);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const deleteShow = (e) => {
        e.preventDefault();
        const show_id = e.target.id;
        console.log("Show ID: " + show_id);
        axios.post(Constants.API_TEST_STAGE + Constants.DELETE_SHOW, {
            "showId": show_id
        })
        .then((response) => {
            console.log(response);
            setRefresh(refresh + 1);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const forceDeleteShow = (e) => {
        e.preventDefault();
        const show_id = e.target.id;
        console.log("Show ID: " + show_id);
        axios.post(Constants.API_TEST_STAGE + Constants.FORCE_DELETE_SHOW, {
            "showId": show_id
        })
        .then((response) => {
            console.log(response);
            setRefresh(refresh + 1);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Venues
                const venuesResponse = await axios.get(Constants.API_TEST_STAGE + Constants.LIST_VENUES);
                setVenue(venuesResponse.data.body.filter(venue => venue.id == venue_id)[0]);
    
                // Fetch Shows
                const showsResponse = (await axios.get(Constants.API_TEST_STAGE + Constants.LIST_SHOWS));
                setShows(showsResponse.data.body.filter(show => show.venue_id == venue_id));
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, [refresh]);

    const handleDelete = (e) => {
        e.preventDefault();
        axios.post(Constants.API_TEST_STAGE + Constants.DELETE_VENUE, {
            "arg1": venue_id
        })
        .then((response) => {
            console.log(response);
            navigate('/venueDashboard');

        })
        .catch((error) => {
            console.log(error);
        });
    }

    const renderDate = (date) => {
        return moment(date).format('MMMM Do YYYY');
    }

    const renderTime = (time) => {
        return moment('20231205' + time, 'YYYYMMDDHHmmss').format('h:mm a');
    }

    return (
        <div>
            <h1 id="pageTitle">Venue Management</h1>

            <div className="venue">
                {venue ? (
                    <div>
                        <h2>{venue.name}</h2>
                        <VenueLayout venue={venue} />
                    </div>
                ) : (
                    <div></div>
                
                )}
            </div>

            <div className="deleteButton">
                <Link onClick={handleDelete}>Delete Venue</Link>
            </div>

            <div className="shows">
                <h2>Shows</h2>
                <table className="showTable">
                    <tr>
                        <th className="showNameHeader">Show Name</th>
                        <th className="showDateHeader">Date</th>
                        <th className="showTimeHeader">Time</th>
                        <th className="showActiveHeader">Active</th>
                        <th className="deleteShow">Delete Show</th>
                    </tr>
                    {shows?.map((show, index) => (
                        <tr key={index}>
                            <Link to={`/show/${show.id}`}>
                                <td className="showName">{show.name}</td>
                            </Link>
                            <td className="showDate">{renderDate(show.date)}</td>
                            <td className="showTime">{renderTime(show.time)}</td>
                            <td className="showActive">
                                <input type="checkbox" checked={show.active} id={show.id} onChange={activateShow} />
                            </td>
                            {(!show.active) ? (
                                <td className="deleteShow">
                                    <Link id={show.id} onClick={deleteShow}>Delete Show</Link>
                                </td>
                            ) : (adminCookie) ? (
                                <td className="deleteShow">
                                    <Link id={show.id} onClick={forceDeleteShow}>Force Delete Show</Link>
                                </td>
                            ) : (
                                <td>Cannot Delete an Active Show</td>
                            )}
                        </tr>
                ))}
                </table>
            </div>

        </div>
    )
};

export default Venue;