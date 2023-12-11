
// CreateVenue.jsx
// 

import React, { useState, useEffect } from 'react';
import { FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';

import { useNavigate } from 'react-router-dom';

import './CreateVenue.css';

import * as Constants from '../../constants';

import axios from 'axios';

const CreateVenue = () => {

    const navigate = useNavigate();

    var [venueName, setVenueName] = useState("");
    var [numRows, setNumRows] = useState("");
    var [numLeftSectionColumns, setNumLeftSectionColumns] = useState("");
    var [numCenterSectionColumns, setNumCenterSectionColumns] = useState("");
    var [numRightSectionColumns, setNumRightSectionColumns] = useState("");

    // Generate the row labels
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (venueName === "") {
            alert("Please enter a venue name!");
        } else {
            if (numRows <= 0) {
                alert("Number of rows must be greater than 0!");
            } else {
                if (numLeftSectionColumns <= 0) {
                    alert("Number of left section columns must be greater than 0!");
                } else {
                    if (numCenterSectionColumns <= 0) {
                        alert("Number of center section columns must be greater than 0!");
                    } else {
                        if (numRightSectionColumns <= 0) {
                            alert("Number of right section columns must be greater than 0!");
                        } else {
                            axios.post(Constants.API_TEST_STAGE + Constants.CREATE_VENUE, {
                                "arg1": venueName,
                                "arg2": numRows,
                                "arg3": numLeftSectionColumns,
                                "arg4": numRows,
                                "arg5": numCenterSectionColumns,
                                "arg6": numRows,
                                "arg7": numRightSectionColumns
                            })
                            .then((response) => {
                                console.log(response);
                                navigate("/venueDashboard");
                            })
                            .catch((error) => {
                                console.log(error);
                            });

                            alert("Venue created!");
                        }
                    }
                }
            }
        }
    }

    return (
        <div>
            <h1 id="pageTitle">Venue Management</h1>

            <div className="createVenue">
                <h2>Create a Venue</h2>
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
                <FormGroup className="venueForm">
                    <FormGroup>
                        <Label for="venueName">Venue Name</Label>
                        <Input type="text" id="venueName" placeholder="Venue Name" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="numRows">Number of Rows</Label>
                        <Input type="number" id="numRows" placeholder="Rows" value={numRows} onChange={(e) => setNumRows(e.target.value)} invalid={numRows <= 0 && numRows != ""} valid={numRows > 0}/>
                        <FormFeedback invalid>Rows must be greater than 0!</FormFeedback>
                        <FormFeedback valid></FormFeedback>
                    </FormGroup>
                    <div className="sectionInputs">
                        <FormGroup>
                            <Label for="numLeftSectionColumns">Number of Left Section Columns</Label>
                            <Input type="number" id="numLeftSectionColumns" placeholder="Left Section Columns" value={numLeftSectionColumns} onChange={(e) => setNumLeftSectionColumns(e.target.value)} invalid={numLeftSectionColumns <= 0 && numLeftSectionColumns != ""} valid={numLeftSectionColumns > 0}/>
                            <FormFeedback invalid>Number of columns must be greater than 0!</FormFeedback>
                            <FormFeedback valid></FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="numCenterSectionColumns">Number of Center Section Columns</Label>
                            <Input type="number" id="numCenterSectionColumns" placeholder="Center Section Columns" value={numCenterSectionColumns} onChange={(e) => setNumCenterSectionColumns(e.target.value)} invalid={numCenterSectionColumns <= 0 && numCenterSectionColumns != ""} valid={numCenterSectionColumns > 0}/>
                            <FormFeedback invalid>Number of columns must be greater than 0!</FormFeedback>
                            <FormFeedback valid></FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="numRightSectionColumns">Number of Right Section Columns</Label>
                            <Input type="number" id="numRightSectionColumns" placeholder="Right Section Columns" value={numRightSectionColumns} onChange={(e) => setNumRightSectionColumns(e.target.value)} invalid={numRightSectionColumns <= 0 && numRightSectionColumns != ""} valid={numRightSectionColumns > 0}/>
                            <FormFeedback invalid>Number of columns must be greater than 0!</FormFeedback>
                            <FormFeedback valid></FormFeedback>
                        </FormGroup>
                    </div>
                    <br />
                    <FormGroup>
                        <div className="submitButton">
                            <Button type="submit" color="primary" onClick={handleSubmit}>Submit</Button>
                        </div>
                    </FormGroup>
                </FormGroup>
            </div>
        </div>
    )
};

export default CreateVenue;