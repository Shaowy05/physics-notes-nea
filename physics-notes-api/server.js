// In order to connect to the postgres database there are a few constants needed
// to connect. For security reasons, during development these are commonly stored as
// environment variables within a .env file rather than in the source code itself.
// This means that people reading the code cannot access the private information, and
// there is no way to access these confidential variables during deployment. In order
// to access these variables, I have used the 'dotenv' library that comes with Node.js.
// Here is a brief rundown of the contents of .env:
// 1. DB_USERNAME - The username used with the Postgres database.
// 2. DB_PASSWORD - The password used with the Postgres database.
// 3. DB_NAME - The name of the database.
// 4. API_PATH - This is the path of the root folder for the API, this value here is used
//               later on to store the images in the 'notes' folder.
// After importing the 'dotenv' library, we run the .config() method to connect the .env
// file.
import * as dotenv from 'dotenv';
dotenv.config()

// Here we import the 'express' library to be used as the framework for creating our
// RESTful API.
import express from 'express';

// Here we import 'cors'. Cors is a library containing the cors middleware component.
// Cors is needed to allow for our frontend and backend to communicate securely.
// A common vulnerability of websites is something called 'cross origin http requests', where
// an unknown sender requests data from an API. To prevent this, Express by default prevents
// requests from unknown origins, and using cors allows for my frontend on port 3001 communicate
// with port 3000.
import cors from 'cors';

// Knex is the technology discussed during the design phase as my selected library for
// connecting the Postgres database to my API. Here we import the library so we can use it.
import knex from 'knex';

// Here we import bcrypt, the library I have chosen to handle password hashing and login
// security.
import bcrypt from 'bcrypt-nodejs';

// Base64Img is a library designed to handle converting images into Base 64 URLs.
import base64Img from 'base64-img';

// We start the backend by initialising a connection to the database.
const db = knex({
    // Here we tell the knex app the type of database that we are using in the backend, here
    // it's 'pg' meaning Postgres
    client: 'pg',
    // The connection takes the form of a javascript object, in which we have the following
    // properties:
    // 1. Host - This is the IP of the device hosting the database, in this case it's just localhost
    //           hence 127.0.0.1.
    // 2. User - This is the Username associated with the database, stored in the .env file discussed
    //           earlier, so we access it using the dotenv library imported at the start.
    // 3. Password - The password that I set for the database, also stored in .env
    // 4. Database - The name of the database knex is attaching to, also stored in .env.
    connection: {
        // Hosting the connection on localhost
        host: '127.0.0.1',
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME     
    }
});

// Initialising the express app in a constant called app.
const app = express()

// Here we set up middleware, which can be thought of as certain settings for the Express app.
// The first one is 'cors', as discussed allows for HTTP origin validation. This is used not only for
// allowing for my React app to connect but also other applications like Postman, which I am using to
// test my API.
app.use(cors());

// The second is Express.json. This essentially allows Express to send and recieve data in the form
// of JSON files, which is the way I have chosen to send data back and forth. We can also set a limit
// to the amount of data that can come through in one go, which I have set to 5 Megabytes, higher than
// usual, as sending the images over as a base 64 URL requires more data.
app.use(express.json({ limit: '5mb' }));

// Lastly we enable Express.urlencoded. This allows us to send and receive the images as Base 64 URLs.
app.use(express.urlencoded({ limit: '5mb' }));

// Splitting the different requests by route:

// Route - /folders
// GET Requests

// This is the GET requests route for folders. This route will return all of the folders stored in the
// folders table in the database, needed in the main index page of the React app to retrieve the sections
// and topics.
app.get('/folders', (req, res) => {
    
    // SELECT * FROM folders
    db.select('*').from('folders')
        // Convert the data into JSON and send it as a response
        .then(data => res.json(data))
        // If there is an error, send a status 400 response with this message.
        .catch(err => res.status(400).json('Unable to retrieve data'))

});

// PUT Requests

