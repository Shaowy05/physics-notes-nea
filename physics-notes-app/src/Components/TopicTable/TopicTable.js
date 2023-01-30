import React from "react";
import './TopicTable.css';

// Importing React Bootstrap Components
import Table from "react-bootstrap/Table";

// Importing the TreeNode class from logic
import TreeNode from "../../Logic/Tree/TreeNode";
import Tree from "../../Logic/Tree/Tree";
import Folder from "../../Logic/Folder";
import Stack from "../../Logic/Stack";

// Importing React Components
import FolderPath from "../FolderPath/FolderPath";
import FolderRow from "../FolderRow/FolderRow";

export default class TopicTable extends React.Component {

    constructor() {
        super();

        const rootFolder = new Folder(0, 0, '~', false, null, 'root');
        const initialPathStack = new Stack();
        initialPathStack.push(rootFolder);
        
        this.state = {
            folderArray: [rootFolder],
            folderDirectoryTree: new Tree(new TreeNode(0)),
            folderPathStack: initialPathStack
        };

    }

    componentDidMount = () => {
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
                const fA = this.state.folderArray.concat(folders);

                this.setState({
                    folderArray: fA,
                    folderDirectoryTree: fDT
                });

            })
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

    goToParentFolder = () => {
        this.setState(state => {
            const tempStack = state.folderPathStack;
            tempStack.pop();
            return {
                folderPathStack: tempStack
            };
        })
    }

    goToSelectedFolder = folder => {
        this.setState(state => {
            const tempStack = state.folderPathStack;
            tempStack.push(folder);
            return {
                folderPathStack: tempStack
            }
        })
    }


    // Render method for TopicTable
    render() {

        const { folderArray, folderDirectoryTree, folderPathStack } = this.state;

        const currentFolder = folderPathStack.top();
        const currentTreeNode = folderDirectoryTree.breadthFirstTraversal(currentFolder.id);
        //const currentFolderChildren = currentTreeNode.getChildren();
        const currentFolderChildren = folderArray.filter(folder => {
            let isChildOfCurrentFolder = false;

            // Looping through all the child nodes of the current node
            currentTreeNode.getChildren().forEach(childNode => {
                if (childNode.key === folder.id) {
                    isChildOfCurrentFolder = true;
                }
            })

            return isChildOfCurrentFolder;

        })

        // If the folders hav not been fetched then don't render the table and show a
        // page indicating that the folders are being fetched.
        if (folderArray.length === 0) {
            return(
                <div className={'centralise'}>
                    <h1>Getting the Notes...</h1>
                    <div className={'loader'}></div>
                </div>
            );
        }

        // Otherwise display the regular index page
        else {
            return (
                <div>
                    <Table striped bordered hover responsive='md'>
                        <thead>
                            <tr>
                                <th colSpan={4}>
                                    <FolderPath folderPathStack={folderPathStack} />
                                </th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Title</th>
                                <th>Notes</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentFolder !== folderArray[0] &&
                                <tr onClick={this.goToParentFolder}>
                                    <td colSpan={4}>Return</td>
                                </tr>
                            }
                            {
                                currentFolderChildren.map((childFolder, i) => {
                                    return (
                                        <FolderRow
                                            key={i}
                                            folder={childFolder}
                                            goToSelectedFolder={this.goToSelectedFolder}
                                        />
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            );
        }
    }
}