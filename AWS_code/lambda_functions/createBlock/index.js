const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const blockHandler = require('./blockHandler');

exports.handler = async (event) => {
    try {

        const body = await blockHandler.createBlock(event);

        if (typeof(body) === 'object') {
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