// Importing React library
import React from 'react';

// Importing React Components


// The Index Page Component - Contains all the topics and subtopics
export default class Index extends React.Component {

    // Render method for Index
    render() {

        // Destructuring props for easier access
        const { signedIn } = this.props

        // Returning the Index Page
        return (
            <div className='Index page'>
                {
                    signedIn === false
                    ? <h1> You must be signed in in order to access the notes </h1>
                    : <h1> Index </h1> 
                }
            </div>
        )

    }

}