import React from "react";

// Importing React Bootstrap Components
import Table from "react-bootstrap/Table";

// Importing the TreeNode class from logic
import TreeNode from "../../Logic/Tree/TreeNode";
import Tree from "../../Logic/Tree/Tree";
import Folder from "../../Logic/Folder";
import Stack from "../../Logic/Stack";

// Importing React Components
import FolderPath from "../FolderPath/FolderPath";

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

    returnToParentFolder = () =>{
        this.setState(state => {
            const tempStack = state.folderPathStack;
            tempStack.pop();
            return {
                folderPathStack: tempStack
            };
        })
    }


    // Render method for TopicTable
    render() {

        const { folderArray, folderDirectoryTree, folderPathStack } = this.state;

        // Returning Topic Table
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
                            <th>type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            folderPathStack.top() === folderArray[0] ??
                            <tr colSpan={4} onClick={this.returnToParentFolder}>
                                <td>Return</td>
                            </tr>
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}