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

// Importing base64-img to handle storing the images in the database
import base64Img from 'base64-img';

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
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb' }));

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

// PUT Requests
// Route for updating whether or not the folder has notes
app.put('/folders/has-notes', (req, res) => {

    const { folderId, hasNotes } = req.body;   

    db('folders').where('folder_id', '=', folderId)
        .update({ 'has_notes': hasNotes })
        .returning('*')
        .then(data => res.json({ parentFolderId: data[0].parent_folder_id, success: true }))
        .catch(err => res.status(400).json('Error occurred while trying to update folders'));

})

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

    console.log(tableNames, fieldName);

    db.select('*').from(tableNames[0]).where('email', '=', email.toLowerCase())
        .then(data => {

            if (data.length !== 1) {
                res.json({ success: false, message: 'Email was not recognised - Do you have an account?' });
                return null;
            }

            if (bcrypt.compareSync(password, data[0].hash)) {
                return db.select('*').from(tableNames[1]).where(fieldName, '=', Object.values(data[0])[3])
                    .then(userObject => res.json(userObject[0]))
                    .catch(err => res.status(400).json('Failure to get user from table'));
            }
            else {
                res.json({ success: false, message: 'Email or Password Incorrect - Please Try Again.' })
                return null;
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

// Route - /users
// GET Requests

// Route for getting a specific user
app.get('/users/:userId', (req, res) => {

    const { userId } = req.params;

    db.select('*').from('users').where('user_id' ,'=', userId)
        .then(data => res.json({ success: true, user: data[0] }))
        .catch(err => res.status(400).json({ success: false, message: 'Failed to get user' }))

})

// PUT Requests

// Route for incrementing the number of posts the user has
app.put('/users/num-of-posts', (req, res) => {

    const { userId } = req.body;

    db('users').where('user_id', '=', userId)
        .increment('num_of_posts', 1)
        .returning('num_of_posts')
        .then(numOfPosts => res.json({
            numOfPosts: numOfPosts[0].num_of_posts,
            success: true
        }))
        .catch(err => res.status(400).json({ success: false }));

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
    const { responseId, field, option } = req.params

    if (option === 'increment') {
        db('responses').where('response_id', '=', responseId)
            .increment(field, 1)
            .then(res.json({ success: true }))
            .catch(err => res.status(400).json({ 
                success: false,
                message: err
             }))
    }

    else if (option === 'decrement') {
        db('responses').where('response_id', '=', responseId)
            .decrement(field, 1)
            .then(res.json({ success: true }))
            .catch(err => res.status(400).json({ 
                success: false,
                message: err
             }))
    }

    else {
        res.status(400).json({ success: false, message: 'Invalid option parameter' });
    }

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

// Finally telling the app to listen on port 3000
app.listen(3000, () => {
    console.log('App is listening on port 3000');
});