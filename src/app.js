const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const db = require('./db.js');

// App setup
app.use(bodyParser.json());
app.disable("x-powered-by");

// To easily access resources
process.env.root_path = __dirname;

const routes = require("./routes/routes");
app.use("/", routes);

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});

// Exit method to close the db connection
process.on("SIGTERM", () => {
    db.closeDb();
    console.log("Closing http server.");
    server.close(e => {
        process.exit(err ? 1 : 0);
    });
});

module.exports = server;