// This is a route for updating a particular record in the folders table, specifically in order to update
// the has_notes field. This is used to change this property when a set of notes are added, or if a set
// of notes is deleted.
app.put('/folders/has-notes', (req, res) => {

    // Declare variables to be initialised in the try-catch;
    let folderId, hasNotes;

    // We encapsulate the destructuring inside a try catch, in case the user who sent the information
    // has sent it in the wrong format
    try {
        // First we destructure the body of the request to give us the ID of the folder and what value we want
        // to change the folder's has_notes property to.
        ({ folderId, hasNotes } = req.body);   
    }
    catch {
        res.status(400).json({ success: false, message: 'JSON format incorrect' });
        return null;
    }

    // UPDATE folders SET has_notes = (hasNotes) WHERE folder_id = (folderId)
    db('folders').where('folder_id', '=', folderId)
        .update({ 'has_notes': hasNotes })
        // After updating the folder, return the row.
        .returning('*')
        // Upon completion, send a response with the parent ID of the folder which was just updated. This
        // is explained in more detail in the React app later on but the TL;DR is that when a set of notes
        // is added, we want to update all of the folders above it so that the parent folders also have
        // a has_notes field of true. By returning the parent folder's ID we can recursively initiate PUT
        // requests to update all of the folders.
        .then(data => {
            // If the number of folders returned is not 0, then that means that there was a folder of that
            // folder ID and we can proceed to send the response. 
            if (data.length !== 0) {
                res.json({ parentFolderId: data[0].parent_folder_id, success: true });
            }
            // Otherwise there was no folder with that ID and we should let the user know.
            else {
                res.status(400).json(`No such folder with ID of ${folderId}`);
            }
        })
        // If there is an erro, send a status 400 with an error message.
        .catch(err => res.status(400).json('Error occurred while trying to update folders'));

})

// Route - /logins
// POST Requests

