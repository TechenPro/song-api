const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

// App setup
app.use(bodyParser.json());
app.disable("x-powered-by");

// To easily access resources
process.env.root_path = __dirname;
process.env.db_path = path.join(__dirname, "../db/SpotifyFeatures.db");

const routes = require("./routes/routes");
app.use("/", routes);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
