// Importing React library
import React from "react";

// Importing styling for App
import './App.css';

// Importing styling for Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing React Components
import NavigationBar from './Components/NavigationBar/NavigationBar';

import AccountCard from "./Components/AccountCard/AccountCard";

/* // Importing Pages
import SignIn from "./Pages/SignIn/SignIn";
import Index from './Pages/Index/Index';
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Notes from "./Pages/Notes/Notes";
import Messaging from "./Pages/Messaging/Messaging";
import Forum from "./Pages/Forum/Forum"; */

// The App React Component - Container for all other components 
export default class App extends React.Component {

    // Construtor for App Component
    constructor() {
        // Calling super to inherit React.Component methods and properties
        super()

        // Creating the state for our App
        this.state = {
            
            // Routing properties
            // Route is 'signin' by default
            route: 'signin',

            // User is not signed in by default
            signedIn: false,

            // Creating the User object to store info about the user
            user: {

                // Unique id
                id: '',

                // Personal details
                firstName: '',
                lastName: '',
                schoolEmail: '',

                // The Role property - determines the level of access
                // this user has.
                role: '',

                // Year of intake into Ecclesbourne
                intake: ''
            }
        }
    }

    // changeRoute handles the event where a user clicks a link
    changeRoute = (route) => {
        // Setting state.route to the passed route
        return this.setState({ route: route });
    }

    // loadUser method lets the signin and register routes load user
    loadUser = (user) => {
        return this.setState({ signedIn: true, user: user }, () => console.log(this.state));
    }
    
    // Render method for App
    render() {

        // Destructuring the state into variables for easier
        // access
        const { route, signedIn, user } = this.state;

        // Returning the App Component
        // An if statement to decide what to return
        
        // Sign In route
        if (route === 'signin') {
            return(
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: '6rem'}}>
                    <AccountCard type='signin' changeRoute={this.changeRoute} loadUser={this.loadUser} />
                </div>
            );
        }

        // Index route
        else if (route === 'index') {

        }

        // Register route
        else if (route === 'register') {

        }

        // Notes route
        else if (route === 'notes') {

        }
        
        // Profile route
        else if (route === 'profile') {

        }

        // Messaging route
        else if (route === 'messaging') {

        }

        // Forum route
        else if (route === 'forum') {

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