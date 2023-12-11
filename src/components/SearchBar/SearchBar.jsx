
// SearchBar.jsx
// Defines a SearchBar component which contains the CSRFToken for security and the search bar and button combination for use on multiple pages

import React from 'react';
import { Input, Button } from 'reactstrap';
import * as Constants from '../../constants';

import './SearchBar.css';

const SearchBar = (props) => {

    return (
        <div>
            <form className="searchForm" action="">
                <div className="searchInput">
                    <Input type="text" id="search" placeholder={props.placeholder} value={props.search} onChange={e => props.setSearch(e.target.value)} />
                    <Button color="primary" type="submit" onClick={props.handleSubmit}>Search</Button>
                </div>
            </form>
        </div>
    );
}

export default SearchBar;