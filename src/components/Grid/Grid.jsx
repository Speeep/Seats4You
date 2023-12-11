
// Grid.jsx
// A results grid using AGGrid

import React from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import './Grid.css';

const Grid = ({ options }) => {
    return (
        <div className="ag-theme-alpine" style={{ height: '70vh' }}>
            <div style={{ height: '100%', width: '100%' }}>
                <AgGridReact
                    {...options}
                />
            </div>
        </div>
    );
}

export default Grid;