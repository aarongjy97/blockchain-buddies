# Express.JS Offchain

Run <code>npm i</code> to install all dependencies.

Create a <code>.env</code> in this directory, and copy the format of <code>.env.example</code> to it.

Ensure that psql is running at port 5432, and change the login details for psql accordingly.

To initialize the database, using the terminal, run the following commands:

1. <code>cd /sql</code>
2. <code>psql</code>
3. If you haven't already, then <code>create database blockchainbuddies;</code>
4. <code>\c blockchainbuddies</code>
5. <code>\i init.sql</code>

Ensure that the contracts have been compiled in <code>../blockchain</code> before starting the server.

Run <code>npm start</code> to boot the express server.

