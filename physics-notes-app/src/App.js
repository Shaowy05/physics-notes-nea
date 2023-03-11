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

// Here we create a class called App which inherits from the React.Component class, giving us access
// to all the methods such as the render method. We export this so that it can be used in index.js.
export default class App extends React.Component {

    // Construtor for App Component
    constructor() {
        // Calling super to inherit React.Component methods and properties
        super()

        // Creating the state for our App
        this.state = {

            // A property for the current note. This will store an instance of the Note class and represents
            // the note that should be rendered on the notes route.
            currentNote: null,
            
            // A property for the current folder. This is often passed into components as a prop since
            // information about the user's selected folder is vital to deciding what content to show.
            currentFolder: null,

            // A property for the folder array. This will be an instance of the Folder Array class.
            folderArray: null,

            // Here we have an item in the state to store the current route. This is used to decide
            // what components to render, as can be seen in the swtich statement used later on.
            route: 'signin',

            // User is not signed in by default, which prevents the user from accessing any items on
            // the routes unless they sign in.
            signedIn: false,

            // Finally we add a state for storing the current user. This is needed to show the correct
            // web page depending on the permissions that the user has and also the type if the user
            // is a teacher.
            user: null
        }
    }

    // One common state that needs to be updated from child components is the route. For example, if
    // the user clicks on a note in the topic table component the route should be changed to the notes
    // route. This function takes in one parameter, which is the string representing the route to change
    // to.
    changeRoute = route => {
        // Setting state.route to the passed route, this will automatically hydrate the webpage to show
        // the new components.
        return this.setState({ route: route });
    }

    // The load user method will be passed into the Account Card component so that it can update the
    // user stored in the state if a successful sign in occurs.
    loadUser = user => {
        // Here we set the signed in state to be true, and assign a new user to the state.
        return this.setState({ signedIn: true, user: user });
    }

    // A method allowing components to update the current folder
    updateCurrentFolder = folder => this.setState({ currentFolder: folder });

    // A method to update the folder array in the state
    updateFolderArray = folderArray => this.setState({ folderArray: folderArray });

    // A method for updating the current note stored in the state.
    updateCurrentNote = note => this.setState({ currentNote: note });
    
    // Render method for App
    render() {

        // Destructuring the state into variables for easier access during the method.
        const { route, signedIn, user, currentFolder, folderArray, currentNote } = this.state;

        // Here we use an if statement with the route as the condition to emulate the 'routes' that
        // a typical website would have.
        // Firstly, if the route is signin then return the Account Card component, passing in the changeRoute
        // function and the loadUser function. We pass in a type prop of 'signin' to tell the Account
        // Card to be of type sign in.
        if (route === 'signin') {
            return(
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem', alignContent: 'center'}}>
                    <AccountCard type='signin' changeRoute={this.changeRoute} loadUser={this.loadUser} />
                </div>
            );
        }
        // This is the index route, the main page where all the folders are displayed. Here we render
        // a navigation bar, with the topic table component.
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
        // If the route is 'register' then we render the Account Card in a similar fashion to the signin
        // except we pass in a type of 'register' instead of 'signin' so that the user can enter personal
        // details and add their profile to the database.
        else if (route === 'register') {
            return(
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem', alignContent: 'center'}}>
                    <AccountCard type='register' changeRoute={this.changeRoute} loadUser={this.loadUser} />
                </div>
            );
        }
        // If the route is 'notes' then we render the navigation bar with the Note Card component. The
        // Note Card component needs the current note, the current folder, the current user and also
        // the change route function.
        else if (route === 'notes') {
            return(
                <div>
                    <NavigationBar signedIn={signedIn} changeRoute={this.changeRoute} />
                    <NoteCard note={currentNote} parentFolder={currentFolder} currentUser={user} changeRoute={this.changeRoute} />
                </div>
            );
        }
        // If the route is 'add-notes' then we render the Add Notes component so that the user can add
        // a set of notes to the database. This route requires the current user, current folder, the
        // array of folders and the changeRoute function. This information is needed so that the API
        // can set up the proper relations in the database.
        else if (route === 'add-notes') {
            return(
                <div>
                    <NavigationBar signedIn={signedIn} changeRoute={this.changeRoute} />
                    <AddNotesCard currentFolder={currentFolder} currentUser={user} changeRoute={this.changeRoute} folderArray={folderArray} />
                </div>
            );
        }
        // The profile route is the route where the user can update their personal details and also
        // add tests to their account. These tests will be displayed in a graph. For this reason,
        // we need to pass in the current user as a prop to the profile page.
        else if (route === 'profile') {
            return(
                <div>
                    <NavigationBar signedIn={signedIn} changeRoute={this.changeRoute} />
                    <ProfileCard user={user} />
                </div>
            );
        }
        // If the route is invalid then we return an error page to the user so that they know something
        // has gone wrong.
        else {
            console.log('Invalid route in state');
            return(
                <h1>Something went wrong!</h1>
            );
        }
    }
}