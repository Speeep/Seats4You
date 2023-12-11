// API Root URL
export const API_URL = 'https://qc0uan5xyf.execute-api.us-east-2.amazonaws.com';
export const API_TEST_STAGE = API_URL + '/Test';

// Endpoints
export const CREATE_SECTION = '/createSection';
export const CREATE_VENUE = '/createVenue';
export const DELETE_SECTION = '/deleteSection';
export const DELETE_VENUE = '/deleteVenue';
export const LIST_SHOWS = '/listShows';
export const LIST_VENUES = '/listVenues';
export const LIST_ALL_VENUE_SECTIONS = '/listAllVenueSections';
export const ACTIVATE_SHOW = '/activateShow';
export const DELETE_SHOW = '/deleteShow';
export const FORCE_DELETE_SHOW = '/forceDeleteShow';
export const SEARCH_SHOWS = '/searchShows';
export const CREATE_SHOW = '/createShow';
export const LIST_ALL_ACTIVE_SHOWS = '/listAllActiveShows';
export const GET_SEATS_FOR_SHOW = '/getSeatsForShow';
export const PURCHASE_SEATS = '/purchaseSeats';


// Development
export const ROOT = 'http://localhost:3000';

// TEST DATA
export const venues = [
    { name: "Venue 1", numberOfShows: 2, id: 1, numRows: 2, numLeftCols: 3, numCenterCols: 5, numRightCols: 3, shows: [
        { show: {
            id: 1,
            name: "Show 1",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 1
        }},
        { show: {
            id: 2,
            name: "Show 2",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 1
        }},
    ]},
    { name: "Venue 2", numberOfShows: 2, id: 2, numRows: 3, numLeftCols: 2, numCenterCols: 6, numRightCols: 4, shows: [
        { show: {
            id: 3,
            name: "Show 3",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 2
        }},
        { show: {
            id: 4,
            name: "Show 4",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 2
        }},
    ] },
    { name: "Venue 3", numberOfShows: 2, id: 3, numRows: 5, numLeftCols: 3, numCenterCols: 3, numRightCols: 3, shows: [
        { show: {
            id: 5,
            name: "Show 5",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 3
        }},
        { show: {
            id: 6,
            name: "Show 6",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 3
        }},
    ] },
    { name: "Venue 4", numberOfShows: 2, id: 4, numRows: 2, numLeftCols: 3, numCenterCols: 5, numRightCols: 3, shows: [
        { show: {
            id: 7,
            name: "Show 7",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 4
        }},
        { show: {
            id: 8,
            name: "Show 8",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 4
        }},
    ] },
    { name: "Venue 5", numberOfShows: 2, id: 5, numRows: 2, numLeftCols: 3, numCenterCols: 5, numRightCols: 3, shows: [
        { show: {
            id: 9,
            name: "Show 9",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 5
        }},
        { show: {
            id: 10,
            name: "Show 10",
            earnings: 234,
            active: 0,
            date: "2023-12-06",
            time: "19:00",
            venue_id: 5
        }},
    ]}
]

export const shows = [
    {
        id: 1,
        name: "Show 1",
        earnings: 234,
        active: 0,
        date: "2023-12-06",
        time: "19:00:00",
        venue_id: 23
    },
    {
        id: 2,
        name: "Show 2",
        earnings: 234,
        active: 0,
        date: "2023-12-06",
        time: "19:00:00",
        venue_id: 23
    },
    {
        id: 3,
        name: "Show 3",
        earnings: 234,
        active: 0,
        date: "2023-12-06",
        time: "19:00:00",
        venue_id: 23
    },
    {
        id: 4,
        name: "Show 4",
        earnings: 234,
        active: 0,
        date: "2023-12-06",
        time: "19:00:00",
        venue_id: 23
    },
    {
        id: 5,
        name: "Show 5",
        earnings: 234,
        active: 0,
        date: "2023-12-06",
        time: "19:00:00",
        venue_id: 23
    },
    {
        id: 6,
        name: "Show 6",
        earnings: 234,
        active: 0,
        date: "2023-12-06",
        time: "19:00:00",
        venue_id: 23
    },
    {
        id: 7,
        name: "Show 7",
        earnings: 234,
        active: 0,
        date: "2023-12-06",
        time: "19:00:00",
        venue_id: 23
    },
    {
        id: 8,
        name: "Show 8",
        earnings: 234,
        active: 0,
        date: "2023-12-06",
        time: "19:00:00",
        venue_id: 23
    },
    {
        id: 9,
        name: "Show 9",
        earnings: 234,
        active: 0,
        date: "2023-12-06",
        time: "19:00:00",
        venue_id: 23
    }
]

