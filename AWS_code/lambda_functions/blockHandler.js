const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const seatHandler = require('./seatHandler.js');

// Ensures that the number is an integer greater than 0.
function isValidNumber(value) {
    value = Number(value);
    return isFinite(value) && Math.floor(value) === value;
}

// Ensures that the number is an double greater than 0.
function isValidDouble(value) {
    return isFinite(value) && value > 0;
}

async function createBlock(event) {
    const startRow = Number(event.startRow);
    const endRow = Number(event.endRow);
    const price = Number(event.price);
    const show = Number(event.show_id);
    const section = Number(event.section_id);
    console.log('Creating block with rows:', startRow, 'to ', endRow, ', at price: $', price , ', for show: ', show, ', in section: ', section);

    if (!isValidDouble(price)) {
        return 'Invalid price value';
    }

    if (!isValidNumber(show)) {
        return 'Invalid show id value';
    }

    if (!isValidNumber(section)) {
        return 'Invalid section id value';
    }


    if (!isValidNumber(startRow)) {
        return 'Invalid startRow value';
    }

    if (!isValidNumber(endRow)) {
        return 'Invalid endRow value';
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

        if (!(await checkShowExistence(show))) {
            return 'Show does not exist, please try a different ID.';
        }

        const sql = 'INSERT INTO Ticketing.block (block.rows, block.price, block.show_id, block.section_id, block.startRow, block.endRow) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [(endRow-startRow+1), price, show, section, startRow, endRow];

        const [result, fields] = await connection.execute(sql, values);

        // Create seats for block

        const blockInfo = {
            "price": price,
            "startRow": startRow,
            "endRow": endRow,
            "sectionId": section,
            "blockId": result.insertId,
        }

        const seatsCreated = await seatHandler.createSeats(blockInfo)

        return {
            "id": result.insertId,
            "rows": (endRow-startRow+1),
            "price": price,
            "showId": show,
            "sectionId": section,
            "startRow": startRow,
            "endRow": endRow,
          };

    }  catch (error) {
        return error;
    }  finally {
        pool.end();
    }
}

async function deleteBlock(event) {

    const blockId = Number(event.blockId);

    if (!isValidNumber(blockId)) {
        return 'Invalid blockId value';
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

        if (blockId) {
            const deleteBlockSql = 'DELETE FROM Ticketing.block WHERE block.id = ?';
            const [result, fields] = await connection.execute(deleteBlockSql, [blockId]);
            if (result.affectedRows > 0) {
                return blockId
            } else {
                return 'Invalid blockId value'
            }
        }
    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

async function deleteBlocksOfShow(showId) {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        if (showId) {
            const deleteAllBlocksSql = 'DELETE FROM Ticketing.block WHERE block.show_id = ?';
            const [result, fields] = await connection.execute(deleteAllBlocksSql, [showId]);
            if (result.affectedRows > 0) {
                return showId
            } else {
                return 'Invalid showId value'
            }
        }
    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

async function listBlocksOfShow(event){
    const showId = event.showId;

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const listBlocksSql = 'SELECT * FROM Ticketing.block WHERE block.show_id = ?';
        const [result, fields] = await connection.execute(listBlocksSql, [showId]);

        if (result.length !== 0) {
            return result
        } else {
            return 'No blocks were found for provided showId value'
        }
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

async function activateBlock(blockId) {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        // Activate all the seats in this block
        const getSeatsIdSQL = 'SELECT id FROM Ticketing.seat WHERE seat.block_id = ?';
        const [seatsResult] = await connection.execute(getSeatsIdSQL, [blockId]);
    
        // Check if there's a result
        if (seatsResult.length > 0) {

            for (const result of seatsResult) {
                // Activate all seats of a block
                const activateSeatsSQL = 'UPDATE Ticketing.seat SET available = 1 WHERE id = ?';
                const [seatResult, seatFeild] = await connection.execute(activateSeatsSQL, [result.id]);
            }

        } else {
            return "No seats found for this block!"
        }

    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

module.exports = { createBlock, deleteBlock, deleteBlocksOfShow, listBlocksOfShow, activateBlock };