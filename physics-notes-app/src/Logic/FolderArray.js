// The FolderArray class is used as a data structure to store folders.
// This class is needed in order to implement sorting based off of
// more obscure properties such as titles and author.

import mergeSort from "./Algorithms/MergeSort";

export default class FolderArray {

    constructor(folders) {

        // By default sort the folders by number
        this.folders = this.orderFoldersByNumber(folders);

    }

    // filterFolders takes an array of folders and removes folders, based off of
    // the information passed in as a parameter.
    filterFolders = (folders, currentFolder, folderDirectoryTree, searchBarText, hideSections, hideEmptyFolders, tags) => {

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

        // Filtering by tag -
        // First determine whether any tags are active
        const activeTags = tags.filter(tag => tag.active)
        if (activeTags.length !== 0) {
            filteredFolders = filteredFolders.filter(folder => {

                let folderHasActiveTag = false;

                activeTags.forEach(activeTag => {
                    folder.tags.forEach(folderTag => {
                        if (activeTag.id === folderTag.id) {
                            folderHasActiveTag = true;
                        }
                    })
                })

                return folderHasActiveTag;

            });
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

            case 'Title':
                orderedFolders = this.orderFoldersByTitle(folders);
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
        let numbers = [];

        folders.forEach(folder => {
            
            // If there is no entry for this folders number, then
            // create a new key-value pair
            if (numberToFolders[folder.number] === undefined) {
                numberToFolders[folder.number] = [folder];

                // And add the number to the array of numbers
                numbers.push(folder.number);

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

        // Then sort the numbers array
        numbers = mergeSort(numbers);

        // Now we iterate over the numbers array, and concatenate the folders in order
        numbers.forEach(number => {
            orderedFolders = orderedFolders.concat(numberToFolders[number]);
        });

        return orderedFolders;

    }

    // The subroutine for sorting the folders by title. This is a recursive algorithm.
    // Here characterIndex is the index of the strings to compare.
    orderFoldersByTitle = (folders, characterIndex = 0) => {

        let orderedFolders = [];
        let characterCodes = [];

        // Any folders that have already been completely looked through should be added
        // straight to orderedFolders, and removed from the folders array.
        folders = folders.filter(folder => {
                    
            // Use regex to remove spaces and make lower case.
            const correctedTitle = folder.title.toLowerCase().replace(/\s+/g, '');

            // If the title's length is the character index...
            if (correctedTitle.length === characterIndex) {
                orderedFolders.push(folder);
                return false;
            }
            // Otherwise do not remove it from the folders array
            else {
                return true;
            }

        });

        // Titles do not have inherent numerical values, and so they must be sorted
        // recursively. This function will sort a specific index of characters, so the first
        // iteration will sort the first character etc.

        const charCodeToFolders = {};

        folders.forEach(folder => {

            // Here we use regex to make all the characters lowercase and remove whitespace.
            const correctedTitle = folder.title.toLowerCase().replace(/\s+/g, '');
            const folderCharacterCode = correctedTitle.charCodeAt(characterIndex);            

            // If there is not already an entry for that character code then add it to the
            // charCodeToFolders object.
            if (charCodeToFolders[folderCharacterCode] === undefined) {
                charCodeToFolders[folderCharacterCode] = [folder];
                characterCodes.push(folderCharacterCode);
            }
            // Otherwise append it to the array
            else {
                charCodeToFolders[folderCharacterCode].push(folder);
            }
        })

        // Loop through each of the key value pairs, if the length of array of folders is
        // not 1, then sort that array with orderFoldersByTitle with an increased character
        // index.
        for (const [charCode, folders] of Object.entries(charCodeToFolders)) {
            // If the length of the array is not 1 then it needs to be sorted.
            if (folders.length !== 1) {
                // Order the folders by title with an increased characterIndex.
                charCodeToFolders[charCode] = this.orderFoldersByTitle(folders, characterIndex + 1);
            }
        }

        // Sort the character codes.
        characterCodes = mergeSort(characterCodes);

        // Concatenate all the arrays.
        characterCodes.forEach(charCode => {
            orderedFolders = orderedFolders.concat(charCodeToFolders[charCode]);
        })

        return orderedFolders;

    }

    // getFolders is a method to return the folders in adjusted form.
    getFolders = state => {

        const {
            searchBarText,
            hideSections,
            hideEmptyFolders,
            orderByOption,
            tags
        } = state;

        const currentFolder = state.folderPathStack.top();
        const folderDirectoryTree = state.folderDirectoryTree;

        let folders = this.folders;

        // Filter the folders
        folders = this.filterFolders(folders, currentFolder, folderDirectoryTree, searchBarText, hideSections, hideEmptyFolders, tags);

        // Order the folders
        folders = this.orderFolders(folders, orderByOption);

        return folders;

    }

}