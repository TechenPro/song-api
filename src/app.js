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

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
