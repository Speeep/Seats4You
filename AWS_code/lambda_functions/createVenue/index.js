const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const sectionHandler = require('./sectionHandler');
const venueHandler = require('./venueHandler');

exports.handler = async (event) => {
    try {

        const body = await venueHandler.createVenue(event);

        if (body !== undefined) {
            return {
                statusCode: 200,
                body: body
            };
        } else {
            return {
                statusCode: 500,
                body: 'Error creating the venue.',
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};