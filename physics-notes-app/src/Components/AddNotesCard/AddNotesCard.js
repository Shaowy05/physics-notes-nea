import React from "react";

import Alert from 'react-bootstrap/Alert';

import './AddNotesCard.css';

// Inheriting React.Component
export default class AddNotesCard extends React.Component {

    constructor(props) {
        super(props);

        // In the state we have fields for the title, the JPG file, URL for the notes and a state which
        // can be used to show an error if an error occurs.
        this.state = {

            notesTitle: '',

            // Here we have a state which holds the files that have
            // been selected by the user
            notes: null,
            urlNotes: null,

            failedToUpload: false

        }

    }

    // Setting the title state upon the user entering input.
    handleTitleInput = event => this.setState({ notesTitle: event.target.value });

    // Here we set the state to the file stored in the HTML tag using the .files property.
    handleAddNotes = event => {
        this.setState({ notes: event.target.files[0] });
    }

    // This is the method that is executed upon the user pressing the add notes button, handling the
    // transfer of information to the backend.
    handleNotesUpload = event => {
        // First we create a new instance of FileReader.
        const reader = new FileReader()
        // Then we use this instance, plus the readAsDataUrl method to convert the JPG stored in the
        // state to turn the file into a base 64 result. We wrap this in a try catch in the instance
        // that the user enters a non-readable format.
        try {
            reader.readAsDataURL(this.state.notes);
        }
        catch(err) {
            this.setState({ failedToUpload: true });
            return null;
        }

        // Now we create an asynchronous function so that we can upload the file to the backend, without
        // having any blocking code on the main website.
        reader.onload = async () => {
            // Getting the URL representation from the result of the reader.
            const base64Notes = reader.result;
            // Once this has done, we send a POST request to the notes endpoint of the API, passing
            // in the title, the URL of the notes, the ID of the current user and finally the ID of
            // folder on top of the Folder Path Stack.
            fetch('http://localhost:3000/notes', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    noteName: this.state.notesTitle,
                    notes: base64Notes,
                    authorId: this.props.currentUser.id,
                    folderId: this.props.currentFolder.id
                }) 
            })
            // Convert the response to a Javascript object.
            .then(response => response.json())
            // When the API sends a response...
            .then(message => {
                // If the API responds with a success status of true, then we can run the updateFolderHasNotes
                // method to make sure that all the parent folders of the new set of notes have a hasNotes
                // property of true, passing in the ID of the current folder.
                if (message.success) {
                    this.updateFolderHasNotes(this.props.currentFolder.id);
                    // Once this has been done successfully, we can reroute the user to the index page.
                    this.props.changeRoute('index');
                }
                // Otherwise, we can utilise the failedToUpload state to be true and provide some visual
                // feedback to the user.
                else {
                    this.setState({ failedToUpload: true });
                }
            })
            // If there was an error at any point then we set the failedToUpload state to be true as
            // well.
            .catch(err => {
                this.setState({ failedToUpload: true });
            });
        }
    }

    // We need a way to change the parent folder, and all of its parent folders, to have a new hasNotes
    // property. The best way to do this would be some form of recursion, so here I define a method
    // which takes in a folder ID as a parameter.
    updateFolderHasNotes = folderId => {
        
        // First we create the base case, if we have reached the root folder (the folder with ID of 0)
        // then we can return null to escape out the method and halt the recursion.
        if (folderId === 0) {
            return null;
        }

        // Otherwise, we initiate a PUT request to the folders/has-notes endpoint so we can change the
        // relevant field. Here we pass in the folder ID specified in the paramater and the new state
        // of hasNotes.
        fetch('http://localhost:3000/folders/has-notes', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                folderId: folderId,
                hasNotes: true
            })
        })
        // Converting the JSON response to a Javascript object.
        .then(response => response.json())
        // Once done we can...
        .then(message => {
            // If the API responds with a message of success, we can then call this method on the ID
            // of the parent folder. This results in this recursion where all the parent folders will
            // be updated.
            if (message.success) {
                this.updateFolderHasNotes(message.parentFolderId)
            }
        })
        // If there was an error at any point then we log it to the console for debugging.
        .catch(err => console.log(err));

    }

    render() {

        // Getting the current folder, the user and the changeRoute method in the props.
        const { currentFolder, user, changeRoute } = this.props;

        return(
            <div>
                <section className="vh-75">
                <div className="container pt-5 vh-75">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-10">
                    <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }} >
                        <div className="card-body p-5 text-center">
                        <div className="mb-md-2 mt-md-3 pb-5">

                            {
                                this.state.failedToUpload &&
                                <Alert variant={'danger'}>Failed to Upload Notes</Alert>
                            }

                            <h2 className="fw-bold mb-2 text-uppercase">Add Notes</h2>

                            <p className="text-white-50 mb-2">Add Notes to</p>
                            <label className="form-label">{currentFolder.title}</label>

                            <div className="form-outline form-white mb-4">
                                <label className="form-label">Title</label>
                                <input type={'text'} className={'form-control form-control-lg'} onChange={this.handleTitleInput} />
                            </div>

                            <div className="mb-4">
                                <input id={'notes'} type={'file'} onChange={this.handleAddNotes} className={"form-control bg-secondary"} accept={'image/jpeg'} multiple />
                            </div>

                            <button className={'btn btn-lg px-5 btn-success mb-2 mx-1'} onClick={this.handleNotesUpload}>Add</button>
                            <button className={'btn btn-lg px-5 btn-danger mb-2 mx-1'} onClick={() => changeRoute('index')}>Cancel</button>

                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                </section>
            </div>
        );
    }
}