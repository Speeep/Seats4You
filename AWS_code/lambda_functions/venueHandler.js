// VENUE HANDLER

const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const sectionHandler = require('./sectionHandler');

async function createVenue(event) {
    const venueName = event.arg1;
    const leftRows = event.arg2;
    const leftColumns = event.arg3;
    const centerRows = event.arg4;
    const centerColumns = event.arg5;
    const rightRows = event.arg6;
    const rightColumns = event.arg7;

    if (typeof venueName !== 'string') {
        throw new Error('Venue name must be a string.');
    }

    if (!(venueName && leftRows && leftColumns && centerRows && centerColumns && rightRows && rightColumns)) {
        throw new Error('Not enough event args passed.');
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
        const leftSectionId = await sectionHandler.createSection(leftRows, leftColumns);
        const centerSectionId = await sectionHandler.createSection(centerRows, centerColumns);
        const rightSectionId = await sectionHandler.createSection(rightRows, rightColumns);

        const sql = 'INSERT INTO Ticketing.venue (venue.name, venue.leftSection_id, venue.centerSection_id, venue.rightSection_id) VALUES (?, ?, ?, ?)';
        const values = [venueName, leftSectionId, centerSectionId, rightSectionId];

        const [result, fields] = await connection.execute(sql, values);
        const lastInsertedId = result.insertId;

        return {
            body: {
                venueId: lastInsertedId,
                venueName: venueName,
                leftSectionRows: leftRows,
                leftSectionColumns: leftColumns,
                centerSectionRows: centerRows,
                centerSectionColumns: centerColumns,
                rightSectionRows: rightRows,
                rightSectionColumns: rightColumns,
            }
        };

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

async function deleteVenue(event) {
    const venueIdToDelete = event.arg1;

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        await sectionHandler.deleteSectionsByVenueId(venueIdToDelete);

        const deleteVenueSql = 'DELETE FROM Ticketing.venue WHERE venue.id = ?';
        await connection.execute(deleteVenueSql, [venueIdToDelete]);

        return {
            body: `Venue with ID ${venueIdToDelete} and associated sections deleted successfully`,
        };

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

async function checkVenueExistence(venueId) {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const sql = 'SELECT COUNT(*) as count FROM Ticketing.venue WHERE venue.id = ?';
        const [result, fields] = await connection.execute(sql, [venueId]);
        const count = result[0].count;

        return count > 0;

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

async function listVenues() {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const [rows, fields] = await connection.execute('SELECT * FROM Ticketing.venue');

        return rows;

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

async function listAllVenueSections(event) {

    const venueId = event.venueId;

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const venuesql = 'SELECT leftSection_id, centerSection_id, rightSection_id FROM Ticketing.venue WHERE venue.id = ?';
        const [venueResult, fields] = await connection.execute(venuesql, [venueId]);

        const leftSection_id = venueResult[0].leftSection_id;
        const centerSection_id = venueResult[0].centerSection_id;
        const rightSection_id = venueResult[0].rightSection_id;

        const sectionsql = 'SELECT * FROM Ticketing.section WHERE section.id = ?';
        const [leftResult, leftFields] = await connection.execute(sectionsql, [leftSection_id]);
        const [centerResult, centerFields] = await connection.execute(sectionsql, [centerSection_id]);
        const [rightResult, rightFields] = await connection.execute(sectionsql, [rightSection_id]);

        const left = {
            id: leftResult[0].id,
            rows: leftResult[0].rows,
            columns: leftResult[0].columns
        }

        const center = {
            id: centerResult[0].id,
            rows: centerResult[0].rows,
            columns: centerResult[0].columns
        }

        const right = {
            id: rightResult[0].id,
            rows: rightResult[0].rows,
            columns: rightResult[0].columns
        }

        return [left, center, right];

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

module.exports = { createVenue, deleteVenue, checkVenueExistence, listVenues, listAllVenueSections };