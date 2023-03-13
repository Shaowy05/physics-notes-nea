import React from "react";

import './FolderPath.css';

// Inheriting from React.Component.
export default class FolderPath extends React.Component {

    // Rendering the component.
    render() {

        // Loading the folder path stack from the props.
        const { folderPathStack } = this.props;

        // This is the string that will be displayed at the top of the Topic Table so that the user
        // knows which folders they have traversed through. We initialise this to an empty string and
        // add to it later.
        let pathString = '';

        // For each folder in the stack, we concatenate a string with the title of the folder to the 
        // path string.
        folderPathStack.getItems().forEach(folder => {
            pathString = pathString.concat(`${folder.title}/`);
        })

        // For the return, we just display a string with the string inside.
        return (
            <div>
                <p>{pathString}</p>
            </div>
        );
    }
}