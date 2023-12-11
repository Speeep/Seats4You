const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const blockHandler = require('./blockHandler');

exports.handler = async (event) => {
        try {
            const deletedBlockId = await blockHandler.deleteBlock(event);

            if (deletedBlockId == Number(event.blockId)) {
                return {
                    statusCode: 200,
                    body: `Block with ID ${deletedBlockId} deleted successfully`,
                };
            } else if (deletedBlockId !== undefined) {
                return {
                    statusCode: 404,
                    body: deletedBlockId
                };
            } else {
                return {
                    statusCode: 500,
                    body: 'Error deleting the block.',
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