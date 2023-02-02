import React from "react";

import './FolderRow.css';

// A singular row in the TopicTable Component. Will take in a folder
// as a prop.
export default class FolderRow extends React.Component {

    render() {

        const { folder, goToSelectedFolder } = this.props
        
        return(
            <tr onClick={() => goToSelectedFolder(folder)}>
                <td>{folder.number}</td>
                <td>{folder.title}</td>
                <td style={{textAlign: 'center'}}>{
                    folder.hasNotes ? '✅' : '❌'     
                }</td>
                <td>{folder.type}</td>
            </tr>
        );
    }

}