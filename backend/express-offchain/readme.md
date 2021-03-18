# Express.JS Offchain

Run <code>npm i</code> to install all dependencies.

Create a <code>.env</code> in this directory, and copy the format of <code>.env.example</code> to it.

Ensure that psql is running at port 5432, and change the login details for psql accordingly.

Using the terminal, run the following commands:

1. <code>cd /sql</code>
2. <code>psql</code>
3. If you haven't already, then <code>create database blockchainbuddies;</code>
4. <code>\c blockchainbuddies</code>
5. <code>\i init.sql</code>

The database should be set up, and you can run <code>npm start</code> to boot the express server.

