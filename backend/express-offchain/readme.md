# Express.JS Offchain

Run `npm i` to install all dependencies.

Create a `.env` in this directory, and copy the format of `.env.example` to it.

Ensure that psql is running at port 5432, and change the login details for psql accordingly.

To initialize the database, using the terminal, run the following commands:

1. `cd /sql`
2. `psql`
3. If you haven't already, then `create database blockchainbuddies;`
4. `\c blockchainbuddies`
5. `\i init.sql`

Ensure that the contracts have been compiled in `../blockchain` before starting the server.

Run `npm start` to boot the express server.