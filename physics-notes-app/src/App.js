// Importing React library
import React from "react";

// Importing styling for App
import './App.css';

// Importing styling for Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing React Components
import NavigationBar from './Components/NavigationBar/NavigationBar';

import AccountCard from "./Components/AccountCard/AccountCard";
import TopicTable from "./Components/TopicTable/TopicTable";
import AddNotesCard from "./Components/AddNotesCard/AddNotesCard";
import NoteCard from "./Components/NoteCard/NoteCard";

// Importing React Bootstrap Components
import Container from "react-bootstrap/esm/Container";
import ProfileCard from "./Components/ProfileCard/ProfileCard";

// The App React Component - Container for all other components 
export default class App extends React.Component {

    // Construtor for App Component
    constructor() {
        // Calling super to inherit React.Component methods and properties
        super()

        // Creating the state for our App
        this.state = {

            // A property for the current note
            currentNote: null,
            
            // A property for the current folder
            currentFolder: null,

            // A property for the folder array
            folderArray: null,

            // Routing properties
            // Route is 'signin' by default
            route: 'signin',

            // User is not signed in by default
            signedIn: false,

            // Creating the User object to store info about the user
            user: null
        }
    }

    // changeRoute handles the event where a user clicks a link
    changeRoute = route => {
        // Setting state.route to the passed route
        return this.setState({ route: route });
    }

    // loadUser method lets the signin and register routes load user
    loadUser = user => {
        return this.setState({ signedIn: true, user: user });
    }

    // A method allowing components to update the current folder
    updateCurrentFolder = folder => this.setState({ currentFolder: folder });

    // A method to update the folder array in the state
    updateFolderArray = folderArray => this.setState({ folderArray: folderArray });

    updateCurrentNote = note => this.setState({ currentNote: note });
    
    // Render method for App
    render() {

        // Destructuring the state into variables for easier
        // access
        const { route, signedIn, user, currentFolder, folderArray, currentNote } = this.state;

        // Returning the App Component
        // An if statement to decide what to return
        
        // Sign In route
        if (route === 'signin') {
            return(
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem', alignContent: 'center'}}>
                    <AccountCard type='signin' changeRoute={this.changeRoute} loadUser={this.loadUser} />
                </div>
            );
        }

        // Index route
        else if (route === 'index') {
            return(
                <div>
                    <NavigationBar signedIn={signedIn} changeRoute={this.changeRoute} />
                    <Container>
                        <TopicTable
                            changeRoute={this.changeRoute}
                            updateCurrentFolder={this.updateCurrentFolder}
                            updateCurrentNote={this.updateCurrentNote}
                            currentUser={user} 
                        />
                    </Container>
                </div>
            );
        }

        // Register route
        else if (route === 'register') {
            return(
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem', alignContent: 'center'}}>
                    <AccountCard type='register' changeRoute={this.changeRoute} loadUser={this.loadUser} />
                </div>
            );
        }

        // Notes route
        else if (route === 'notes') {
            return(
                <div>
                    <NavigationBar signedIn={signedIn} changeRoute={this.changeRoute} />
                    <NoteCard note={currentNote} parentFolder={currentFolder} currentUser={user} changeRoute={this.changeRoute} />
                </div>
            );
        }

        else if (route === 'add-notes') {
            return(
                <div>
                    <NavigationBar signedIn={signedIn} changeRoute={this.changeRoute} />
                    <AddNotesCard currentFolder={currentFolder} currentUser={user} changeRoute={this.changeRoute} folderArray={folderArray} />
                </div>
            );
        }

        // Profile route
        else if (route === 'profile') {
            return(
                <div>
                    <NavigationBar signedIn={signedIn} changeRoute={this.changeRoute} />
                    <ProfileCard user={user} />
                </div>
            );
        }

        // Invalid route
        else {
            console.log('Invalid route in state');
            return(
                <h1>Something went wrong!</h1>
            )
        }
    
    }
}