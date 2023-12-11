const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const venueHandler = require('./venueHandler');

exports.handler = async (event) => {
    try {

        const body = await venueHandler.listVenues();

            return {
                statusCode: 200,
                body: body
            };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};
