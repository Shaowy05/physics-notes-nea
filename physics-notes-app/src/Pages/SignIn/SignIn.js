// Importing React library
import React from "react";

// Importing React Components
import AccountCard from "../../Components/AccountCard/AccountCard";

// The Sign In Page Component - Page for the user to sign in
export default class SignIn extends React.Component {

    // Constructor for SignIn
    constructor(props) {
        // Calling the super method to inherit React.Component constructor
        super(props);

        // Creating the state for SignIn
        this.state = {
            email: '',
            password: ''
        }
    }

    // Creating methods to allow AccountCard to update the state
    updateEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    updatePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    // Render method for SignIn
    render() {
        
        // Returning the SignIn Page
        return(
            <div className="SignIn page">
                <AccountCard type="signin" updateEmail={this.updateEmail} updatePassword={this.updatePassword} />
            </div>
        )

    }

}