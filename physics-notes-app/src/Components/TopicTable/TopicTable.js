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
import Teacher from "../../Logic/Teacher";
import Note from "../../Logic/Note";
import NoteArray from "../../Logic/NoteArray";

// Inheriting from React.Component.
export default class TopicTable extends React.Component {

    constructor() {
        super();

        // Creating an instance of the Folder class to act as the 'root' of our tree. This will have
        // an ID of 0, number of 0, title of'~' (in order to get the start of the path to look like
        // '~/', like in a command line), a has notes of false (although this property doesn't actually
        // perform a function for the root folder), a parent ID of 0 and a type of 'root'.
        const rootFolder = new Folder(0, 0, '~', false, null, 'root');
        // Then we create a constant to store the path of the folders that the user has clicked on.
        const initialPathStack = new Stack();
        // We push the previously created root folder to the stack, so that the user starts in the root
        // folder.
        initialPathStack.push(rootFolder);
        
        // Creating the state
        this.state = {
            
            // Here we have a state to store the notes belonging to the current folder. This is stored
            // as an instance of the Note Array class. This is initially empty and will be populated
            // in the getNotes method.
            notes: new NoteArray(),
            // A state for storing the folders in the form of an instance of the folder array class.
            // We start off with an array of just the root folder.
            folderArray: new FolderArray([rootFolder]),
            // Then we create the Tree to represent the relationships between all the folders, setting
            // the root node to be a node with a key of 0 hence representing the root folder as that
            // has an ID of 0 as well.
            folderDirectoryTree: new Tree(new TreeNode(0)),
            // Then we set the folder path stack to the initial path stack we made earlier in the constructor.
            folderPathStack: initialPathStack,

            // The search bar text is used for storing the user input into the search bar in the filter
            // table. This will be used within the Folder Array class to filter out any folders that
            // don't match the search string.
            searchBarText: '',

            // Hide sections stores the boolean representing whether or not the user has opted to hide
            // the sections from the folder table.
            hideSections: false,
            // Hide empty folders does the same but for the switch that removes empty folders from the
            // table.
            hideEmptyFolders: false,

            // Order by option is a string which holds the type of ordering that the user has opted
            // to use. This is number by default.
            orderByOption: 'Number',

            // An array containing instances of the Tag class. This is used to filter the folders based
            // off of the tags that have been selected.
            tags: []

        };

    }

