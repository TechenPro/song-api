const sqlite = require("sqlite3");
const path = require("path");

/**
 * Open in database in readonly to prevent malicious operations
 * Would need changed if new endpoints to edit data were required
 */
const db_path = path.join(__dirname, "../db/SpotifyFeatures.db");
const db = new sqlite.Database(db_path, sqlite.OPEN_READONLY);

// Prepare query statements
// TODO: Implement pagination for search results
const title_search = db.prepare(`
    SELECT track_name AS title, artist_name AS artist, 
    GROUP_CONCAT(genre, ', ') AS genres, popularity
    FROM songs
    WHERE track_name LIKE ? ESCAPE '@'
    GROUP BY track_id
    LIMIT 500;
`);
const artist_search = db.prepare(`
    SELECT track_name AS title, artist_name AS artist, 
    GROUP_CONCAT(genre, ', ') AS genres, popularity
    FROM songs
    WHERE artist_name LIKE ? ESCAPE '@'
    GROUP BY track_id
    LIMIT 500;
`);
const popular_songs = db.prepare(`
    SELECT track_name AS title, artist_name AS artist,
    GROUP_CONCAT(genre, ', ') AS genres, popularity
    FROM songs
    GROUP BY track_id
    ORDER BY popularity DESC
    LIMIT ?;
`);
const avg_duration = db.prepare(`
    SELECT AVG(T.duration_ms) AS duration
    FROM
        (SELECT DISTINCT track_id, duration_ms
        FROM songs)
    AS T;
`);

/**
 * Wrap statement executions in a promise to provide async functionality and easy exception handling
 */
function queryPromise(statement, params){
    return new Promise((resolve, reject) => {
        statement.all(params, (err, rows) => {
            if (err) reject(err);
            resolve(rows); 
        });
    });
};

function closeDb(){
    console.log("closing database connection...");
    db.close();
}

module.exports = {
    queryPromise,
    title_search,
    artist_search,
    popular_songs,
    avg_duration,
    closeDb
};
