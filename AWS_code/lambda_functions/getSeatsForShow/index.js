const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const seatHandler = require('./seatHandler');

exports.handler = async (event) => {
    try {

        const body = await seatHandler.getSeatsForShow(event);

        if (typeof(body) !== 'string') {
            return {
                statusCode: 200,
                body: body
            };
        } else {
            return {
                statusCode: 500,
                body: body
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