    // Once the Topic Table component has mounted...
    componentDidMount = () => {
        // We want to get all of the folders from the database. We do this by sending a GET request
        // the folders endpoint.
        const fetchFolders = fetch('http://localhost:3000/folders')            
            // Converting the response into a Javascript object.
            .then(response => response.json())
            // Then once we have the folder objects...
            .then(folderObjects => {
                // Returning a promise to be used in the next section of the Promise chain.
                return new Promise((resolve, reject) => {
                    // For each of the folders, we want to create an instance of the folder class so
                    // that they can stored in the Folder Array in the state.
                    const folders = folderObjects.map(folderObject => {
                        const folderValues = Object.values(folderObject);
                        // Creating the Folder from the values of the folder object.
                        return new Folder(
                            folderValues[0],
                            folderValues[1],
                            folderValues[2],
                            folderValues[3],
                            folderValues[4],
                            folderValues[5]
                        );
                    })
                    // Returning the folders for use in the next chain if successful.
                    resolve(folders);
                    // If not then we reject with a message to explain the error.
                    reject('Failed to convert folder objects to array of folders');
                })
            })
            // With these folders...
            .then(folders => {

                // We create an instance of the Folder Array class to store all of the folders, here
                // we pass the folders directly into constructor of the class. The  
                // this.state.folderArray.folders.concat(folders) bit attaches the folders array passed
                // in from the previous section to the current folders in the state. This is so that
                // root folder is not removed from the state.
                const fA = new FolderArray(this.state.folderArray.folders.concat(folders));
                // Now, using the newly created folder array, we can create a folder tree, by running
                // the creatFolderTree method implemented below.
                const fDT = this.createFolderTree(fA.folders);

                // Once both the folder array and the folder tree are fully created, we can assign them
                // to their respective state.
                this.setState({
                    folderArray: fA,
                    folderDirectoryTree: fDT
                });
                // Finally we return a promise containing the folders so that they can be used in the
                // next step of the promise chain.
                return new Promise((resolve, reject) => {
                    resolve(folders);
                    reject('Failed to create folder array and tree');
                });

            })
            // If at any point there was an error then we log the error to the console.
            .catch(err => console.log('Error occurred while retrieving folders'));

        // The other items we need from the database is the tags so that we can add any tags to folders
        // that have them. To do this we send a GET request to the tags endpoint in the API.
        const fetchTags = fetch('http://localhost:3000/tags')
            // Converting the response to a Javascript object.
            .then(response => response.json())
            // With these objects...
            .then(tagObjects => {
                // We create an array called tags, storing all of the tag objects.
                let tags = tagObjects;
                // Then for each tag in tags, we will create a new instance of the Tag class, passing
                // in its index, its ID and the name of the tag into the constructor.
                tags = tags.map((tagObject, i) => new Tag(i, tagObject.tag_id, tagObject.tag_name));
                // Then we set the tags state to be this new tags array that we've created.
                this.setState({ tags: tags });
                // After this is done, we return a promise containing the tags we've created.
                return new Promise((resolve, reject) => {
                    resolve(tags);
                    reject('Failed to retrieve tags');
                })
            })
            // If there was an error at any point, we log it to the console.
            .catch(err => console.log('Error occurred while retrieving tags'));

        // The last item we need before we can combine the tags and folders is the link table, since
        // they have a many-to-many relationship. To get these, we once again send a GET request to
        // the folder-to-tag endpoint.
        const fetchFolderTagRelations = fetch('http://localhost:3000/folder-to-tag')
            // Then we convert them to Javascript objects to be used in the next chain.
            .then(response => response.json())
            // If there was an error, log it to the console.
            .catch(err => console.log('Failed to get relations'));

        // Promise.all is a built in method which takes in an array of promises, which we have just
        // created, and moves on to the next chain in the promise if and only if all of the promises
        // in the array have been fulfilled.
        Promise.all([fetchFolders, fetchTags, fetchFolderTagRelations])
            // Once all three promises are fulfilled, we pass in the folders, tags and relations in 
            // a data object.
            .then(data => {

                // Storing all the data in constants for easier use
                const folders = data[0];
                const tags = data[1];
                const relations = data[2];

                // Now we want to add any tags to folders that have it. To do this, we loop through
                // the folders...
                folders.forEach(folder => {
                    // Then we get rid of any relations that aren't relevant to this folder. We achieve
                    // this by comparing the folder ID in the relation to the current folders ID.
                    const filteredRelations = relations.filter(relation => (relation.folder_id === folder.id) ? true : false);
                    // Then for each relation left after filtering.
                    filteredRelations.forEach(relation => {
                        // Loop through each tag...
                        tags.forEach(tag => {
                            // If the tag's ID matches the relations tag ID then add it to the folder
                            // using the addTag method in the Folder class.
                            if (tag.id === relation.tag_id) {
                                folder.addTag(tag);
                            }
                        })
                    })

                })
            })
            // If there was an error, then catch it and log it to the console.
            .catch(err => console.log(err));
    }

    // Create folder tree is a method used earlier on when we fetch the folders from the database. It
    // takes in the array of folders as a parameter.
    createFolderTree = folders => {

        // Creating a new instance of a Tree, with a root node of key 0 and a max node count of 50.
        // There will be 40 folders for the purposes of my applicationo, but the extra 10 is just for
        // safety measures
        const folderDirectoryTree = new Tree(new TreeNode(0), 50);

        // For each folder...
        folders.forEach(folder => {
            // If the parent ID is not null then we want to add it to the Tree.
            if (folder.parentId !== null) {
                // We do this by creating a temporary tree node with the folder ID, this will be added
                // later on.
                let tempTreeNode = new TreeNode(folder.id);
                // Then we utilise the BFS method on the tree to find the node with the ID of the parent
                // folder. Once we have found it, we can use the addChild method to add the Node that
                // we have just created.
                folderDirectoryTree.breadthFirstTraversal(folder.parentId).addChild(tempTreeNode);
            }
        })

        // After all of this is done, we can return the tree so that it can be stored in the state.
        return folderDirectoryTree;

    }

    // The get notes method takes a folder as input and returns the notes that belong to that folder.
    getNotes = folder => {
        // It does this by sending a GET request to the notes endpoint of the API, passing in the folders
        // ID as a parameter.
        fetch(`http://localhost:3000/notes/folder-id=${folder.id}`)
            // Converting the response to a Javascript object.
            .then(response => response.json())
            .then(data => {
                // Creating a new instance of the Note Array class to store the incoming notes.
                const notes = new NoteArray();

                // For each of the note objects that came from the API, we want to add a new instance
                // of the Note class to the Note Array.
                data.forEach(noteObject => {
                    notes.addNote(new Note(
                        noteObject.note_id,
                        noteObject.note_path,
                        noteObject.note_name,
                        noteObject.author_id,
                        noteObject.folder_id
                    ))
                })

                // Finally we update the state with the new Note Array that we have created.
                this.setState({ notes: notes });
            })
    }

