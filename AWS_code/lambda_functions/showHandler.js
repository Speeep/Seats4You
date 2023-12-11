// SHOW HANDLER

const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const venueHandler = require('./venueHandler');
const sectionHandler = require('./sectionHandler');
const blockHandler = require('./blockHandler');

async function createShow(event) {
    const name = String(event.name);
    const date = String(event.date);
    const time = String(event.time);
    const venueId = Number(event.venueId);
    const blocks = event.blocks;

    if (!(await venueHandler.checkVenueExistence(venueId))) {
        return 'Venue does not exist, please try a different ID.';
    }

    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormat.test(date)) {
        return 'Invalid date input, please enter date in format yyyy-mm-dd.';
    }

    const timeFormat = /^\d{1,2}:\d{2}$/;
    if (!timeFormat.test(time)) {
        return 'Invalid time input, please enter time in format xx:xx.';
    }

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        // Create Blocks Here
        const sectionQuery = 'SELECT leftSection_id, centerSection_id, rightSection_id FROM Ticketing.venue WHERE id = ?';
        const [sectionResult, sectionFields] = await connection.execute(sectionQuery, [venueId]);

        const leftSectionId = sectionResult[0].leftSection_id;
        const centerSectionId = sectionResult[0].centerSection_id;
        const rightSectionId = sectionResult[0].rightSection_id;

        const leftSectionDetails = await sectionHandler.getSectionDetails(leftSectionId);
        const centerSectionDetails = await sectionHandler.getSectionDetails(centerSectionId);
        const rightSectionDetails = await sectionHandler.getSectionDetails(rightSectionId);

        // Perform checks for left section
        if (!checkBlocksValidity(leftSectionDetails, blocks)) {
            return 'Invalid blocks configuration for the left section.';
        }

        // Perform checks for center section
        if (!checkBlocksValidity(centerSectionDetails, blocks)) {
            return 'Invalid blocks configuration for the center section.';
        }

        // Perform checks for right section
        if (!checkBlocksValidity(rightSectionDetails, blocks)) {
            return 'Invalid blocks configuration for the right section.';
        }

        const leftSectionSeats = (leftSectionDetails.columns * leftSectionDetails.rows)
        const centerSectionSeats = (centerSectionDetails.columns * centerSectionDetails.rows)
        const rightSectionSeats = (rightSectionDetails.columns * rightSectionDetails.rows)

        const totalSeats = leftSectionSeats + centerSectionSeats + rightSectionSeats

        // If we get here then we know that each seat in each section is assigned to one and only one block.
        // Therefore, we can go ahead and create the show and the blocks.

        const sql = 'INSERT INTO Ticketing.show (show.name, show.date, show.time, show.venue_id, show.total_seats) VALUES (?, ?, ?, ?, ?)';
        const values = [name, date, time, venueId, totalSeats];

        const [result, fields] = await connection.execute(sql, values);
        const newShowId = result.insertId;

        const createBlockSql = 'INSERT INTO Ticketing.block (block.rows, block.price, block.show_id, block.section_id) VALUES (?, ?, ?, ?)';

        // Initialize an array to store information about each block
        const createdBlocks = [];

        // Iterate through blocks and insert them into the database
        for (const block of blocks) {

            const event = {
                "startRow": block.startRow,
                "endRow": block.endRow,
                "price": block.price,
                "show_id": newShowId,
                "section_id": block.section,
            };

            const body = await blockHandler.createBlock(event);

            // Add block information to the createdBlocks array
            createdBlocks.push(body);
        }

        // Add show and blocks information to the return payload
        const createdShow = {
            showId: newShowId,
            name: name,
            date: date,
            time: time,
            venueId: venueId,
        };

        return_payload = {
            show: createdShow,
            blocks: createdBlocks,
        };

        console.log(return_payload)

        return return_payload;
    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

