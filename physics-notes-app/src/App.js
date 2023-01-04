// Importing React library
import React from "react";

// Importing styling for App
import './App.css';

// Importing styling for Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing React Components
import NavigationBar from './Components/NavigationBar/NavigationBar';

// Importing Pages
import SignIn from "./Pages/SignIn/SignIn";
import Index from './Pages/Index/Index';
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Notes from "./Pages/Notes/Notes";
import Messaging from "./Pages/Messaging/Messaging";
import Forum from "./Pages/Forum/Forum";

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

    // Route Handling Methods
    // changeRoute handles the event where a user clicks a link
    changeRoute(route) {

        // Setting state.route to the passed route
        this.setState({ route: route });

    }

    getPageToRender() {

        // Destructuring state for easier access 
        const { route, signedIn, user } = this.state;

        switch (route) {

            // Sign In Page
            case 'signin':
                return <SignIn />
                break;
            
            // Index Page
            case 'index':
                return <Index signedIn={signedIn} />
                break;

            // Register Page
            case 'register':
                return <Register />
                break;

            // Messaging Page
            case 'messaging':
                return <Messaging />
                break;

            // Profile Page
            case 'profile':
                return <Profile />
                break;

            // Forum Page
            case 'forum':
                return <Forum />
                break;

            // Notes Page
            case 'notes':
                return <Notes />
                break;

            // In case of invalid route
            default:
                console.log("Invalid Route in State");
                return null
        }
    }
    
    // Render method for App
    render() {

        // Destructuring the state into variables for easier
        // access
        const { route, signedIn, user } = this.state;

        const pageToRender = this.getPageToRender()

        // Returning the App Component
        return(
            
            // The div element surrounding the App Component
            <div className="App">

                {/* Universal Components - Rendered regardless of state */}
                <NavigationBar signedIn={signedIn} />

                {/* Conditional Components - Dependent on state */}
                {pageToRender}

            </div>
        );
    
    }
}