import React from "react";

// Importing React Bootstrap Components
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";

// Importing the TreeNode class from logic
import TreeNode from "../../Logic/Tree/TreeNode";
import Tree from "../../Logic/Tree/Tree";
import Folder from "../../Logic/Folder";

export default class TopicTable extends React.Component {

    constructor() {
        super();
        this.state = {
            // Folder array stores each folder at the index
            // specified by its key in the tree
            folderArray: [new Folder(0, 0, '~', false, null, 'root')],
            // The tree for structuring the folders. Max node
            // initially set to 1.
            folderDirectoryTree: null
        }
    }

    createFolderTree = (folders) => {

        const folderDirectoryTree = new Tree(new TreeNode(0), 50);

        folders.forEach(folder => {
            if (folder.parentId !== null) {
                let tempTreeNode = new TreeNode(folder.id);
                folderDirectoryTree.breadthFirstTraversal(folder.parentId).addChild(tempTreeNode);
            }
        })

        return folderDirectoryTree;

    }

    // After the table is rendered
    componentDidMount() {

            this.setState({
                folderArray: null,
                folderDirectoryTree: null
            });

            fetch('http://localhost:3000/folders')            
                .then(response => response.json())
                .then(folderObjects => {
                    return new Promise((resolve, reject) => {
                        const folders = folderObjects.map(folderObject => {
                            const folderValues = Object.values(folderObject);
                            return new Folder(
                                folderValues[0],
                                folderValues[1],
                                folderValues[2],
                                folderValues[3],
                                folderValues[4],
                                folderValues[5]
                            );
                        })
                        resolve(folders);
                        reject('Failed to convert folder objects to array of folders');
                    })
                })
                .then(folders => {
                    const fDT = this.createFolderTree(folders);
                    const fA = [new Folder(0, 0, '~', false, null, 'root')].concat(folders);

                    this.setState({
                        folderArray: fA,
                        folderDirectoryTree: fDT 
                    });
                })

    }

    // Render method for TopicTable
    render() {

        // Returning Topic Table
        return (
            <Table striped bordered hover responsive='md'>
                <thead>
                    <tr>
                        <th>Topic Number</th>
                        <th>Topic Name</th>
                        <th>Notes</th>
                        <th>Questions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Section 1 - Particles and Radiation */}
                    <tr>
                    </tr>
                </tbody>
            </Table>
        );
    }
}