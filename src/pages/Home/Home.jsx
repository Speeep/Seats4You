
// Home.jsx
// Home page

// TODO 11/29 Removed Venue Manager button, need a login page

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import * as Constants from '../../constants';
import Cookies from 'universal-cookie';

import SearchBar from '../../components/SearchBar/SearchBar';

import './Home.css';

const Home = () => {

    const cookies = new Cookies();
    const vmCookie = cookies.get('VMToken');
    const adminCookie = cookies.get('AdminToken');

    const [search, setSearch] = useState("");

    const shows = Constants.shows;

    const navigate = useNavigate();

    // TODO CHANGE TO A LAMBDA FUNCTION
    let handleSubmit = (e) => {
        e.preventDefault();

        axios.post(Constants.API_TEST_STAGE + Constants.SEARCH_SHOWS, {
            "showName": search
        })
        .then((response) => {
            console.log(response.data.body);
            navigate("/searchShows", {
                state: {
                    search: search,
                    searchedShows: response.data.body
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    let searchBarProperties = {
        search: search,
        setSearch: setSearch,
        handleSubmit: handleSubmit,
        placeholder: "Search for a show..."
    }

    return (
        <div>
            <h1 id="pageTitle">Home</h1>
            <div className="actors">
                {vmCookie ? (
                    <div>
                        <div className="actorButtons">
                            <Link to="/venueDashboard">Venue Manager Dashboard</Link>
                            <Link to="/auth">Logout</Link>
                        </div>
                    </div>
                ) : adminCookie ? (
                    <div>
                        <div className="actorButtons">
                            <Link to="/adminDashboard">Admin Dashboard</Link>
                            <Link to="/auth">Logout</Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="actorButtons">
                            <Link to="/auth">Login</Link>
                            <Link to="/shows">All Active Shows</Link>
                        </div>
                        <div className="searchShows">
                            <SearchBar {...searchBarProperties} />
                        </div>
                    </div>
                )
                }
            </div>
        </div>
    );
}

export default Home;