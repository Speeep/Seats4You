const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const sectionHandler = require('./sectionHandler');
const venueHandler = require('./venueHandler');

exports.handler = async (event) => {
    try {

        const sections = await venueHandler.listAllVenueSections(event);

        if (sections !== undefined) {
            return {
                statusCode: 200,
                leftSection: sections[0],
                centerSection: sections[1],
                rightSection: sections[2]
            };
        } else {
            return {
                statusCode: 500,
                body: 'Error listing the venue sections.',
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