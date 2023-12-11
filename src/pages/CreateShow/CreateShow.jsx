
// CreateShow.jsx
// Allows the creation of a show
// TODO Make Blocks work, apparently not needed for Iteration 1

import React, { useState, useEffect } from 'react';
import { FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import * as Constants from '../../constants';

import VenueLayout from '../../components/VenueLayout/VenueLayout';

import './CreateShow.css';

import axios from 'axios';
import Venue from '../Venue/Venue';

const CreateShow = () => {

    const [venueId, setVenueId] = useState("");
    const [venues, setVenues] = useState([]);
    const [venue, setVenue] = useState({});
    const [venueSections, setVenueSections] = useState([]);

    const [showName, setShowName] = useState("");
    const [showDate, setShowDate] = useState("");
    const [showTime, setShowTime] = useState("");

    const [allOneBlock, setAllOneBlock] = useState(false);
    const [allOnePrice, setAllOnePrice] = useState(0);
    const [numBlocks, setNumBlocks] = useState(0);
    const [rowLabelArray, setRowLabelArray] = useState([]);

    const [blocks, setBlocks] = useState([]);

    const navigate = useNavigate();

    const handleBlockChange = (blockIndex, field, value) => {
        // Update the specific field of the block at blockIndex
        setBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks[blockIndex] = { ...updatedBlocks[blockIndex], [field]: value };
            return updatedBlocks;
        });
    };

    const isDateBeforeToday = (showDate) => new Date(showDate).toISOString().split('T')[0] < new Date().toISOString().split('T')[0];
    const isDateToday = (showDate) => new Date(showDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);

    const createShow = (e) => {
        e.preventDefault();
        if (venueId === "") {
            alert("Please select a venue");
            return;
        }
        if (showName === "") {
            alert("Please enter a show name");
            return;
        }
        if (showDate === "") {
            alert("Please enter a show date");
            return;
        }

        if (isDateBeforeToday(showDate)) {
            alert("Please enter a show date that is in the future");
            return;
        }

        if (showTime === "") {
            alert("Please enter a show time");
            return;
        }

        if (allOneBlock) {
            if (allOnePrice <= 0) {
                alert("Please enter a block price greater than 0");
                return;
            }

            axios.post(Constants.API_TEST_STAGE + Constants.CREATE_SHOW, {
                name: showName,
                date: showDate,
                time: showTime,
                venueId: venueId,
                blocks: [
                    {
                        startRow: 0,
                        endRow: venueSections.leftSection.rows - 1,
                        section: venueSections.leftSection.id,
                        price: allOnePrice
                    },
                    {
                        startRow: 0,
                        endRow: venueSections.centerSection.rows - 1,
                        section: venueSections.centerSection.id,
                        price: allOnePrice
                    },
                    {
                        startRow: 0,
                        endRow: venueSections.rightSection.rows - 1,
                        section: venueSections.rightSection.id,
                        price: allOnePrice
                    }
                ]
            }).then((response) => {
                console.log(response);
                alert("Show created successfully!");
                navigate("/venueDashboard/viewVenue/" + venueId);
            }).catch((error) => {
                alert("Error creating show");
            });

        } else {
            if (numBlocks < 3) {
                alert("Please enter a number of blocks greater than 3");
                return;
            } else {
                for (let i = 0; i < blocks.length; i++) {
                    if (blocks[i].section === "") {
                        alert("Please select a section for block " + (i + 1));
                        return;
                    }
                    if (blocks[i].price <= 0) {
                        alert("Please enter a price greater than 0 for block " + (i + 1));
                        return;
                    }
                    if (blocks[i].startRow === "") {
                        alert("Please select a start row for block " + (i + 1));
                        return;
                    }
                    if (blocks[i].endRow === "") {
                        alert("Please select an end row for block " + (i + 1));
                        return;
                    }
                    if (blocks[i].startRow > blocks[i].endRow) {
                        alert("Start row cannot be greater than end row for block " + (i + 1));
                        return;
                    }
                }
            }

            axios.post(Constants.API_TEST_STAGE + Constants.CREATE_SHOW, {
                name: showName,
                date: showDate,
                time: showTime,
                venueId: venueId,
                blocks: blocks
            }).then((response) => {
                console.log(response);
                if (response.data.statusCode === 500) {
                    alert(response.data.body);
                    return;
                } else {
                    alert("Show created successfully!");
                    navigate("/venueDashboard/viewVenue/" + venueId);
                }
            }).catch((error) => {
                alert("Error creating show");
            });
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const venuesResponse = await axios.get(Constants.API_TEST_STAGE + Constants.LIST_VENUES);
            setVenues(venuesResponse.data.body);
        }

        fetchData();

    }, []);

    useEffect(() => {
        const fetchSections = async () => {
            const sectionsResponse = await axios.post(Constants.API_TEST_STAGE + Constants.LIST_ALL_VENUE_SECTIONS, { venueId: venueId });
            setVenueSections(sectionsResponse.data);
            const sections = sectionsResponse.data;
            setRowLabelArray(Array.from({ length: sections.leftSection.rows }, (_, index) => String.fromCharCode(65 + index)));
        }

        if (venueId !== "") {
            setVenue(venues.find((v) => v.id == venueId));

            fetchSections();

        }
        console.log(blocks);

        if (numBlocks > 0 & blocks.length < numBlocks) {
            setBlocks((prevBlocks) => {
                    const updatedBlocks = [...prevBlocks];
                    updatedBlocks.push({ section: "", price: 0, startRow: "", endRow: "" });
                    return updatedBlocks;
                }
            );
        } else if (numBlocks > 0 & blocks.length > numBlocks) {
            setBlocks((prevBlocks) => {
                    const updatedBlocks = [...prevBlocks];  
                    updatedBlocks.pop();
                    return updatedBlocks;
                }
            );
        } else if (numBlocks == 0 & blocks.length > 0) {
            setBlocks([]);
        }
    }, [venueId, blocks, numBlocks]);

    return (
        <div>
            <h1 id="pageTitle">Venue Management</h1>

            <div className="createShow">
                <h2>Create a Show</h2>
                <FormGroup>
                    <Label for="venueName">Venue Name</Label>
                    <Input type="select" name="venueName" id="venueName" onChange={(e) => setVenueId(e.target.value)} value={venueId}>
                        <option value="">Select a venue</option>
                        {venues?.map((venue, index) => (
                            <option key={index} value={venue.id}>{venue.name}</option>
                        ))}
                    </Input>
                </FormGroup>
                {venue ? (
                    <VenueLayout venue={venue} />
                ) : (
                    <div></div>
                )}
                <div className="showDetails">
                    <FormGroup>
                        <Label for="showName">Show Name</Label>
                        <Input type="text" id="showName" placeholder="Show Name" value={showName} onChange={(e) => setShowName(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="showDate">Show Date</Label>
                        <Input type="date" id="showDate" placeholder="Show Date" value={showDate} onChange={(e) => setShowDate(e.target.value)} invalid={
                            showDate !== "" && (isDateBeforeToday(showDate))
                        }
                        valid={
                            (showDate !== "" && (isDateToday(showDate))) || ((showDate !== "" && !(isDateBeforeToday(showDate))))
                        }/>
                        <FormFeedback invalid>Date must be in the future</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="showTime">Show Time</Label>
                        <Input type="time" id="showTime" placeholder="Show Time" value={showTime} onChange={(e) => setShowTime(e.target.value)} />
                    </FormGroup>
                </div>
                <br />
                <div className="blocks">
                    <h2>Manage Blocks</h2>
                    <FormGroup>
                        <Label for="allOneBlock">All One Block</Label>
                        <Input type="checkbox" id="allOneBlock" placeholder="All One Block" value={allOneBlock} onChange={(e) => setAllOneBlock(e.target.checked)} />
                    </FormGroup>
                    {allOneBlock ? (
                        <FormGroup>
                            <Label for="blockPrice">Block Price ($)</Label>
                            <Input type="number" id="blockPrice" placeholder="Block Price" value={allOnePrice} onChange={(e) => setAllOnePrice(e.target.value)}/>
                        </FormGroup>
                    ) : (
                        <div className="blocks">
                            <div className="blockForm">
                                <FormGroup>
                                    <Label for="numBlocks" className="numBlocksLabel">Number of Blocks</Label>
                                    <Input type="number" id="numBlocks" placeholder="Number of Blocks" value={numBlocks} onChange={(e) => setNumBlocks(e.target.value)} />
                                </FormGroup>
                                {(numBlocks > 0 & blocks.length == numBlocks) ? (
                                    Array.from({ length: numBlocks }, (_, index) => index + 1).map((blockNumber) => (
                                        <div key={blockNumber} className="block">
                                            <h3>Block {blockNumber}</h3>
                                            <div>
                                                <div>
                                                    <Label for={`blockSection${blockNumber}`}>Block Section</Label>
                                                    <Input type="select" name={`blockSection${blockNumber}`} id={`blockSection${blockNumber}`} onChange={(e) => handleBlockChange(blockNumber - 1, 'section', e.target.value)} value={blocks[blockNumber - 1].section}>
                                                        <option value="">Select a section</option>
                                                        <option value={venueSections.leftSection.id}>Left</option>
                                                        <option value={venueSections.centerSection.id}>Center</option>
                                                        <option value={venueSections.rightSection.id}>Right</option>
                                                    </Input>
                                                </div>
                                                <div>
                                                    <Label for={`blockPrice${blockNumber}`}>Block Price ($)</Label>
                                                    <Input type="number" id={`blockPrice${blockNumber}`} onChange={(e) => handleBlockChange(blockNumber - 1, 'price', e.target.value)} placeholder="Block Price" value={blocks[blockNumber - 1].price} />
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <Label for={`startRow${blockNumber}`}>Start Row</Label>
                                                    <Input type="select" name={`startRow${blockNumber}`} id={`startRow${blockNumber}`} onChange={(e) => handleBlockChange(blockNumber - 1, 'startRow', e.target.value)} value={blocks[blockNumber - 1].startRow}>
                                                        <option value="">Select a row</option>
                                                        {rowLabelArray?.map((rowLetter) => (
                                                            <option key={rowLetter} value={rowLetter.charCodeAt(0) - 65}>{rowLetter}</option>
                                                        ))}
                                                    </Input>
                                                </div>
                                                <div>
                                                    <Label for={`endRow${blockNumber}`}>End Row</Label>
                                                    <Input type="select" name={`endRow${blockNumber}`} id={`endRow${blockNumber}`} onChange={(e) => handleBlockChange(blockNumber - 1, 'endRow', e.target.value)} value={blocks[blockNumber - 1].endRow}>
                                                        <option value="">Select a row</option>
                                                        {rowLabelArray?.map((rowLetter) => (
                                                            <option key={rowLetter} value={rowLetter.charCodeAt(0) - 65}>{rowLetter}</option>
                                                        ))}
                                                    </Input>
                                                </div>
                                            </div>
                                        </div>
                                    ))) :(
                                        <div></div>
                                    )}
                                </div>
                        </div>
                    )}
                </div>
                <div className="createShowButton">
                    <a href="" onClick={createShow}>Create Show</a>
                </div>
            </div>
        </div>
    )
};

export default CreateShow;