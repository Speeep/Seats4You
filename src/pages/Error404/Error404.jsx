
// Error404.jsx
// 404 page if a resource isn't found

import React from 'react';

import './Error404.css';

const Error404 = () => {
  
    return (
        <div>
            <div className="pageTitle">
                <h1>404</h1>
            </div>
            <div className="error404">
                <h2>Page Not Found :/</h2>
                <p>The page you are looking for doesn't exist.</p>
            </div>
        </div>
    )
};

export default Error404;