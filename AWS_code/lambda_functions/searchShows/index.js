const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const showHandler = require('./showHandler');

exports.handler = async (event) => {
    try {
        const body = await showHandler.searchShows(event);

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