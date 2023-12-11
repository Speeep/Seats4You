
import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { Button, Input } from "reactstrap";

import axios from "axios";
import * as Constants from "../../constants";
import moment from "moment";
import Cookies from "universal-cookie";

import VenueLayout from "../../components/VenueLayout/VenueLayout";

import "./Show.css";

const Show = () => {

    let { show_id } = useParams();

    const cookies = new Cookies();
    const adminCookie = cookies.get("AdminToken");
    const vmCookie = cookies.get("VMToken");

    const [shows, setShows] = useState([]);
    const [venues, setVenues] = useState([]);
    const [seats, setSeats] = useState([]);
    const [seatBlocks, setSeatBlocks] = useState(0);

    const [selectedSeats, setSelectedSeats] = useState([]);

    const [show, setShow] = useState([]);
    const [venue, setVenue] = useState([]);
    const sectionNames = ["Left", "Center", "Right"];
    const [venueSections, setVenueSections] = useState([]);

    const [refresh, setRefresh] = useState(0);

    const handleSeatSelection = (selectedSeat) => {
        if (isSeatSelected(selectedSeat)) {
            // If the seat is already selected, remove it from the array
            setSelectedSeats(prevSeats => prevSeats.filter(seat => !areSeatsEqual(seat, selectedSeat)));
        } else {
            // If the seat is not selected, add it to the array
            setSelectedSeats(prevSeats => [...prevSeats, selectedSeat]);
        }
    };

    const isSeatSelected = (seat) => {
        return selectedSeats.some(selected => areSeatsEqual(selected, seat));
    };

    const areSeatsEqual = (seat1, seat2) => {
        return seat1.row === seat2.row && seat1.column === seat2.column && seat1.section_id === seat2.section_id;
    };

    const handleCheckout = () => {
        const seatIds = selectedSeats.map(seat => seat.id);
        console.log(seatIds);

        axios.post(Constants.API_TEST_STAGE + Constants.PURCHASE_SEATS, {
            "seatIds": seatIds,
        }).then(res => {
            console.log(res.data);
            if (res.data.statusCode === 200) {
                alert("Purchase successful!");
            } else if (res.data.statusCode === 500) {
                alert(res.data.body);
            }
            setRefresh(refresh + 1);
            setSelectedSeats([]);
        }).catch(err => {
            console.log(err);
        });
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const showsResponse = await axios.get(Constants.API_TEST_STAGE + Constants.LIST_SHOWS);
                setShows(showsResponse.data.body);
                const venuesResponse = await axios.get(Constants.API_TEST_STAGE + Constants.LIST_VENUES);
                setVenues(venuesResponse.data.body);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        const updateState = async () => {
            const selectedShow = shows.find((show) => show.id == show_id);
            const selectedVenue = venues.find((venue) => venue.id == selectedShow?.venue_id);

            await Promise.all([
                setShow(selectedShow),
                setVenue(selectedVenue),
            ]);

            const showSeats = await axios.post(Constants.API_TEST_STAGE + Constants.GET_SEATS_FOR_SHOW, {
                "showId": show_id
                });
            console.log(showSeats);

            const availableSeatsInBlocks = [];
            for (let block in showSeats.data.body) {
                const availableSeats = [];
                for (let seat in showSeats.data.body[block]) {
                    if (showSeats.data.body[block][seat].available == 1) {
                        availableSeats.push(showSeats.data.body[block][seat]);
                        // console.log(availableSeats);
                    }
                }
                availableSeatsInBlocks.push(availableSeats);
            }
            setSeats(availableSeatsInBlocks);
            setSeatBlocks(showSeats.data.body.length);

            const venueSections = await axios.post(Constants.API_TEST_STAGE + Constants.LIST_ALL_VENUE_SECTIONS, {
                "venueId": selectedVenue?.id
                });
            const leftSectionValue = venueSections.data.leftSection.id;
            const centerSectionValue = venueSections.data.centerSection.id;
            const rightSectionValue = venueSections.data.rightSection.id;
            setVenueSections([leftSectionValue, centerSectionValue, rightSectionValue]);
        };

        if (shows.length > 0 && venues.length > 0) {
            updateState();
        }

        console.log(selectedSeats);
    }, [shows, venues, selectedSeats, refresh]);

    const renderDate = (date) => {
        return moment(date).format('MMMM Do YYYY');
    }

    const renderTime = (time) => {
        return moment('20231205' + time, 'YYYYMMDDHHmmss').format('h:mm a');
    }

    return (
        <div>
            {show ? (
                <div className="show">
                    <h1>{show?.name}</h1>
                    <p>{renderDate(show?.date)}</p>
                    <p>{renderTime(show?.time)}</p>
                </div>
            ) : (
                <div></div>
            )}
            {venue ? (
                <div className="venueLayout">
                    <h2>{venue?.name}</h2>
                    <VenueLayout venue={venue} />
                </div>
            ) : (
                <div></div>
            )}
            {(vmCookie == undefined && adminCookie == undefined) ? (
                <div>
                    <h2>Blocks</h2>
                    {seats ? (
                        <div className="seats">
                            {Array.from(Array(seatBlocks).keys()).map((block) => (
                                <div className="block">
                                    <h3>Block {block + 1}</h3>
                                    <h4>Section {
                                        sectionNames[venueSections.indexOf(seats[block][0]?.section_id)]
                                    }</h4>
                                    <table>
                                        <tr>
                                            <th>Row</th>
                                            <th>Column</th>
                                            <th>Price</th>
                                            <th>Purchase?</th>
                                        </tr>
                                        {seats[block]?.map((seat) => (
                                            <tr key={`${seat.row}-${seat.column}`}>
                                                <td>{String.fromCharCode(seat.row + 65)}</td>
                                                <td>{seat.column + 1}</td>
                                                <td>${seat.price}</td>
                                                <td>
                                                    <Input
                                                        type="checkbox"
                                                        onChange={() => handleSeatSelection(seat)}
                                                        checked={selectedSeats.some(selected => selected.row === seat.row && selected.column === seat.column && selected.section_id === seat.section_id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            ))    
                            }
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <div className="purchase">
                        <h3>Selected Seats</h3>
                        <table>
                            <tr>
                                <th>Row</th>
                                <th>Column</th>
                                <th>Price</th>
                            </tr>
                            {selectedSeats.map((seat) => (
                                <tr key={`${seat.row}-${seat.column}`}>
                                    <td>{String.fromCharCode(seat.row + 65)}</td>
                                    <td>{seat.column + 1}</td>
                                    <td>${seat.price}</td>
                                </tr>
                            ))}
                        </table>
                        <div className="total">
                            <h3>Total</h3>
                            <p>${selectedSeats.reduce((total, seat) => total + seat.price, 0)}</p>    
                        </div>
                        <Button color="primary" onClick={handleCheckout}>Checkout</Button>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}

export default Show;