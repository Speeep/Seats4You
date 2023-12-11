const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const blockHandler = require('./blockHandler');

exports.handler = async (event) => {
        try {
            const showId = await blockHandler.deleteBlocksOfShow(event);

            if (showId == event.showId) {
                return {
                    statusCode: 200,
                    body: `Blocks of show with ID ${showId} deleted successfully`,
                };
            } else {
                return {
                    statusCode: 404,
                    body: `Blocks of show with ID ${event.showId} not found`,
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