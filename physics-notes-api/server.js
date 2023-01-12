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

// Route - /topicdirectory
// GET Requests
app.get('/topicdirectory/:tablename', (req, res) => {
    
    // Destructuring the request parameters
    const { tablename } = req.params;
    console.log({tablename});

    // SELECT * FROM tableName
    db.select('*').from({tablename})
        // Returns a Promise, after receiving info...
        .then(data => res.json(data))
        // Return an error message if unable to send response
        .catch(err => res.status(400).json('Unable to retrieve data'))

})


// Finally telling the app to listen on port 3000
app.listen(3000, () => {
    console.log('App is listening on port 3000');
})