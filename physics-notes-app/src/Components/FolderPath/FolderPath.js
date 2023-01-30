import React from "react";

import './FolderPath.css';

export default class FolderPath extends React.Component {

    render() {

        const { folderPathStack } = this.props;

        let pathString = '';

        folderPathStack.getItems().forEach(folder => {
            pathString = pathString.concat(`${folder.title}/`);
        })

        return (
            <div>
                <p>{pathString}</p>
            </div>
        );
    }
}