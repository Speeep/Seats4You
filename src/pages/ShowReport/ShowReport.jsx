
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import moment from 'moment';

import * as Constants from '../../constants';

import './ShowReport.css';

const ShowReport = () => {

    const [shows, setShows] = useState([]);
    const [venues, setVenues] = useState([]);

    useEffect(() => {
        axios.get(Constants.API_TEST_STAGE + Constants.LIST_SHOWS)
            .then((response) => {
                setShows(response.data.body);
                console.log(response.data.body);
            })
            .catch((error) => {
                console.log(error);
            });

        axios.get(Constants.API_TEST_STAGE + Constants.LIST_VENUES)
            .then((response) => {
                setVenues(response.data.body);
                console.log(response.data.body);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const renderDate = (date) => {
        return moment(date).format('MMMM Do YYYY');
    }

    const renderTime = (time) => {
        return moment('20231205' + time, 'YYYYMMDDHHmmss').format('h:mm a');
    }

    return (
        <div>
            <h1 id="pageTitle">Show Report</h1>
            {(venues && shows) ? (
                <div id="venues">
                    {venues?.map((venue) => {
                        return (
                            <div id="shows">
                                <h2>{venue.name}</h2>
                                {shows?.map((show) => {
                                    if (show.venue_id == venue.id) {
                                        return (
                                            <div>
                                                <h4>{show.name}</h4>
                                                <p>{renderDate(show.date)}</p>
                                                <p>{renderTime(show.time)}</p>
                                                <p>Seats Sold: {show.seats_sold}</p>
                                                <p>Remaining Seats: {show.total_seats - show.seats_sold}</p>
                                                <p>Earnings: ${show.earnings}</p>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default ShowReport