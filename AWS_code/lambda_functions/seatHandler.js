const mysql = require('mysql2/promise');
const db_access = require('/opt/db_access/db_access');
const sectionHandler = require('./sectionHandler');

async function createSeats(blockInfo) {

    const price = blockInfo.price;
    const startRow = blockInfo.startRow;
    const endRow = blockInfo.endRow;
    const sectionId = blockInfo.sectionId;
    const blockId = blockInfo.blockId;

    const sectionDetails = await sectionHandler.getSectionDetails(sectionId);
    const columns = Number(sectionDetails.columns);

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        for (let row = startRow; row <= endRow; row++) {
            for (let column = 0; column < columns; column++) {
                const sql = 'INSERT INTO Ticketing.seat (price, seat.row, seat.column, block_id, section_id) VALUES (?, ?, ?, ?, ?)';
                const values = [price, row, column, blockId, sectionId];

                const [result, fields] = await connection.execute(sql, values);
            }
        }

    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

async function getSeatsForShow(event) {

    const showId = Number(event.showId);

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {

        const seats = [];

        // Get each block in the show
        const searchBlocksSQL = 'SELECT * FROM Ticketing.block WHERE block.show_id = ?';
        const [blockResult, blockFeilds] = await connection.execute(searchBlocksSQL, [showId]);

        const blockIds = [];

        for (const block of blockResult) {
            blockIds.push(block.id);
        }

        // Get each seat in the blocks
        const searchSeatsSQL = 'SELECT * FROM Ticketing.seat WHERE seat.block_id = ?';

        for (const id of blockIds) {
            const [seatResult, seatFeilds] = await connection.execute(searchSeatsSQL, [id]);
            seats.push(seatResult);
        }

        // Return all the seats
        return seats;

    } catch (error) {
        return error;
    } finally {
        pool.end();
    }
}

async function purchaseSeats(event){

    const seatIdsObj = event.seatIds;

    const seatIds = [];

    for (const seatId of seatIdsObj) {
        seatIds.push(Number(seatId));
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

        // Check to make sure seatIds is valid.
        if (!Array.isArray(seatIds) || seatIds.length == 0) {
            return 'No seats selected';
        }
        
        // Check to make sure all the seats are available first.
        for (let i = 0; i < seatIds.length; i++) {
            const seatId = seatIds[i];
            const available = await isSeatAvailable(seatId);

            // If even one seat is unavailable, dont even purchase the seats that are available.
            if (!available) {
                return 'Failed to purchase seats, one or more seats unavailable';
            }
        }

        // This will only run if all seats are available.
        for (let i = 0; i < seatIds.length; i++) {
            const seatId = seatIds[i];
            const sql = 'UPDATE Ticketing.seat SET available = 0 WHERE id = ?';
            const [seatResult, seatFeild] = await connection.execute(sql, [seatId]);
        }

        for (const seatId of seatIds) {
        
            // Fetch block_id for the seat
            const getBlockIdSQL = 'SELECT block_id, price FROM Ticketing.seat WHERE id = ?';
            const [blockResult] = await connection.execute(getBlockIdSQL, [seatId]);
        
            // Check if there's a result
            if (blockResult.length > 0) {
                const blockId = blockResult[0].block_id;
                const seatPrice = blockResult[0].price;
        
                // Fetch show_id for the block
                const getShowIdSQL = 'SELECT show_id FROM Ticketing.block WHERE id = ?';
                const [showResult] = await connection.execute(getShowIdSQL, [blockId]);
        
                // Check if there's a result
                if (showResult.length > 0) {
                    const showId = showResult[0].show_id;
                    
                    //TODO increase earnings here
                    const getEarningsSQL = 'SELECT earnings FROM Ticketing.show WHERE id = ?';
                    const [currentEarningsResult] = await connection.execute(getEarningsSQL, [showId]);

                    const currentEarnings = currentEarningsResult[0].earnings;

                    const getSeatsSoldSQL = 'SELECT seats_sold FROM Ticketing.show WHERE id = ?';
                    const [currentSeatsSoldResult] = await connection.execute(getSeatsSoldSQL, [showId]);

                    const currentSeatsSold = currentSeatsSoldResult[0].seats_sold;

                    const updateEarningsSQL = 'UPDATE Ticketing.show SET earnings = ? WHERE id = ?';
                    const [earningsResult, earningsFeild] = await connection.execute(updateEarningsSQL, [Number(currentEarnings + seatPrice), showId]);

                    const updateSeatsSoldSQL = 'UPDATE Ticketing.show SET seats_sold = ? WHERE id = ?';
                    const [seatsSoldResult, seatsSoldFeild] = await connection.execute(updateSeatsSoldSQL, [Number(currentSeatsSold + 1), showId]);

                } else {
                    return`No show_id found for block_id ${blockId}`;
                }
            } else {
                return `No block_id found for seat_id ${seatId}`;
            }
        }

        // Return success message
        return seatIds;

    } catch (error) {
        return error;
    } finally {
        pool.end();
    }

}

async function isSeatAvailable(seatId) {

    const pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database,
        connectionLimit: 20,
    });

    const connection = await pool.getConnection();

    try {
        const sql = 'SELECT available FROM Ticketing.seat WHERE seat.id = ?';
        const [result, fields] = await connection.execute(sql, [seatId]);
        
        if (result.length > 0) {
            return result[0].available == 1;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
    } finally {
        pool.end();
    }
}


module.exports = { createSeats, getSeatsForShow, purchaseSeats};
