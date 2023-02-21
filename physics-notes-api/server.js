// Importing dotenv to use environment variables
import * as dotenv from 'dotenv';
dotenv.config()

// Importing Express to use as our server framework
import express, { response } from 'express';

// Importing Cors to allow for Postman
import cors from 'cors';

// Importing database related libraries and setting
// up the database connection
import knex from 'knex';

// Importing bcrypt to allow for hashing
import bcrypt from 'bcrypt-nodejs';

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

    const { email, password } = req.body;

    const reStudentEmail = /\w{2}\.\w+@ecclesbourne.derbyshire.sch.uk/;
    const reTeacherEmail = /\w+@ecclesbourne.derbyshire.sch.uk/;

    const tableNames = [];
    let fieldName; 

    if (reStudentEmail.test(email.toLowerCase())) {
        tableNames.push('logins');
        tableNames.push('users');
        fieldName = 'user_id';
    }
    else if (reTeacherEmail.test(email.toLowerCase())){
        tableNames.push('teacher_logins');
        tableNames.push('teachers');
        fieldName = 'teacher_id';
    }
    else {
        res.json({ success: false, message: 'Email did not match valid format - Is it an Ecclesbourne email?' })
    }

    db.select('*').from(tableNames[0]).where('email', '=', email)
        .then(data => {

            if (data.length !== 1) {
                res.json({ success: false, message: 'Email was not recognised - Do you have an account?' });
            }

            if (bcrypt.compareSync(password, data[0].hash)) {
                return db.select('*').from(tableNames[1]).where(fieldName, '=', Object.values(data[0])[3])
                    .then(userObject => res.json(userObject[0]))
                    .catch(err => res.status(400).json('Failure to get user from table'));
            }
            else {
                res.json({ success: false, message: 'Email or Password Incorrect - Please Try Again.' })
            }
        })
        .catch(err => res.json('Failure to get items from database'));

})

// Route - /register
// POST Requests
app.post('/register', (req, res) => {

    const {
        email,
        password,
        first_name,
        last_name,
        intake
    } = req.body;

    // Using Regex to perform email validation on the email passed in.
    // Here we define two valid strings, one for the teachers email, and
    // one for the students email.
    const reStudentEmail = /\w{2}\.\w+@ecclesbourne.derbyshire.sch.uk/;
    const reTeacherEmail = /\w+@ecclesbourne.derbyshire.sch.uk/;

    // Creating the hash from the password
    const hash = bcrypt.hashSync(password);

    // If the email passed in is a teacher email
    if (reStudentEmail.test(email)) {
        db.transaction(trx => {
            trx.insert({
                first_name: first_name,
                last_name: last_name,
                intake: intake,
                // By default cannot post
                can_post: false,
                // By default has a private
                // account
                private: true,
            })
            .into('users')
            .returning('user_id')
            .then(userObject => {
                console.log(userObject)
                return trx('logins')
                    .returning('*')
                    .insert({
                        email: email.toLowerCase(),
                        hash: hash,
                        user_id: userObject[0].user_id
                    })
                    .then(res.json({ success: true }))
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .catch(err => res.status(400).json('Unable to register new user'));
    }
    // If the email passed in is a student's email
    else if (reTeacherEmail.test(email.toLowerCase())) {
        db.transaction(trx => {
            trx.insert({
                // By default set teacher code to N/A, this can be updated
                // manually later on.
                teacher_code: 'N/A',
                first_name: first_name,
                last_name: last_name,
                // By default has a private
                // account
                private: true,
                // And by default is part of the physics department
                department: "Physics"
            })
            .into('teachers')
            .returning('teacher_id')
            .then(teacherIdObject => {
                return trx('teacher_logins')
                    .returning('*')
                    .insert({
                        email: email.toLowerCase(),
                        hash: hash,
                        teacher_id: teacherIdObject[0].teacher_id
                    })
                    .then(res.json({ success: true }))
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .catch(err => res.status(400).json('Unable to register new user'));
    }
    // Else the email is invalid, then we send an error code
    else {
        res.json({success: false, message: 'Invalid Email Format'});
        // Return out of the function
        return null;
    }

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

// Route for getting the tags based off of a folders ID
app.get('/tags/:id', (req, res) => {

    const { folderId } = req.params;

    // SELECT tags.tag_id, tag_name
    // FROM tags, folder_to_tag
    // WHERE tags.tag_id = folder_to_tag.tag_id
    // AND folder_to_tag.folder_id = folderId
    db.select('tags.tag_id', 'tag_name')
        .from('tags', 'folder_to_tag')
        .where('tags.tag_id', '=', 'folder_to_tag.tag_id')
        .and('folder_to_tag.folder_id', '=', folderId)
        .then(data => res.json(data))
        .catch(console.log);

})

// Route - /folder-to-tag
// GET Requests

// Route for getting all the relations
app.get('/folder-to-tag', (req, res) => {

    db.select('*').from('folder_to_tag')
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Unable to get relations'));

})

// Finally telling the app to listen on port 3000
app.listen(3000, () => {
    console.log('App is listening on port 3000');
});