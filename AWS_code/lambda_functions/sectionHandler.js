// SECTION HANDLER

const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');

function isInteger(value) {
    value = Number(value);
    return isFinite(value) && Math.floor(value) === value;
}

// Ensures that the number is an integer greater than 0.
function isValidNumber(value) {
    return isInteger(value) && value > 0;
}

async function createSection(rows, columns) {
    console.log('Creating section with rows:', rows, 'and columns:', columns);

    if (!isValidNumber(rows) || !isValidNumber(columns)) {
        throw new Error('Invalid rows or columns values.');
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
        const sql = 'INSERT INTO Ticketing.section (section.rows, section.columns) VALUES (?, ?)';
        const values = [rows, columns];

        console.log('Executing SQL:', sql, 'with values:', values);

        const [result, fields] = await connection.execute(sql, values);

        return result.insertId;

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

async function deleteSection(sectionId) {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {

        if (sectionId) {
            const deleteSectionSql = 'DELETE FROM Ticketing.section WHERE section.id = ?';
            const [result, fields] = await connection.execute(deleteSectionSql, [sectionId]);
            if (result.affectedRows > 0) {
                return sectionId
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

async function deleteSectionsByVenueId(venueId) {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const getSectionsSql = 'SELECT leftSection_id, centerSection_id, rightSection_id FROM Ticketing.venue WHERE venue.id = ?';
        const [result, fields] = await connection.execute(getSectionsSql, [venueId]);
        
        const leftSectionId = result[0].leftSection_id;
        const centerSectionId = result[0].centerSection_id;
        const rightSectionId = result[0].rightSection_id;

        await deleteSection(leftSectionId);
        await deleteSection(centerSectionId);
        await deleteSection(rightSectionId);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

async function getSectionDetails(sectionId) {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const sectionQuery = 'SELECT `id`, `rows`, `columns` FROM Ticketing.section WHERE id = ?';
        const [sectionResult, sectionFields] = await connection.execute(sectionQuery, [sectionId]);

        return sectionResult[0];
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

module.exports = { createSection, deleteSection, deleteSectionsByVenueId, getSectionDetails};