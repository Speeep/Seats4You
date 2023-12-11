const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const sectionHandler = require('./sectionHandler');

exports.handler = async (event) => {
        try {
            const lastInsertedId = await sectionHandler.createSection(event.arg1, event.arg2);

            return {
                statusCode: 200,
                body: { sectionId: lastInsertedId },
            };
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: 500,
                body: 'Internal Server Error',
            };
        }
};
