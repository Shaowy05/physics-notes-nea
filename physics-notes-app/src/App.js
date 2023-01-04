// Importing React library
import React from "react";

// Importing styling for App
import './App.css';

// Importing React Components
import NavigationBar from './Components/NavigationBar';

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
    
    // Render method for App
    render() {

        // Destructuring the state into variables for easier
        // access
        const { route, signedIn, user } = this.state;

        // Returning the App Component
        return(
            
            // The div element surrounding the App Component
            <div className="App">

                {/* Universal Components */}
                <NavigationBar />

                {/* Index Page Components */}


                {/* Notes Page Components */}


                {/* Forum Page Components */}


                {/* Messaging Components */}


                {/* Profile Page Components */}


                {/* Sign In Page Components */}


                {/* Register Page Components */}


            </div>
        );
    
    }
}