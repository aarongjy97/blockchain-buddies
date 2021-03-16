const { Pool } = require('pg')
const dotenv = require("dotenv");

dotenv.config()

const credentials = {
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    post: process.env.post
}

const pool = new Pool(credentials);

const transact = async (callback) => {
    const client = await pool.connect()

    try {
        await client.query(`BEGIN`)
        const result = await callback(client.query.bind(client))
        await client.query(`COMMIT`)
        return result
    } catch (err) {
        await client.query(`ROLLBACK`)
        throw err
    } finally {
        client.release()
    }
}

module.exports = {
    query: pool.query.bind(pool), 
    transact
}