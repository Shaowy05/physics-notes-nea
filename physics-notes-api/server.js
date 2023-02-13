// Importing dotenv to use environment variables
import * as dotenv from 'dotenv';
dotenv.config()

// Importing Express to use as our server framework
import express from 'express';

// Importing Cors to allow for Postman
import cors from 'cors';

// Importing database related libraries and setting
// up the database connection
import knex from 'knex';

const db = knex({
    // Using Postgres
    client: 'pg',
    connection: {
        // Hosting the connection on localhost
        host: '127.0.0.1',
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME     
    }
});

// Creating the express app
const app = express()

// Setting up middleware
app.use(cors());
app.use(express.json());

// Splitting the different requests by route:

// Route - /folders
// GET Requests
app.get('/folders', (req, res) => {
    
    // SELECT * FROM tableName
    db.select('*').from('folders')
        // Returns a Promise, after receiving info...
        .then(data => res.json(data))
        // Return an error message if unable to send response
        .catch(err => res.status(400).json('Unable to retrieve data'))

});

// Route - /logins
// POST Requests
app.post('/logins', (req, res) => {

    const { folderId } = req.body;

    // SELECT tag_id, tag_name
    // FROM folders, tags, folder_to_tag
    // WHERE folders.folder_id = folderId
    // AND tags.tag_id = folder_to_tag.tag_id
    // AND folders.folder_id = folder_to_tag.folder_id
    db.select('tag_id', 'tag_name').from('folders', 'tags', 'folder_to_tag')
        .where('folders.folder_id', '=', folderId)
        .and('tags.tag_id', '=', 'folder_to_tag.tag_id')
        .and('folder.folder_id', '=', 'folder_to_tag.folder_id')
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err));

})

// Route - /tags
// GET Requests

// Route for getting all the tags regardless of the folder
app.get('/tags', (req, res) => {

    // SELECT * FROM tags
    db.select('*').from('tags')
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Unable to get tags'));

});

// Finally telling the app to listen on port 3000
app.listen(3000, () => {
    console.log('App is listening on port 3000');
});