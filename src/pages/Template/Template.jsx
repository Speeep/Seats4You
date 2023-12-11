
// Template.jsx
// The base page template for all pages

import React, { useState, useEffect } from 'react';

import { Routes, Route } from "react-router-dom";

// Template Components
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

// Pages
import CookieCheck from '../../components/CookieCheck/CookieCheck';
import Home from '../Home/Home';
import Shows from '../Shows/Shows';
import Error404 from '../Error404/Error404';
import VenueDashboard from '../VenueDashboard/VenueDashboard';
import CreateVenue from '../CreateVenue/CreateVenue';
import Venue from '../Venue/Venue';
import CreateShow from '../CreateShow/CreateShow';
import Auth from '../Auth/Auth';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import ShowsResults from '../ShowsResults/ShowsResults';
import Show from '../Show/Show';
import ShowReport from '../ShowReport/ShowReport';

import './Template.css';

const Template = () => {
  
    return (
        <div>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="auth" element={<Auth />} />
                <Route path="shows" element={<Shows />} />
                <Route path="*" element={<Error404 />} />
                <Route path="venueDashboard" element={<CookieCheck element={<VenueDashboard />} type="venue" />} />
                <Route path="venueDashboard/createVenue" element={<CookieCheck element={<CreateVenue />} type="venue" />} />
                <Route path="venueDashboard/viewVenue/:venue_id" element={<CookieCheck element={<Venue />} type="venue" />} />
                <Route path="venueDashboard/createShow" element={<CookieCheck element={<CreateShow />} type="venue"/>} />
                <Route path="adminDashboard" element={<CookieCheck element={<AdminDashboard />} type="admin" />} />
                <Route path="adminDashboard/viewVenue/:venue_id" element={<CookieCheck element={<Venue />} type="admin" />} />
                <Route path="searchShows" element={<ShowsResults />} />
                <Route path="show/:show_id" element={<Show />} />
                <Route path="adminDashboard/showReport" element={<CookieCheck element={<ShowReport />} type="admin" />} />
                <Route path="venueDashboard/showReport" element={<CookieCheck element={<ShowReport />} type="venue" />} />
            </Routes>
            <Footer />
        </div>
    )
};

export default Template;