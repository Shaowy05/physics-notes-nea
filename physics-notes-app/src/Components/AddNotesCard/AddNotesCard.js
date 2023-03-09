import React from "react";

import Alert from 'react-bootstrap/Alert';

import './AddNotesCard.css';

export default class AddNotesCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            notesTitle: '',

            // Here we have a state which holds the files that have
            // been selected by the user
            notes: null,
            urlNotes: null,

            failedToUpload: false

        }

    }

    handleTitleInput = event => this.setState({ notesTitle: event.target.value });

    handleAddNotes = event => {
        this.setState({ notes: event.target.files[0] });
    }

    handleNotesUpload = event => {
        const reader = new FileReader()
        reader.readAsDataURL(this.state.notes);

        reader.onload = async () => {
            const base64Notes = reader.result;
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
            .then(response => response.json())
            .then(message => {
                console.log(message)
                if (message.success) {
                    this.updateFolderHasNotes(this.props.currentFolder.id);
                    this.props.changeRoute('index');
                }
                else {
                    this.setState({ failedToUpload: true });
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ failedToUpload: true });
            });
        }

    }

    // This function will recursively update the current folder, and all of its
    // parent folders' has_notes field in the database.
    updateFolderHasNotes = folderId => {

        // Base Case - If the ID of the folder passed in is the root
        // folder, then we should stop.
        if (folderId === 0) {
            return null;
        }

        fetch('http://localhost:3000/folders/has-notes', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                folderId: folderId,
                hasNotes: true
            })
        })
        .then(response => response.json())
        .then(message => {
            if (message.success) {
                this.updateFolderHasNotes(message.parentFolderId)
            }
        })
        .catch(err => console.log(err));

    }

    render() {

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