# Song API

A demo API to search the songs in the [Spotify Tracks DB](https://www.kaggle.com/zaheenhamidani/ultimate-spotify-tracks-db).

Built using Node + Express with an sqlite3 database. This technology stack was chosen due to the efficiency of setup and the ability to perform robust queries on the data. This was especially useful for dealing with records that were identical except for the `genre` field.

The .csv was converted to sqlite with [sqlite tools](https://www.sqlitetutorial.net/download-install-sqlite/) and the schema for the converted table can also be found in the db folder.

---
## Usage

To run the API locally, you will need the latest version of NodeJS. Clone the repo and open the directory in your terminal. From there, run the commands<sup>[1](#footnote1)</sup>:

    npm install
    npm start

This will start the server running at [localhost:3000](localhost:3000)

`localhost:3000/` will serve a basic html form that can be used to get api results.

Current endpoints and their url parameters are:

- `/songs/search` - Search the db for a song.
    - `key` : The string being searched for. 
    - `mode` : _(optional)_ The mode of search. Currently   supports values of `'title'` and `'artist'`
- `/songs/popularity` - Returns the most popular song(s).
    - `count` : _(optional)_ The number of songs to return. Defaults to 1.
- `/songs/duration/avg` - Returns the average duration of all songs in the db.

---

## Debugging

If you would like to use vscode's debugger, create a `launch.json` and add a configuration for `NodeJs: launch via npm`. Then set the runtime_arg after `run-script` to `dev`.

To run mocha unit tests, run the following in your terminal

    npm run test

---
<a name="footnote1">1</a>: If you are running a UNIX based system and `npm install` throws an error, in the package.json file, change the word `copy` to `cp` in the postinstall script's value.