// There are no GET Requests for the logins table for security reasons mentioned in the design section. 
// GET requests cannot send over a body of JSON, meaning that security measures are harder to implement,
// so instead requests cannot send over a body of JSON, meaning that security measures are harder to 
// implement, so instead we make them perform a POST request, containing some validation information
// and then the API decides whether or not we should serve the user information back to them from the
// users table, not the logins table. It's important to note that we never, at any point, send over 
// information from the login table.
app.post('/logins', (req, res) => {

    // Destructuring the contents of the body of the request, i.e. the email and password.
    const { email, password } = req.body;

    // If either of the email or password is not a string, then we send an error and escape out of the
    // function.
    if (!(typeof email === 'string') || !(typeof password === 'string')) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // User login details are stored in two different tables in the database as said in the design. 
    // The users table stores regular users, students essentially, and teachers are stored in a seperate
    // table called teachers. In order to find out which one a user belongs to, we have to be able to
    // differentiate the two. Fortunately, there is an easy way of doing so. Student's at Ecclesbourne
    // school will always have 2 letters followed by a . and then @ecclesbourne.derbyhire.sch.uk, whereas
    // teachers don't have the 2 letters or the . before the email suffix. This allows us to use regex
    // to split the two. I have used Javascript's builtin regex string notation (with / around the regex
    // expression) to achieve this. This method of validation is good, as it also serves as an easy way
    // of stopping people not from Ecclesbourne from creating an account, as they will not have an 
    // ecclesbourne email.
    const reStudentEmail = /\w{2}\.\w+@ecclesbourne.derbyshire.sch.uk/;
    const reTeacherEmail = /\w+@ecclesbourne.derbyshire.sch.uk/;

    // Here we create an array, this is to store the names of the table containing the login details 
    // and the user details. All this does is allow me to write a single SQL query rather than two, 
    // saving some time and also increasing the scalability of my API, in the event that I have to 
    // another table there is less work that I have to do.
    const tableNames = [];

    // fieldName is just a variable, either user_id or teacher_id. This is used later to specify which
    // field to use when finding the record corresponding to the email passed in the request.
    let fieldName; 

    // Here we use the builtin .test method on the expressions we created earlier on to find out, what
    // table names and what field name to add to the variables that we created. Using a conditional 
    // if statement, we can change the behaviour of our SQL query. We convert the email to lower case
    // as that is what we have stored it as in the database, and it is also the way that the regex string
    // is designed to recognise emails.
    // If the email passed in matches the student's email format, then add 'logins' and 'users' to the
    // tableNames array.
    if (reStudentEmail.test(email.toLowerCase())) {
        tableNames.push('logins');
        tableNames.push('users');
        fieldName = 'user_id';
    }
    // If the email passed in matches the teacher's email format, then add 'teacher_logins' and 'teachers'
    // to the tableNames array.
    else if (reTeacherEmail.test(email.toLowerCase())){
        tableNames.push('teacher_logins');
        tableNames.push('teachers');
        fieldName = 'teacher_id';
    }
    // If the email matched neither, then it is an invalid email, so we send a response telling the
    // sender that their request was unsuccessful and that their email did not match a valid format
    // along with a question asking if their email was part of the Ecclesbourne school.
    else {
        res.json({ success: false, message: 'Email did not match valid format - Is it an Ecclesbourne email?' })
    }

    // SELECT * FROM (tableNames[0], i.e. either 'logins' or 'teacher_logins) WHERE email = (lowercase
    // version of email) 
    db.select('*').from(tableNames[0]).where('email', '=', email.toLowerCase())
        // Once the data has been fetched
        .then(data => {

            // If the number of records which matched the SQL condition is not 1, then there was no
            // email which matched the email passed in the body, and so we send a response telling the
            // user that the email was not recognised.
            if (data.length !== 1) {
                res.json({ success: false, message: 'Email was not recognised - Do you have an account?' });
            }

            // Otherwise, the email was recognised and we now need to compare the password entered to
            // the actual password. It is not secure to convert the original password to a hash and 
            // compare the hashes as plaintext, so instead we use the bcrypt library which we included
            // to compare the hashes using their secure comparison algorithm.
            else if (bcrypt.compareSync(password, data[0].hash)) {

                // If the hashes match, then we can return the user information corresponding to the
                // email passed in. For this we have to use the foreign key in the logins table to find
                // the relevant user in the users table. Here Object.values(data[0])[3] is getting the
                // integer which is the foreign key referencing the user_id field in the users table.
                // We use Object.values to grab the 3rd value of the data object passed in from the
                // select statement.
                // SELECT * FROM (tableNames[1], i.e either users or teachers) WHERE (fieldName) = 
                // (foreign key integer);
                return db.select('*').from(tableNames[1]).where(fieldName, '=', Object.values(data[0])[3])
                    // Once the user information has been fetched, send a response with the data in it.
                    .then(userObject => res.json(userObject[0]))
                    // If there was an error, then we send a status 400 with an error message.
                    .catch(err => res.status(400).json('Failure to get user from table'));
            }

            // If the hashes did not match then we send a failure message back to the sender, telling
            // them the password was wrong.
            else {
                res.json({ success: false, message: 'Email or Password Incorrect - Please Try Again.' })
                // Return null to escape out the function
                return null;
            }
        })
        // If knex could not make the query to the database then send an error message back to the sender.
        .catch(err => res.json('Failure to get items from database'));

});

