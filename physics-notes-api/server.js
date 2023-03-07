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

    // First we destructure the body of the request to give us the ID of the folder and what value we want
    // to change the folder's has_notes property to.
    const { folderId, hasNotes } = req.body;   

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
        .then(data => res.json({ parentFolderId: data[0].parent_folder_id, success: true }))
        // If there is an erro, send a status 400 with an error message.
        .catch(err => res.status(400).json('Error occurred while trying to update folders'));

})

// Route - /logins
// POST Requests

// There are no GET Requests for the logins table for security reasons mentioned in the design section. GET
// requests cannot send over a body of JSON, meaning that security measures are harder to implement, so instead
// we make them perform a POST request, containing some validation information and then the API decides whether
// or not we should serve the user information back to them from the users table, not the logins table. It's
// important to note that we never, at any point, send over information from the login table.
app.post('/logins', (req, res) => {

    // Destructuring the contents of the body of the request, i.e. the email and password.
    const { email, password } = req.body;

    // User login details are stored in two different tables in the database as said in the design. The users table
    // stores regular users, students essentially, and teachers are stored in a seperate table called teachers. In
    // order to find out which one a user belongs to, we have to be able to differentiate the two. Fortunately, there
    // is an easy way of doing so. Student's at Ecclesbourne school will always have 2 letters followed by a . and
    // then @ecclesbourne.derbyhire.sch.uk, whereas teachers don't have the 2 letters or the . before the email suffix.
    // This allows us to use regex to split the two. I have used Javascript's builtin regex string notation (with / around
    // the regex expression) to achieve this. This method of validation is good, as it also serves as an easy way
    // of stopping people not from Ecclesbourne from creating an account, as they will not have an ecclesbourne email.
    const reStudentEmail = /\w{2}\.\w+@ecclesbourne.derbyshire.sch.uk/;
    const reTeacherEmail = /\w+@ecclesbourne.derbyshire.sch.uk/;

    // Here we create an array, this is to store the names of the table containing the login details and the user
    // details. All this does is allow me to write a single SQL query rather than two, saving some time and also
    // increasing the scalability of my API, in the event that I have to another table there is less work that I have
    // to do.
    const tableNames = [];

    // fieldName is just a variable, either user_id or teacher_id. This is used later to specify which field to use when
    // finding the record corresponding to the email passed in the request.
    let fieldName; 

    // Here we use the builtin .test method on the expressions we created earlier on to find out, what table names and
    // what field name to add to the variables that we created. Using a conditional if statement, we can change the
    // behaviour of our SQL query.
    // If the email passed in matches the student's email format, then add 'logins' and 'users' to the tableNames array.
    if (reStudentEmail.test(email.toLowerCase())) {
        tableNames.push('logins');
        tableNames.push('users');
        fieldName = 'user_id';
    }
    // If the email passed in matches the teacher's email format, then add 'teacher_logins' and 'teachers' to the tableNames
    // array.
    else if (reTeacherEmail.test(email.toLowerCase())){
        tableNames.push('teacher_logins');
        tableNames.push('teachers');
        fieldName = 'teacher_id';
    }
    // If the email matched neither, then it is an invalid email, so we send a response telling the sender that their
    // request was unsuccessful and that their email did not match a valid format along with a question asking if their
    // email was part of the Ecclesbourne school.
    else {
        res.json({ success: false, message: 'Email did not match valid format - Is it an Ecclesbourne email?' })
    }

    // SELECT * FROM (tableNames[0], i.e. either 'logins' or 'teacher_logins) WHERE email = (lowercase version of email) 
    db.select('*').from(tableNames[0]).where('email', '=', email.toLowerCase())
        // Once the data has been fetched
        .then(data => {

            // If the number of records which matched the SQL condition is not 1, then there was no email which matched
            // the email passed in the body, and so we send a response telling the user that the email was not recognised.
            if (data.length !== 1) {
                res.json({ success: false, message: 'Email was not recognised - Do you have an account?' });
                // Then we return null to escape out of the function.
                return null;
            }

            // Otherwise, the email was recognised and we now need to compare the password entered to the actual password.
            // It is not secure to convert the original password to a hash and compare the hashes as plaintext, so instead
            // we use the bcrypt library which we included to compare the hashes using their secure comparison algorithm.
            if (bcrypt.compareSync(password, data[0].hash)) {

                // If the hashes match, then we can return the user information corresponding to the email passed in. For this
                // we have to use the foreign key in the logins table to find the relevant user in the users table. Here
                // Object.values(data[0])[3] is getting the integer which is the foreign key referencing the user_id field in
                // the users table. We use Object.values to grab the 3rd value of the data object passed in from the select
                // statement.
                // SELECT * FROM (tableNames[1], i.e either users or teachers) WHERE (fieldName) = (foreign key integer)
                return db.select('*').from(tableNames[1]).where(fieldName, '=', Object.values(data[0])[3])
                    // Once the user information has been fetched, send a response with the data in it.
                    .then(userObject => res.json(userObject[0]))
                    // If there was an error, then we send a status 400 with an error message.
                    .catch(err => res.status(400).json('Failure to get user from table'));
            }

            // If the hashes did not match then we send a failure message back to the sender, telling them the password was
            // wrong.
            else {
                res.json({ success: false, message: 'Email or Password Incorrect - Please Try Again.' })
                // Return null to escape out the function
                return null;
            }
        })
        // If knex could not make the query to the database then send an error message back to the sender.
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
        .where('folder_to_tag.folder_id', '=', folderId)
        .then(data => res.json(data))
        .catch(console.log);

})

