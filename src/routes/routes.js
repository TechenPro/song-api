const express = require("express");
const db = require("../db");
const router = express.Router();

// Patterns for input validation
const space_re = new RegExp("^ +$");

// Parse paramters out to reate search mode and key
function parseSearchKey(params) {
    let key = params?.key;
    
    // Make sure non-empty key exists
    if (!key || space_re.test(key)) {
        throw { "name": "empty" }
    }
    // Validate type
    if (typeof (key) != "string") {
        throw { "name": "invalid" }
    }
    
    // Escape wildcard and escape characters
    key = key.replace(/@/g, "@@");
    key = key.replace(/%/g, "@%");
    key = key.replace(/_/, "@_");

    // Add wildcards to allow non-exact searches
    // Look into FTS solution
    return "%" + key + "%";
};


// Serve form
router.get("/", (req, res) => {
    res.sendFile("views/index.html", { root: process.env.root_path });
});


// Searching endpoint
router.get("/songs/search", async (req, res) => {
    let key;
    let search_query;

    // Attempt to parse the search key. Send appropriate response back if errors occur
    try {
        key = parseSearchKey(req.query);
    } catch (e) {
        if (e.name == "empty") {
            res.send({ "results": [] });
            return;
        }
        else if (e.name == "invalid") {
            res.status(422).send({ "msg": "Invalid search key type. Key should be a String."});
            return;
        }
        else {
            throw e;
        };

    };

    // Determine search mode. Switch-Case allows easy way to add more search modes and prevent harmful params
    switch (req.query?.mode) {
        case "artist":
            search_query = db.artist_search;
            break;
        default:
            search_query = db.title_search;
    };

    const result = await db.queryPromise(search_query, key)
        .catch(e => {
            console.log(e);
            res.status(500).send({ "msg": "An error occured with your search. Please try again later." });
            return;
        });

    const body = { "results": result };
    if (result.length > 499) {
        body["msg"] = "Results truncated to 500."
    }

    res.send(body);
});


// Popular songs endpoint
router.get("/songs/popular", async (req, res) => {
    let count = 1;

    // Attempt to parse a valid, positive integer from the url parameter
    try {
        if (!isNaN(req.query?.count)) {
            count = parseInt(req.query.count);
        }
    } catch (e) {
        console.log("An error occurred parsing the integer.");
    };

    // Limit max results until pagination is built
    count = Math.min(count, 500);

    const result = await db.queryPromise(db.popular_songs, count)
        .catch(e => {
            console.log(e);
            res.status(500).send({ "msg": "An error occured. Please try again later." });
            return;
        });

    const body = { "results": result };
    if (result.length > 499) {
        body["msg"] = "Results truncated to 500."
    }

    res.send(body);
});


// Duration average endpoint
router.get("/songs/duration/avg", async (req, res) => {
    const result = await db.queryPromise(db.avg_duration)
        .catch(e => {
            console.log(e);
            res.status(500).send({ "msg": "An error occured. Please try again later." });
            return;
        });
    res.send({ "results": result });
});

module.exports = router;
