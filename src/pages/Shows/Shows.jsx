
// Shows.jsx
// Displays all shows

import React, { useMemo, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

import * as Constants from '../../constants';

import './Shows.css';

const Shows = () => {

    // TEMP DATA
    // const shows = Constants.shows;

    // TODO Make an API call that doesn't return Earnings
    const [shows, setShows] = useState([]);

    useEffect(() => {
        axios.get(Constants.API_TEST_STAGE + Constants.LIST_ALL_ACTIVE_SHOWS)
            .then(res => {
                setShows(res.data.body);
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
        console.log(shows);
    }, []);

    const renderDate = (date) => {
        return moment(date).format('MMMM Do YYYY');
    }

    const renderTime = (time) => {
        return moment('20231205' + time, 'YYYYMMDDHHmmss').format('h:mm a');
    }

    return (
        <div>
            <h1 id="pageTitle">All Active Shows</h1>
            <div className="allShows">
                {shows.length === 0 ? (
                    <div>
                        <h2>No Shows Found</h2>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Show Name</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shows?.map((show, index) => (
                                <tr key={index}>
                                    <Link to={"/show/" + show.id}>
                                        <td>{show.name}</td>
                                    </Link>
                                    <td>{renderDate(show.date)}</td>
                                    <td>{renderTime(show.time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Shows;