// Route - /register
// POST Requests
app.post('/register', (req, res) => {

    // Here we destructure all of the information in the body into constants that we can use in the
    // code.
    const {
        email,
        password,
        first_name,
        last_name,
        intake
    } = req.body;

    // If the email is not in valid format then we need to reject the request
    if (!(typeof email === 'string')) {
        res.status(400).json({
            success: false,
            message: 'Invalid email format - Please ensure that it is a string'
        });
        return;
    }

    // If any of the variables passed in are undefined, then we want to respond with an error, we don't
    // have to test for the email, as that is tested earlier.
    if (
        [password, first_name, last_name, intake].some((variable) => {
            return typeof variable === 'undefined';
        })
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // Then we use regex, similarly to the logins route, to define which table the user should be added
    // to, or if the email is invalid, in which case it shouldn't be added to either.
    const reStudentEmail = /\w{2}\.\w+@ecclesbourne.derbyshire.sch.uk/;
    const reTeacherEmail = /\w+@ecclesbourne.derbyshire.sch.uk/;

    // Creating the hash from the password
    const hash = bcrypt.hashSync(password);

    // If the email passed in is a teacher email ...
    if (reStudentEmail.test(email)) {
        // Here we use a Knex transaction. This was not previously explained so I'll do so now. When
        // inserting into a table, it is important that the query to the database does not collide with
        // another request. This is highly unlikely with my website currently, as the number of users
        // is low, but for meeting the requirement of scalability, I have to ensure that my site can
        // handle a high amount of traffic. What a Knex transaction does is, instead of instantly adding
        // information, instead we create an instance of a insert statement called trx in my code...
        db.transaction(trx => {
            // Now we perform the SQL Insert statement as we usually would, but instead on the trx instance.
            // Here is the SQL equivalent of the trx instance:

            // INSERT INTO users VALUES (first_name, last_name, intake, false, true);

            trx.insert({
                // Here we add all of the values that was passed in the request body.
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
            // Here we tell the Knex trx instance to return the user ID of the new user we created. This
            // is because we need to use this ID to create the Foreign Key on the corresponding login
            // in the logins table.
            .returning('user_id')
            // After the user has been created, pass in the user ID
            .then(userObject => {
                // Use the trx instance to perform another SQL query in order to add the login details
                // to the logins table. The query below has this SQL equivalence:

                // INSERT INTO logins VALUES (email.toLowerCase(), hash, user_id);

                return trx('logins')
                    .returning('*')
                    .insert({
                        email: email.toLowerCase(),
                        hash: hash,
                        user_id: userObject[0].user_id
                    })
                    // Upon successfully adding the login to the logins table, we can now send a response
                    // to the user, indicating that they have successfully created an account in our
                    // database.
                    .then(res.json({ success: true }))
            })
            // The reason we use a trx instance instead of directly adding the new user is so we can
            // perform trx.commit and trx.rollback. What this does is, in the case of a collision, it
            // queues up the trx instance so that it can try again once the database is not busy, hence
            // preventing any errors during runtime, and also preventing any users from not actually
            // being added to the database.
            .then(trx.commit)
            .catch(trx.rollback);
        })
        // If there was an error at any point, the API sends a status 400 telling the sender that an
        // error occurred in the backend.
        .catch(err => res.status(400).json('Unable to register new user'));
    }
    // If the email passed in is a student's email we do essentially the same thing here. I won't annotate
    // the code, since the process is basically identical except for the data that is sent to the database
    // and the names of the tables and fields used.
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
    // If the email passed in does not satisfy the regular expression of both the students and the teachers
    // then the email is invalid, and we should send a response back telling the user that the email
    // format is wrong.
    else {
        res.json({success: false, message: 'Invalid Email Format'});
        // Return out of the function
        return null;
    }

});

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

    // First we get the ID using the parameters of the URL
    const { id } = req.params;

    // Then we use this ID to get the tag which is relevant to it

    // SELECT tags.tag_id, tag_name
    // FROM tags, folder_to_tag
    // WHERE tags.tag_id = folder_to_tag.tag_id
    // AND folder_to_tag.folder_id = folderId

    db('tags').select('tag_id', 'tag_name').whereIn('tag_id',
        db('folder_to_tag').select('tag_id').where('folder_id', '=', id) 
    )
    .then(data => res.json({
        success: true,
        message: data
    }))
    .catch(err => res.status(400).json({
        success: false,
        message: 'Error while trying to fetch the tags' 
    }));

});

// Route - /users
// GET Requests

// Route for getting a specific user
app.get('/users/:userId', (req, res) => {

    // Getting the user ID from the URL parameters
    const { userId } = req.params;

    // SELECT * FROM users WHERE user_id = (userId)

    db.select('*').from('users').where('user_id' ,'=', userId)
        .then(data => res.json({ success: true, user: data[0] }))
        .catch(err => res.status(400).json({ success: false, message: 'Failed to get user' }))

})

app.put('/users', (req, res) => {

    // Create variables
    const {
        userId,
        firstName,
        lastName,
        intake,
        isPrivate
    } = req.body;

    // Check to make sure that none of the variables are undefined
    if (
        [userId, firstName, lastName, intake, isPrivate].some(variable => typeof variable === 'undefined')
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        })
        return;
    }

    // UPDATE users SET (first_name, last_name, intake, can_post, private)
    // VALUES (firstName, lastName, intake, isPrivate) WHERE user_id = (userId)

    db('users').where('user_id', '=', userId)
        .update({ 
            first_name: firstName,
            last_name: lastName,
            intake: intake,
            private: isPrivate
        })
        .then(() => res.json({
            success: true
        }))
        .catch(err => res.status(400).json({
            success: false,
            message: 'Failure to update table' 
        }));

})

