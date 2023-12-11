const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const sectionHandler = require('./sectionHandler');

exports.handler = async (event) => {
        try {
            const deletedId = await sectionHandler.deleteSection(event.arg1);

            if (deletedId == event.arg1) {
                return {
                    statusCode: 200,
                    body: `Section with ID ${deletedId} deleted successfully`,
                };
            } else {
                return {
                    statusCode: 404,
                    body: `Section with ID ${event.arg1} not found`,
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