// Route - /users
// GET Requests

// Route for getting a specific user
app.get('/users/:userId', (req, res) => {

    const { userId } = req.params;

    db.select('*').from('users').where('user_id' ,'=', userId)
        .then(data => res.json({ success: true, user: data[0] }))
        .catch(err => res.status(400).json({ success: false, message: 'Failed to get user' }))

})

app.put('/users', (req, res) => {

    const {
        userId,
        firstName,
        lastName,
        intake,
        isPrivate
    } = req.body;

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
            message: err
        }));

})

// Route - /tests
// GET Requests
// Route for getting all the tests using user ID
app.get('/tests/:userId', (req, res) => {

    const { userId } = req.params;

    db.select('*').from('tests').where('user_id', '=', userId)
        .then(data => res.json({
            success: true,
            testObjects: data
        }))
        .catch(err => res.status(400).json({
            success: false,
            message: err
        }));

})

// POST Requests
// Route for adding a test to the database
app.post('/tests', (req, res) => {

    const {
        userId,
        testName,
        testDate,
        attainedScore,
        maxScore
    } = req.body;

    db.transaction(trx => {
        trx.insert({
            test_name: testName,
            user_id: userId,
            test_date: testDate,
            attained_score: attainedScore,
            max_score: maxScore
        })
        .into('tests')
        .returning('*')
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
        message: err
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

    const { noteId } = req.params;

    db.select('*').from('notes').where('note_id', '=', noteId)
        .then(note => res.json(note))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to get notes from database' }));

})

// Route for getting the image of the notes using the given ID.
app.get('/notes/image/:noteId', (req, res) => {
    const { noteId } = req.params;
    
    db.select('note_path').from('notes').where('note_id', '=', noteId)
        .then(data => {
            const imageUrl = base64Img.base64Sync(data[0].note_path);
            res.json({ success: true, imageUrl: imageUrl });
        })
        .catch(err => res.status(400).json({ success: false, message: 'Failed to get image for notes' }));

})

// Route for getting notes based off a parent folder, doesn't send over the image URL to save
// some time when sending data
app.get('/notes/folder-id=:folderId', (req, res) => {

    const { folderId } = req.params;

    db.select('*').from('notes').where('folder_id', '=', folderId)
        .then(data => res.json(data))
        .catch(err => res.status(400).json({ success: false, message: 'Error while trying to retrieve notes' }));

})

// DELETE Requests
// Route for deleting notes based off of their ID
app.delete('/notes/:noteId', (req, res) => {

    const { noteId } = req.params;

    db('notes').where('note_id', '=', noteId)
        .del()
        .then(() => res.json({ success: true }))
        .catch(err => res.status(400).json({ success: false, message: err }));

})

// POST Requests
// Route for adding notes
app.post('/notes', (req, res) => {

    const fileName = Date.now();

    const {
        noteName,
        notes,
        authorId,
        folderId
    } = req.body;

    base64Img.imgSync(notes, './notes/', fileName);

    db.transaction(trx => {
        trx.insert({
            note_path: `${process.env.API_PATH}/notes/${fileName}.jpg`,
            note_name: noteName,
            author_id: authorId,
            folder_id: folderId
        })
        .into('notes')
        .then(trx.commit)
        .then(res.json({ success: true }))
        .catch(trx.rollback);
    })
    .catch(err => res.status(400).json({ success: false }));

})

// Route - /questions
// GET Requests
// Route for getting questions using the parent note ID
app.get('/questions/note-id=:noteId', (req, res) => {

    const { noteId } = req.params;

    db.select('*').from('questions').where('note_id', '=', noteId)
        .then(data => res.json({ success: true, questions: data }))
        .catch(err => res.status(400).json({ success: false, message: err }));

});

// POST Requests
// Route for posting questions to the database
app.post('/questions', (req, res) => {

    const currentDate = new Date();
    const isoDate = `${currentDate.toISOString().split('T')[0]}`;

    const {
        questionTitle,
        questionText,
        authorId,
        noteId,
    } = req.body;

    db.transaction(trx => {
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

    const { questionId } = req.params;

    db.select('*').from('responses').where('question_id', '=', questionId)
        .then(data => res.json({ success: true, responses: data }))
        .catch(err => res.status(400).json({ success: false, message: err }));

});

// POST Requests
// Route for adding a response to the database
app.post('/responses', (req, res) => {

    const {
        responseText,
        authorId,
        questionId,
    } = req.body;

    db.transaction(trx => {
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
    const { responseId, field, action } = req.body;

    if (action === 'increment') {
        db('responses').where('response_id', '=', responseId)
            .increment(field, 1)
            .then(res.json({ success: true }))
            .catch(err => res.status(400).json({ 
                success: false,
                message: err
             }));
    }

    else if (action === 'decrement') {
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

    const { responseId, isSolution } = req.body;

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

    const { userId } = req.params;

    const upvoteIds = db.select('response_id').from('upvotes')
        .where('user_id', '=', userId)
        .catch(err => console.log(err));

    const downvoteIds = db.select('response_id').from('downvotes')
        .where('user_id', '=', userId)
        .catch(err => console.log(err));

    Promise.all([upvoteIds, downvoteIds])
        .then(votes => {
            const [upvoteIds, downvoteIds] = votes;
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

    const { userId, responseId, table } = req.body;

    db.transaction(trx => {
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
        message: err
    }));

})

// DELETE Requests
// Route for deleting an entry from either upvotes/downvotes
app.delete('/votes', (req, res) => {

    const { userId, responseId, table } = req.body;

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