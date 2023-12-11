
import React, { useEffect, useState } from "react";

import axios from "axios";

import * as Constants from "../../constants";

import "./VenueLayout.css";

const VenueLayout = (props) => {

    const {
        venue
    } = props;

    const [numRows, setNumRows] = useState(0);
    const [numLeftSectionColumns, setNumLeftSectionColumns] = useState(0);
    const [numCenterSectionColumns, setNumCenterSectionColumns] = useState(0);
    const [numRightSectionColumns, setNumRightSectionColumns] = useState(0);

    useEffect(() => {
        axios.post(Constants.API_TEST_STAGE + Constants.LIST_ALL_VENUE_SECTIONS, { venueId: venue.id })
            .then(res => {    
                let leftSection = res.data.leftSection;
                let centerSection = res.data.centerSection;
                let rightSection = res.data.rightSection;

                setNumRows(leftSection.rows);
                setNumLeftSectionColumns(leftSection.columns);
                setNumCenterSectionColumns(centerSection.columns);
                setNumRightSectionColumns(rightSection.columns);
            })
            .catch(err => {
                console.log(err);
            });
    }, [venue]);

    const rowLabelArray = Array.from({ length: numRows }, (_, index) => String.fromCharCode(65 + index));
    const rowLabelElements = rowLabelArray.map((rowLetter) => (
        <div key={rowLetter}><b>{rowLetter}</b></div>
    ));

    function createSectionElements(numRows, numColumns) {
        const rowsArray = Array.from({ length: numRows }, (_, index) => index + 1);
        const colsArray = Array.from({ length: numColumns }, (_, index) => index + 1);
        const elements = rowsArray.map((rowNumber) => (
            <div className="seatRow" key={rowNumber}>
                { colsArray.map((colNumber) => (
                    <div className="seat" key={colNumber}>
                        {colNumber}
                    </div>
                ))}
            </div>
        ));
        return elements;
    }

    const leftSectionElements = createSectionElements(numRows, numLeftSectionColumns);
    const centerSectionElements = createSectionElements(numRows, numCenterSectionColumns);
    const rightSectionElements = createSectionElements(numRows, numRightSectionColumns);

    return (
        <div className="layout">
            <div className="stage">
                Stage
            </div>
            <div className="seatsArea">
                <div className="rowLabels">
                    {rowLabelElements}
                </div>
                <div className="sections">
                    <div className="leftSection">
                        {leftSectionElements}
                        <b>Left Section</b>
                    </div>
                    <div className="centerSection">
                        {centerSectionElements}
                        <b>Center Section</b>
                    </div>
                    <div className="rightSection">
                        {rightSectionElements}
                        <b>Right Section</b>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VenueLayout;