// Route - /tests
// GET Requests
// Route for getting all the tests using user ID
app.get('/tests/:userId', (req, res) => {

    // Getting the user ID from the URl
    const { userId } = req.params;

    // SELECT * FROM tests WHERE user_id = (userId)

    db.select('*').from('tests').where('user_id', '=', userId)
        .then(data => res.json({
            success: true,
            testObjects: data
        }))
        .catch(err => res.status(400).json({
            success: false,
            message: 'Failure to retrieve tests from the database' 
        }));

})

// POST Requests
// Route for adding a test to the database
app.post('/tests', (req, res) => {

    // Loading the information into variables
    const {
        userId,
        testName,
        testDate,
        attainedScore,
        maxScore
    } = req.body;

    // Performing checks to make sure that the information is valid. First we check to see if any of
    // the variables are undefined.
    if (
        [userId, testName, testDate, attainedScore, maxScore].some((variable) => typeof variable === 'undefined')
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // Then we check that the attained score is not higher than the max score
    if (attainedScore > maxScore) {
        res.status(400).json({
            success: false,
            message: 'Attained score higher than the max score'
        });
        return;
    }

    // If everything is fine, then we can initiate a transaction.
    db.transaction(trx => {

        // INSERT INTO tests VALUES (testName, userId, testDate, attainedScore, maxScore)
        // RETURNING *;

        trx.insert({
            test_name: testName,
            user_id: userId,
            test_date: testDate,
            attained_score: attainedScore,
            max_score: maxScore
        })
        .into('tests')
        // We return the information inputted so that the frontend can render in the information on
        // tests list, providing a better user experience as it is more responsive.
        .returning('*')
        // Sending the information to the frontend
        .then(testObject => {
            res.json({
                success: true,
                testObject: testObject
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json({
        success: false,
        message: 'Error while trying to add the test to the database' 
    }));

})

// Route - /folder-to-tag
// GET Requests
// Route for getting all the relations
app.get('/folder-to-tag', (req, res) => {

    // SELECT * FROM folder_to_tag;

    db.select('*').from('folder_to_tag')
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Unable to get relations'));

})

// Route - /notes
// GET Requests
// Route for getting a specific note using the note ID, does not send over the image URL
app.get('/notes/note-id=:noteId', (req, res) => {

    // Getting the note ID.
    const { noteId } = req.params;

    // SELECT * FROM notes WHERE note_id = (noteId);

    db.select('*').from('notes').where('note_id', '=', noteId)
        .then(note => res.json(note))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to get notes from database' }));

});

// Route for getting the image of the notes using the given ID.
app.get('/notes/image/:noteId', (req, res) => {
    
    // Setting the note ID to a variable
    const { noteId } = req.params;
    
    // SELECT note_path FROM notes WHERE note_id = (noteId);
    
    db.select('note_path').from('notes').where('note_id', '=', noteId)
        // With the data...
        .then(data => {
            // Convert to an image url...
            const imageUrl = base64Img.base64Sync(data[0].note_path);
            // And send to the user
            res.json({ success: true, imageUrl: imageUrl });
        })
        .catch(err => res.status(400).json({ success: false, message: 'Failed to get image for notes' }));

});

// Route for getting notes based off a parent folder, doesn't send over the image URL to save
// some time when sending data
app.get('/notes/folder-id=:folderId', (req, res) => {

    // Store the folder's ID in a variable
    const { folderId } = req.params;

    // SELECT * FROM notes WHERE folder_id = (folderId);

    db.select('*').from('notes').where('folder_id', '=', folderId)
        .then(data => res.json(data))
        .catch(err => res.status(400).json({ success: false, message: 'Error while trying to retrieve notes' }));

})

// DELETE Requests
// Route for deleting notes based off of their ID
app.delete('/notes/:noteId', (req, res) => {

    // Store the note's ID into a variable
    const { noteId } = req.params;

    // DELETE FROM notes WHERE note_id = (noteId);
    
    db('notes').where('note_id', '=', noteId)
        .del()
        .then(() => res.json({ success: true }))
        .catch(err => res.status(400).json({ success: false, message: err }));

})

// POST Requests
// Route for adding notes
app.post('/notes', (req, res) => {

    // For the file name of the image, we use the time in milliseconds to avoid any naming collisions
    // when the user sends over the image.
    const fileName = Date.now();

    // Loading the information into variables
    const {
        noteName,
        notes,
        authorId,
        folderId
    } = req.body;

    // If any of the information is undefined then we need to let the sender know that they did not
    // input the information correctly
    if (
        [noteName, notes, authorId, folderId].some(variable => typeof variable === 'undefined')
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // Convert the base 64 Image URL to a jpg file so that it can be accessed like a normal image in
    // the backend. Briefly discussed in the design phase, having the images stored as regular jpg files
    // in a hosting service (just the notes folder in this case) makes monitoring the content going
    // in and out a lot easier.
    base64Img.imgSync(notes, './notes/', fileName);

    // Initiate a Knex transaction
    db.transaction(trx => {

        // INSERT INTO notes VALUES (path to notes, noteName, authorId, folderId);

        trx.insert({
            // Here we use the path that we stored in the .env file earlier, and the filename that we
            // instantiated earlier, and then we use string concatenation to create a path to the notes
            // with which we can use to store the image of the notes in.
            note_path: `${process.env.API_PATH}/notes/${fileName}.jpg`,
            note_name: noteName,
            author_id: authorId,
            folder_id: folderId
        })
        .into('notes')
        .then(trx.commit)
        .then(() => res.json({ success: true }))
        .catch(trx.rollback);
    })
    .catch(err => res.status(400).json({ success: false }));

})

// Route - /questions
// GET Requests
// Route for getting questions using the parent note ID
app.get('/questions/note-id=:noteId', (req, res) => {

    // Store the note ID in a variable
    const { noteId } = req.params;

    // SELECT * FROM questions WHERE note_id = (noteId);

    db.select('*').from('questions').where('note_id', '=', noteId)
        .then(data => res.json({ success: true, questions: data }))
        .catch(err => res.status(400).json({ success: false, message: err }));

});

// POST Requests
// Route for posting questions to the database
app.post('/questions', (req, res) => {

    // Here we get the currentDate as a Date object. This is so we can store the date the question was
    // posted in the database.
    const currentDate = new Date();
    // We only need the date not the time, so we use the toISOString method to convert the date into
    // standard format, recommended for Postgres, and then we use .split on the character T, which is
    // always between the date and the time for an ISO date, and then we take the first item in the
    // array created by the split function.
    const isoDate = `${currentDate.toISOString().split('T')[0]}`;

    // Storing the question details in variables
    const {
        questionTitle,
        questionText,
        authorId,
        noteId,
    } = req.body;

    // If any of the information is undefined then we need to let the sender know that they did not
    // input the information correctly
    if (
        [questionTitle, questionText, authorId, noteId].some(variable => typeof variable === 'undefined')
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // Initiate a Knex transaction
    db.transaction(trx => {

        // INSERT INTO questions VALUES (questionTitle, questionText, authorId, noteId, isoDate);

        trx.insert({
            question_title: questionTitle,
            question_text: questionText,
            author_id: authorId,
            note_id: noteId,
            upload_date: isoDate
        })
        .into('questions')
        .then(trx.commit)
        .then(res.json({ success: true }))
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json({
        success: false,
        message: 'Failed to add question to database'
    }))

})

// Route - /responses
// GET Requests
// Route for getting responses using the parent question ID
app.get('/responses/question-id=:questionId', (req, res) => {

    // Putting the questionId into a variable
    const { questionId } = req.params;

    // SELECT * FROM responses WHERE question_id = (questionId);

    db.select('*').from('responses').where('question_id', '=', questionId)
        .then(data => res.json({ success: true, responses: data }))
        .catch(err => res.status(400).json({ success: false, message: err }));

});

// POST Requests
// Route for adding a response to the database
app.post('/responses', (req, res) => {

    // Storing the response information in variables
    const {
        responseText,
        authorId,
        questionId,
    } = req.body;

    // If any of the information is undefined then we need to let the sender know that they did not
    // input the information correctly
    if (
        [responseText, authorId, questionId].some(variable => typeof variable === 'undefined')
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // Initiate Knex transaction
    db.transaction(trx => {

        // INSERT INTO responses VALUES (responseText, authorId, questionId, false, 0, 0);

        trx.insert({
            response_text: responseText,
            author_id: authorId,
            question_id: questionId,
            is_solution: false,
            upvotes: 0,
            downvotes: 0
        })
        .into('responses')
        .then(trx.commit)
        .then(res.json({ success: true }))
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json({ success: false, message: err }))

})

// PUT Requests
// Route for incrementing or decrementing the upvotes/downvotes value
app.put('/responses/vote', (req, res) => {

    // Storing the information in variables. Here, field signifies whether or not the field that should
    // be updated is the upvotes field or the downvotes field. Action will be one of 'increment' or
    // 'decrement', signalling whether or not we should increase the number of upvotes/downvotes or
    // decrease it.
    const { responseId, field, action } = req.body;

    // If any of the information is undefined then we need to let the sender know that they did not
    // input the information correctly
    if (
        [responseId, field, action].some(variable => typeof variable === 'undefined')
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // Here we use conditional logic to pick the SQL query. First we check for the action data. If the
    // user wants to increment...
    if (action === 'increment') {
        // Then we access the responses table, and increment the field that was passed in by one.

        // UPDATE responses INCREMENT (field) BY 1;

        db('responses').where('response_id', '=', responseId)
            .increment(field, 1)
            .then(res.json({ success: true }))
            .catch(err => res.status(400).json({ 
                success: false,
                message: err
             }));
    }

    // Otherwise, if the action was decrement then we want to decrease the field passed in by one.
    else if (action === 'decrement') {
        
        // UPDATE responses DECREMENT (field) BY 1;

        db('responses').where('response_id', '=', responseId)
            .decrement(field, 1)
            .then(res.json({ success: true }))
            .catch(err => res.status(400).json({ 
                success: false,
                message: err
             }));
    }

    else {
        res.status(400).json({ success: false, message: 'Invalid action parameter' });
    }

})

// Route for updating whether or not a response is a solution
app.put('/responses/is-solution', (req, res) => {

    // Store information in variables
    const { responseId, isSolution } = req.body;

    // If any of the information is undefined then we need to let the sender know that they did not
    // input the information correctly
    if (
        [responseId, isSolution].some(variable => typeof variable === 'undefined')
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // UPDATE responses SET (is_solution) VALUES (isSolution) WHERE response_id = (responseId);

    db('responses').where('response_id', '=', responseId)
        .update({ 'is_solution': isSolution })
        .then(res.json({
            success: true,
        }))
        .catch(err => res.status(400).json({
            success: false,
            message: err
        }));

})

// Route - /votes
// GET Requests
// Route for getting the IDs of responses that the user has voted on
app.get('/votes/:userId', (req, res) => {

    // Storing the user ID in a variable
    const { userId } = req.params;

    // Checking to make sure the user's ID is a number 
    if (typeof userId === 'number') {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format - Please make sure the ID is an integer'
        });
    }

    // Since we are getting both the upvotes and the downvotes for the user, we have to make two asynchronous
    // calls to the database, which means that we need to make sure that the API doesn't send back information
    // before all of the data has been retrieved from the database. For this, we need to store the result
    // of both requests in an instance of a Promise, called upvoteIds and downvoteIds here, and then
    // use the Promise.all function to execute the next bit of data after both are done.
    
    // SELECT response_id FROM upvotes WHERE user_id = (userId);

    const upvoteIds = db.select('response_id').from('upvotes')
        .where('user_id', '=', userId)
        .catch(err => console.log(err));

    // SELECT response_id FROM downvotes WHERE user_id = (userId);

    const downvoteIds = db.select('response_id').from('downvotes')
        .where('user_id', '=', userId)
        .catch(err => console.log(err));

    // Once both the upvotes and the downvotes have been fetched, we can now work on sending a response
    // back to the user. We call Promise.all, passing in an array of the result of upvoteIds and downvoteIds
    // so that we can access them in the Promise chain.
    Promise.all([upvoteIds, downvoteIds])
        .then(votes => {
            // Storing the results in variables
            const [upvoteIds, downvoteIds] = votes;
            // Sending the result back
            res.json({
                success: true,
                upvoteIds: upvoteIds,
                downvoteIds: downvoteIds
            });
        })
        .catch(err => res.status(400).json({
            success: false,
            message: err
        }));

}) 

// POST Requests
// Route for adding a vote to either upvotes or downvotes
app.post('/votes', (req, res) => {

    // Storing the information in variables, we need table here to make sure we access the correct link
    // table.
    const { userId, responseId, table } = req.body;

    // If any of the information is undefined then we need to let the sender know that they did not
    // input the information correctly
    if (
        [responseId, userId, table].some(variable => typeof variable === 'undefined')
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // Initiating a Knex transaction
    db.transaction(trx => {
        // We're allowed to statically define the field names here because they are the same for the 
        // upvotes table and the downvotes table.

        // INSET INTO table VALUES (user_id, response_id);

        trx.insert({
            user_id: userId,
            response_id: responseId
        })
        .into(table)
        .then(trx.commit)
        .then(res.json({ success: true }))
        .catch(trx.rollback);
    })
    .catch(err => res.json({
        success: false,
        message: 'Error while trying to add vote' 
    }));

})

// DELETE Requests
// Route for deleting an entry from either upvotes/downvotes
app.delete('/votes', (req, res) => {

    // Storing the information in variables
    const { userId, responseId, table } = req.body;

    // If any of the information is undefined then we need to let the sender know that they did not
    // input the information correctly
    if (
        [responseId, userId, table].some(variable => typeof variable === 'undefined')
    ) {
        res.status(400).json({
            success: false,
            message: 'Incorrect JSON format'
        });
        return;
    }

    // We want to delete the relation with the correct user ID and response ID, so we need multiple
    // conditions inside the SQL query

    // DELETE FROM table WHERE user_id = (userId) AND response_id = (responseId);

    db(table).where('user_id', '=', userId)
        .where('response_id', '=', responseId)
        .del()
        .then(res.json({ success: true }))
        .catch(err => res.status(400).json({
            success: false,
            message: err
        }));

})

// Finally telling the app to listen on port 3000
app.listen(3000, () => {
    console.log('App is listening on port 3000');
});