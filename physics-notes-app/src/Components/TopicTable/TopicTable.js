import React from "react";
import './TopicTable.css';

// Importing React Bootstrap Components
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

// Importing the TreeNode class from logic
import TreeNode from "../../Logic/Tree/TreeNode";
import Tree from "../../Logic/Tree/Tree";
import Folder from "../../Logic/Folder";
import Stack from "../../Logic/Stack";
import FolderArray from "../../Logic/FolderArray";

// Importing React Components
import FolderPath from "../FolderPath/FolderPath";
import FolderRow from "../FolderRow/FolderRow";
import FilterCard from "../FilterCard/FilterCard";
import Tag from "../../Logic/Tag";

export default class TopicTable extends React.Component {

    constructor() {
        super();

        const rootFolder = new Folder(0, 0, '~', false, null, 'root');
        const initialPathStack = new Stack();
        initialPathStack.push(rootFolder);
        
        this.state = {
            folderArray: new FolderArray([rootFolder]),
            folderDirectoryTree: new Tree(new TreeNode(0)),
            folderPathStack: initialPathStack,

            searchBarText: '',

            hideSections: false,
            hideEmptyFolders: false,

            orderByOption: 'Number',

            tags: []

        };

    }

    componentDidMount = () => {
        const fetchFolders = fetch('http://localhost:3000/folders')            
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

                const fA = new FolderArray(this.state.folderArray.folders.concat(folders));
                const fDT = this.createFolderTree(fA.folders);

                this.setState({
                    folderArray: fA,
                    folderDirectoryTree: fDT
                });

                return new Promise((resolve, reject) => {
                    resolve(folders);
                    reject('Failed to create folder array and tree');
                });

            })
            .catch(err => console.log('Error occurred while retrieving folders'));

        const fetchTags = fetch('http://localhost:3000/tags')
            .then(response => response.json())
            .then(tagObjects => {
                let tags = tagObjects;
                tags = tags.map((tagObject, i) => new Tag(i, tagObject.tag_id, tagObject.tag_name));
                this.setState({ tags: tags });
                return new Promise((resolve, reject) => {
                    resolve(tags);
                    reject('Failed to retrieve tags');
                })
            })
            .catch(err => console.log('Error occurred while retrieving tags'));

        const fetchFolderTagRelations = fetch('http://localhost:3000/folder-to-tag')
            .then(response => response.json())
            .catch(err => console.log('Failed to get relations'));

        // Once all the tags and folders have been fetched, we can add the tags to the folders
        // to allow for filtering by tags.
        Promise.all([fetchFolders, fetchTags, fetchFolderTagRelations])
            .then(data => {

                // Storing all the data in constants for easier use
                const folders = data[0];
                const tags = data[1];
                const relations = data[2];

                // Adding the tags to the folders
                folders.forEach(folder => {

                    const filteredRelations = relations.filter(relation => (relation.folder_id === folder.id) ? true : false);

                    filteredRelations.forEach(relation => {
                        tags.forEach(tag => {
                            if (tag.id === relation.tag_id) {
                                folder.addTag(tag);
                            }
                        })
                    })

                })

            })

    }

    createFolderTree = folders => {

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

    updateSearch = event => this.setState({ searchBarText: event.target.value });

    updateHideSections = event => this.setState({ hideSections: event.target.checked });

    updateHideEmptyFolders = event => this.setState({ hideEmptyFolders: event.target.checked });

    updateOrderByOption = event => this.setState({ orderByOption: event.target.id })

    updateTagAtIndex = (event, index) => this.setState(state => {
        let tempTags = state.tags;
        const tempTag = tempTags[index];
        tempTag.toggleActive();
        tempTags[index] = tempTag;
        return { tags: tempTags };
    })

    // Render method for TopicTable
    render() {

        const { folderArray, folderDirectoryTree, folderPathStack, tags } = this.state;

        const folders = folderArray.getFolders(this.state);

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
                    <FilterCard 
                        updateSearch = {this.updateSearch} 
                        updateHideSections = {this.updateHideSections}
                        updateHideEmptyFolders = {this.updateHideEmptyFolders}
                        updateOrderByOption = {this.updateOrderByOption}
                        tags = {tags}
                        updateTagAtIndex = {this.updateTagAtIndex}
                    />
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
                                this.state.folderPathStack.top() !== folderArray.folders[0] &&
                                <tr onClick={this.goToParentFolder}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td colSpan={4}>Return</td>
                                </tr>
                            }
                            {
                                folders.map((childFolder, i) => {
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
                    <Button variant="success" onClick={() => {
                            this.props.updateCurrentFolder(folderPathStack.top());
                            this.props.changeRoute('add-notes');
                        }}>Add Notes</Button>
                </div>
            );
        }
    }
}