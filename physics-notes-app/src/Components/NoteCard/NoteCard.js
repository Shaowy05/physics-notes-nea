import React from 'react';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import User from '../../Logic/User';
import ForumCard from '../ForumCard/ForumCard';

import './NoteCard.css';

// Inheriting from React.Component.
export default class NoteCard extends React.Component {
    
    constructor(props) {
        super(props);

        // In the state we are storing the URL of the image, the instance of the User class that posted
        // the notes, a boolean describing whether or not the Forum should be shown and finally a state
        // for alerting the user if they couldn't delete the notes in the database.
        this.state = {
            imageUrl: null,
            author: null,

            showForum: false,

            failedToDeleteNotes: false
        }

    }

    // Once the component is mounted, we want to load the image from the API.
    componentDidMount() {
        // First we get the instance of the Note class from the props.
        const { note } = this.props;
        // Then we get the URL of the image and store it in getImage. To do this, we initiate a GET
        // request to the notes/image endpoint.
        const getImage = fetch(`http://localhost:3000/notes/image/${note.id}`)
            // Then we turn the response into a Javascript object.
            .then(response => response.json())
            // With the newly created object...
            .then(data => {

                // If the API responds with a success status of false, we throw a new error and tell
                // the user that there was an error while getting the notes.
                if (!data.success) {
                    throw Error('Failure while attempting to get notes');
                }

                // Otherwise, we return a Promise with the imageURL as a return value.
                return new Promise((resolve, reject) => {
                    resolve(data.imageUrl);
                    reject('Failed to get notes');
                })
            })
            // If there was an error in our request to the API then we log the error to the console.
            .catch(err => console.log(err));

        // Next we need the author the notes. To do this, we send a GET request to the users endpoint
        // passing in the author ID of the notes that have been passed as a prop.
        const getAuthor = fetch(`http://localhost:3000/users/${note.authorId}`)
            // Turning the JSON response into a Javascript object.
            .then(response => response.json())
            // Using the object.
            .then(data => new Promise((resolve, reject) => {
                // Creating the author, an instance of the User class.
                const author = new User(
                    data.user.user_id,
                    data.user.first_name,
                    data.user.last_name,
                    data.user.can_post,
                    data.user.intake,
                    data.user.private,
                    data.user.num_of_posts
                );
                
                // Sending the author back in the Promise
                resolve(author);
                reject('Failed to create user');

            }))
            // If there was an error, log it to the console.
            .catch(err => console.log(err));

        // Once both of the above Promises have been resolved, we can then update the state using the
        // data passed in by the Promises.
        Promise.all([getImage, getAuthor])
            .then(data => {
                const [ imageUrl, author ] = data;

                this.setState({ author: author, imageUrl: imageUrl });

            })

    }

    // This is the method to handle the case that the user wants to delete the notes.
    deleteNote = () => {

        // First we take in the notes and the changeRoute method from the props.
        const { note, changeRoute } = this.props; 

        // Now we initiate a DELETE request to the /notes endpoint.
        fetch(`http://localhost:3000/notes/${note.id}`, {
            method: 'delete'
        })
        // Getting the response as JSON and converting it to a Javascript object.
        .then(response => response.json())
        .then(data => {
            // If the request was successful then we reroute the user to the index route.
            if (data.success) {
                changeRoute('index');
            }
            // Otherwise we update the state to alert the user that an error occured in the backend.
            else {
                console.log(data.message)
                this.setState({ failedToDeleteNotes: true });
            }
        })
        // If any error occurs then we do the same thing.
        .catch(err => this.setState({ failedToDeleteNotes: true }));

    }

    // The render function for the component.
    render() {

        // We get the notes, the parent folder and the current user from the props.
        const { note, parentFolder, currentUser } = this.props;
        // Then we destructure the author, URL of the image, the show forum boolean and the alert state.
        const { author, imageUrl, showForum, failedToDeleteNotes } = this.state;

        // If the image URL is null or the author is null then the API has not yet responded and we
        // show a loading screen to the user.
        if (imageUrl === null || author === null) {
            return(
                <div className={'centralise'}>
                    <h1>Getting the Notes...</h1>
                    <div className={'loader'}></div>
                </div>
            );
        }
        // Otherwise, we return the component
        else {
            return(
                <div>
                    <Container>
                        <Row className={'d-flex justify-content-center'}>
                        <Col md={8} lg={6} xs={12}>
                            <Card className={'shadow'}>
                                <Card.Img src={imageUrl} />
                            </Card>
                            <a href={imageUrl} download={`${note.name}.jpg`}>
                                <Button style={{
                                    marginBottom: '10px'
                                }}>Download Notes</Button>
                            </a>
                            {
                                author.id === currentUser.id &&
                                <Button
                                    variant={'danger'}
                                    style={{ marginBottom: '10px', marginInline: '5px' }}
                                    onClick={() => this.deleteNote()}
                                >Delete Notes</Button>
                            }
                            {
                                failedToDeleteNotes &&
                                <Alert variant={'danger'}
                                    style={{ marginBottom: '10px' }} 
                                >
                                    Failed To Delete Notes
                                </Alert>
                            }
                        </Col>
                        <Col>
                            <Card>
                                <Card.Header>Information</Card.Header>
                                <Card.Body>
                                    <Card.Text style={{ marginBottom: '5px' }}>
                                    {
                                        (!author.isPrivate) ?
                                            `Posted By ${author.getFullName()} `
                                        :
                                            'Posted By Private User '
                                    }
                                    To {parentFolder.title}
                                    </Card.Text>
                                    <Card.Text style={{ marginBottom: '5px' }}>
                                        Title - {note.name}
                                    </Card.Text>

                                    {
                                        showForum ?
                                        <div>
                                            <Card.Subtitle>Forum - </Card.Subtitle>
                                            <ForumCard parentNote={note} currentUser={currentUser} />
                                        </div>
                                        :
                                        <Button variant='danger' onClick={() => this.setState({ showForum: true })}>Show Forum</Button>
                                    }

                                </Card.Body>
                            </Card>
                        </Col>
                        </Row>
                    </Container>
                </div>
            );
        }
    }
}