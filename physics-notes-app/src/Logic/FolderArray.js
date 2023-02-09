// The FolderArray class is used as a data structure to store folders.
// This class is needed in order to implement sorting based off of
// more obscure properties such as titles and author.

import mergeSort from "./Algorithms/MergeSort";

const ALPHABET_MAX_DEPTH = 2;

export default class FolderArray {

    constructor(folders) {

        // By default sort the folders by ID
        this.folders = this.orderFoldersById(folders);

    }

    // filterFolders takes an array of folders and removes folders, based off of
    // the information passed in as a parameter.
    filterFolders = (folders, currentFolder, folderDirectoryTree, searchBarText, hideSections, hideEmptyFolders) => {

        const currentTreeNode = folderDirectoryTree.breadthFirstTraversal(currentFolder.id);

        // Initialise the filtered folders array. This is to be returned at the
        // end of the method.
        let filteredFolders;

        // Hiding Sections -
        if (hideSections && currentFolder.type !== 'topic') {
            filteredFolders = folders.filter(folder => folder.type === 'topic' ? true : false);
        }
        // Or getting the child folders of the selected node -
        else {
            filteredFolders = folders.filter(folder => {
                let isChildOfCurrentFolder = false;
                currentTreeNode.getChildren().forEach(childNode => {
                    if (childNode.key === folder.id) {
                        isChildOfCurrentFolder = true;
                    }
                })
                return isChildOfCurrentFolder;
            })
        }

        // Hiding Empty Folders -
        if (hideEmptyFolders) {
            filteredFolders = filteredFolders.filter(folder => folder.hasNotes);
        }

        // Filtering by text -
        if (searchBarText !== '') {
            filteredFolders = filteredFolders.filter(folder => folder.title.toLowerCase().includes(searchBarText.toLowerCase()));
        }

        // Finally return the folders
        return filteredFolders;

    }

    // Ordering the folders -
    orderFolders = (folders, orderByOption) => {

        let orderedFolders;

        // Select which function to run using a switch case statement
        switch (orderByOption) {

            case 'Number':
                orderedFolders = this.orderFoldersByNumber(folders);
                break;

            default:
                orderedFolders = this.orderFoldersById(folders);

        }

        return orderedFolders;
        
    }

    // Ordering the folders by their id. This method is special,
    // as by default this is run. This is also run after each
    // other ordering method, i.e. if 2 folders are indistinguishable
    // they should by default be ordered by their ID.
    orderFoldersById = folders => {

        let orderedFolders = [];
        let idArray = [];

        // Create an object with key value pairs. The key is the id
        // of the folder and the value is the folder itself. This way
        // the ids can be sorted without the overhead information of
        // the folder.
        const idToFolder = {};

        folders.forEach(folder => {
            // Add the id to folder pair
            idToFolder[folder.id] = folder;

            // Add the id to the idArray
            idArray.push(folder.id);
        })

        // Sort the IDs
        idArray = mergeSort(idArray);

        // Push the respective folders into orderedFolders using the sorted
        // IDs.
        idArray.forEach(id => orderedFolders.push(idToFolder[id]));

        return orderedFolders;

    }

    // Order folders by number.
    orderFoldersByNumber = folders => {

        // Currently there are no folders that have overlapping numbers that
        // can appear at the same time, as folders and sections can't be displayed
        // simultaneously, but in the future this may not be the case.
        // Because of this, we need to ensure that folders with the same number
        // are then ordered by ID afterwards.

        let orderedFolders = [];

        // numberToFolders is an object similar to idToFolder from above, but
        // here each value will be an array of folders that all share the same
        // folder number. These will all then be individually sorted.
        const numberToFolders = {};

        folders.forEach(folder => {
            
            // If there is no entry for this folders number, then
            // create a new key-value pair
            if (numberToFolders[folder.number] === undefined) {
                numberToFolders[folder.number] = [folder];
            }
            // Otherwise, if there is already a key
            else {
                numberToFolders[folder.number].push(folder);
            }

        })

        // Then we need to sort each individual array in the numberToFolders
        // object by ID. Here we use the previously implemented orderFoldersById
        for (const [number, folders] of Object.entries(numberToFolders)) {
            numberToFolders[number] = this.orderFoldersById(folders);
        }

        // Now we loop through each of the key value pairs in numberToFolders, and
        // concatenate the arrays to make a final sorted array.
        Object.values(numberToFolders).forEach(folders => orderedFolders = orderedFolders.concat(folders));

        return orderedFolders;

    }

    orderFoldersByTitle = folders => {

    }

    // getFolders is a method to return the folders in adjusted form.
    getFolders = state => {

        const {
            searchBarText,
            hideSections,
            hideEmptyFolders,
            orderByOption
        } = state;

        const currentFolder = state.folderPathStack.top();
        const folderDirectoryTree = state.folderDirectoryTree;

        let folders = this.folders;

        // Filter the folders
        folders = this.filterFolders(folders, currentFolder, folderDirectoryTree, searchBarText, hideSections, hideEmptyFolders);

        // Order the folders
        folders = this.orderFolders(folders, orderByOption);

        return folders;

    }

}