    // This method is for when the user presses the return button on the topic table.
    goToParentFolder = () => {
        // In order to return to the parent folder, we use the stack which has stored the path of folders
        // in order to go back.
        this.setState(state => {
            // First we store the current stack in a temporary constant so we can adjust it.
            const tempStack = state.folderPathStack;
            // We apply the pop method to the temporary stack to remove the current folder and go to
            // the parent folder.
            tempStack.pop();
            // Finally we set the folder path stack state to this temporary stack that we have created.
            return {
                folderPathStack: tempStack
            };
        // After updating the state, we run the getNotes method in a callback function so that we can
        // get the notes belonging to this folder that we have just moved to. We access this folder by
        // utilising the .top method on the stack.
        }, () => this.getNotes(this.state.folderPathStack.top()));
    }

    // This is the method used if the user has clicked on a child folder and wants to traverse to it.
    // This method takes in this child folder as a parameter.
    goToSelectedFolder = folder => {
        // To go to this folder, we need to update the folder path stack in the state.
        this.setState(state => {
            // Similarly to before, we create a temporary stack which is a copy of the state's stack.
            const tempStack = state.folderPathStack;
            // Then we add the folder to the stack with the .push method.
            tempStack.push(folder);
            // Finally we update the folder path stack to be the new stack that we have just created.
            return {
                folderPathStack: tempStack
            }
        // Once the state has been properly updated, we can get the notes belonging to this new folder.
        }, () => this.getNotes(this.state.folderPathStack.top()));
    }

    // Finally, we need a method to route the user to the notes page after they have clicked on it.
    // This method takes in an event parameter. This is used to find out the ID of the notes that we
    // have to view, since the ID is stored in the HTML ID attribute of the table row.
    goToNotesPage = event => {

        // First, we update the current folder state in the App component by passing in the result of
        // the .top method for the folder path stack.
        this.props.updateCurrentFolder(this.state.folderPathStack.top());

        // Then we need to update the current note state as well. For this we use the getNoteById method
        // on the Note Array class, passing in the ID of the Note to the updateCurrentNote method given
        // to the Topic Table component as a prop.
        this.props.updateCurrentNote(
            this.state.notes.getNoteById(event.target.id)
        );

        // Finally we use the changeRoute prop to change the route to the 'notes' route so that the
        // user can view them.
        this.props.changeRoute('notes');

    }

    // Update methods so that the state can detect the options that the user has selected.
    updateSearch = event => this.setState({ searchBarText: event.target.value });

    updateHideSections = event => this.setState({ hideSections: event.target.checked });

    updateHideEmptyFolders = event => this.setState({ hideEmptyFolders: event.target.checked });

    updateOrderByOption = event => this.setState({ orderByOption: event.target.id })

    // Updating the tags takes a little more work than the others.
    updateTagAtIndex = (event, index) => this.setState(state => {
        // First we create a temporary variable for the current tags stored in the state.
        let tempTags = state.tags;
        // Then we grab the tag we need using the index passesd in to the method.
        const tempTag = tempTags[index];
        // We use the toggleActive method in the Notes class to change the active property.
        tempTag.toggleActive();
        // We set the item at the index to be the newly updated tag.
        tempTags[index] = tempTag;
        // Finally we set the state to be the updated tags array.
        return { tags: tempTags };
    })

    // Render method for TopicTable
    render() {

        // Storing the state in variables for easier use.
        const { notes, folderArray, folderPathStack, tags } = this.state;

        // Getting all the folders from the folderArray. This returns them in the form required by the
        // user. See the Folder Array class for more details on how this is achieved. For the purposes
        // of this component, just know that the getFolders method has already filtered and ordered
        // the folders.
        const folders = folderArray.getFolders(this.state);

        // If the folders hav not been fetched then don't render the table and show a loading screen
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
                                notes.getNotes().map((note, i) => {
                                    return (
                                        <tr key={i}>
                                            <td colSpan={2}>{note.name}</td>
                                            <td id={note.id} onClick={this.goToNotesPage}>View</td>
                                            <td>notes</td>
                                        </tr>
                                    );
                                })
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
                    {
                        (this.props.currentUser.canPost || this.props.currentUser instanceof Teacher) &&
                        <Button variant="success" onClick={() => {
                                this.props.updateCurrentFolder(folderPathStack.top());
                                this.props.changeRoute('add-notes');
                        }}>Add Notes</Button>
                    }
                </div>
            );
        }
    }
}