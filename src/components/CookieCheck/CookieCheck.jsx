import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import './CookieCheck.css';

const CookieCheck = ({ element, ...rest }) => {
    const cookies = new Cookies();
    const vmCookie = cookies.get('VMToken');
    const adminCookie = cookies.get('AdminToken');

    const type = rest.type;

    if (type === "venue") {
        return (vmCookie) ? (
            element
        ) : (
            <Navigate to="/auth" replace />
        );
    } else if (type === "admin") {
        return (adminCookie) ? (
            element
        ) : (
            <Navigate to="/auth" replace />
        );
    }
};

export default CookieCheck;
