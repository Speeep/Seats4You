
import React from "react";
import { useLocation, Link } from "react-router-dom";
import moment from "moment";

import "./ShowsResults.css";

const ShowsResults = () => {

    const location = useLocation();
    const search = location.state.search;
    const searchedShows = location.state.searchedShows;

    console.log(searchedShows);

    const renderDate = (date) => {
        return moment(date).format('MMMM Do YYYY');
    }

    const renderTime = (time) => {
        return moment('20231205' + time, 'YYYYMMDDHHmmss').format('h:mm a');
    }

    return (
        <div>
            <h1 id="pageTitle">Show Results</h1>
            <h2 id="resultsTitle">Results for "{search}"</h2>
            <div className="results">
                {searchedShows?.map((show) => (
                    <Link to={"/show/" + show.id}>
                        <div className="show">
                            <h3>{show.name}</h3>
                            <p>{show.venue_id}</p>
                            <p>{renderDate(show.date)}</p>
                            <p>{renderTime(show.time)}</p>
                        </div>
                    </Link>
                ))}
                {searchedShows.length === 0 ? (
                    <div className="noResults">
                        <h3>No results found for "{search}"</h3>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}

export default ShowsResults;