async function checkShowExistence(showId) {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const sql = 'SELECT COUNT(*) as count FROM Ticketing.show WHERE show.id = ?';
        const [result, fields] = await connection.execute(sql, [showId]);
        const count = result[0].count;

        if (count > 0) {
            return true
        } else {
            return false
        }

    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

async function listShows() {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const [rows, fields] = await connection.execute('SELECT * FROM Ticketing.show');
        return rows;
    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

async function listActiveShows() {
    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const [rows, fields] = await connection.execute('SELECT * FROM Ticketing.show WHERE (active = 1)');

        return rows;

    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

async function activateShow(event) {

    const showId = Number(event.showId);

    if (showId === undefined) {
        return 'Show ID is required for activation.';
    }

    if (!isFinite(showId) || showId <= 0) {
        return 'Show ID must be a number.';
    }

    const isValidShow = await checkShowExistence(showId);

    if (!isValidShow) {
        return 'Show ID must be for an existing show.';
    }

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {

        // Check to make sure show is not already activated
        const getShowActiveStautsSQL = 'SELECT active FROM Ticketing.show WHERE show.id = ?';
        const [activeResult] = await connection.execute(getShowActiveStautsSQL, [showId]);

        if (activeResult.length > 0) {
            if (activeResult[0].active == 1) {
                return "Show is already active and cannot be activated again."
            }
        } else {
            return "Show cannot be found for given ID."
        }

        // Activate all the seats in each block
        const getBlockIdSQL = 'SELECT id FROM Ticketing.block WHERE block.show_id = ?';
        const [blockResult] = await connection.execute(getBlockIdSQL, [showId]);
    
        // Check if there's a result
        if (blockResult.length > 0) {

            for (const result of blockResult) {
                // Activate all seats of a block
                const activated = await blockHandler.activateBlock(result.id);
            }

        } else {
            return "No blocks found for this show!"
        }

        const activateShowQuery = 'UPDATE Ticketing.show SET active = 1 WHERE show.id = ?';
        const [result, fields] = await connection.execute(activateShowQuery, [showId]);
        
        if (result.affectedRows > 0) {
            return showId
        } else {
            return "No shows were activated."
        }
    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

function checkBlocksValidity(sectionDetails, blocks) {

    const totalSeats = sectionDetails.rows * sectionDetails.columns;

    // Create an array to represent each seat in the section
    const seatsCoverage = new Array(totalSeats).fill(false);

    // Iterate through blocks and check validity
    for (const block of blocks) {

        // Check if block belongs in this section
        if (block.section == sectionDetails.id) {

            // Add check to make sure price is a valid number
            if (!isFinite(block.price) || block.price <= 0) {
                return false;
            }

            // For each block, set all the seats coverage vals to true. 
            const startSeatIndex = Number(block.startRow) * Number(sectionDetails.columns);
            const endSeatIndex = (Number(block.endRow) + 1) * Number(sectionDetails.columns);

            for (let i = startSeatIndex; i < endSeatIndex; i++) {
                if (seatsCoverage[i]) {
                    // Seat is covered by another block
                    return false;
                }
                seatsCoverage[i] = true;
            }
        }
    }

    // Check for any gaps
    if (seatsCoverage.includes(false)) {
        // There are gaps in seat coverage
        return false;
    }
    // There are no gaps, hooray!
    return true;
}

async function deleteShow(event, force) {
    const showId = Number(event.showId);
    const allowForce = Boolean(force);

    if (!isFinite(showId) || showId <= 0) {
        return 'Show ID must be a number.';
    }

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {

        const showExists = await checkShowExistence(showId);

        if (!showExists) {
            return `Show with ID ${showId} does not exist!`
        }

        if (allowForce == false) {
            const checkActiveSql = 'SELECT active FROM Ticketing.show WHERE show.id = ?';
            const [result] = await connection.execute(checkActiveSql, [showId]);

            if (result[0].active === 1) {
                return `Show with ID ${showId} is active and cannot be deleted.`;
            }
        }

        const deleted = await blockHandler.deleteBlocksOfShow(showId);

        if (!deleted == showId) {
            return `Blocks from showId ${showId} were not deleted.`
        }

        const deleteShowSql = 'DELETE FROM Ticketing.show WHERE show.id = ?';
        const [results, fields] = await connection.execute(deleteShowSql, [showId]);

        if (results.affectedRows > 0) {
            return showId;
        } else {
            return `Show with ID ${showId} was not able to be deleted successfully.`
        }

    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

async function searchShows(event) {
    const showName = String(event.showName);

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {

        const [rows] = await connection.execute(
            'SELECT * FROM Ticketing.show WHERE LOWER(show.name) LIKE ? AND show.active = 1',
            [`%${showName.toLowerCase()}%`]
        );

        return rows;

    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

module.exports = { createShow, checkShowExistence, listShows, listActiveShows, activateShow, deleteShow, searchShows };