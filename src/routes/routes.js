const express = require("express");
const db = require("../db");
const router = express.Router();


// Parse paramters out to reate search mode and key
function parseSearchKey(params){
    let key = params?.key;

    // Make sure non-empty key exists
    if(!key || [" ", "\"", "\'"].indexOf(key) > -1){
        throw {"name": "empty"}
    }
    // Validate type
    if(typeof(key) != String){
        try{
            key = String(key);
        } catch {
            throw {"name":"invalid"}
        }
    }
    // Escape wildcard characters
    key = key.replace("\\", "\\\\");
    key = key.replace("%", "\\%");
    key = key.replace("_", "\\_");

    // Add wildcards to allow non-exact searches
    return "%" + key + "%";
};

// Serve form
router.get("/", (req, res) => {
    res.sendFile("views/index.html", {root: process.env.root_path});
});

// Searching endpoint
router.get("/songs/search", async (req, res) => {
    let key;
    let search_query;

    // Attempt to parse the search key. Send appropriate response back if errors occur
    try {
        key = parseSearchKey(req.query);
    } catch (e) {
        if(e.name == "empty"){
            res.send({"results":["Empty search key"]});
            return;
        }
        if(e.name == "invalid"){
            res.status(422).send({"msg":"Invalid search key type. Key should be a String."});
            return;
        }
    };
    
    // Determine search mode. Switch-Case allows easy way to add more search modes
    switch(req.query?.mode){
        case "artist":
            search_query = db.artist_search;
            break;
        default:
            search_query = db.title_search;
    };

    const result = await db.queryPromise(search_query, key)
        .catch(e => {
            console.log(e);
            res.status(500).send({"msg":"An error occured with your search. Please try again later."})
        });
    res.send(result);
});


module.exports = router;
