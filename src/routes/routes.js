const express = require("express");
const router = express.Router();

// Serve form
router.get("/", (req, res) => {
    res.sendFile("views/index.html", {root: process.env.root_path});
});

module.exports = router;
