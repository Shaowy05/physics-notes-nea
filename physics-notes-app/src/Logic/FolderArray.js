// The FolderArray class is used as a data structure to store folders.
// This class is needed in order to implement sorting based off of
// more obscure properties such as titles and author.

import mergeSort from "./Algorithms/MergeSort";

const ALPHABET_MAX_DEPTH = 1;

export default class FolderArray {

    constructor(folders) {

        this.folders = folders;

    }

    // Filtering the folders - the following method is used to return
    // a version of the folder array which is filtered.
    getFilteredFolders = state => {
        const { 
            searchBarText,
            hideSections, 
            hideEmptyFolders 
        } = state;
        let filteredFolders = new FolderArray([]);

        const currentFolder = state.folderPathStack.top();
        const currentTreeNode = state.folderDirectoryTree.breadthFirstTraversal(currentFolder.id);
        const folders = this.folders;

        // There are 2 cases for displaying the folders:
        // 1. The sections are hidden, allowing the user to view
        //    the topics without having to navigate.
        // 2. The sections are not hidden, i.e rendering regularly.
        // The state holds a boolean called hideSections that decides
        // which option should occur.

        if (hideSections && currentFolder.type !== 'topic') {
            filteredFolders.folders = folders.filter(folder => {
                return folder.type === 'topic' ? true : false;
            })

        } else {
            filteredFolders.folders = folders.filter(folder => {
                let isChildOfCurrentFolder = false;
                currentTreeNode.getChildren().forEach(childNode => {
                    if (childNode.key === folder.id) {
                        isChildOfCurrentFolder = true;
                    }
                })
                return isChildOfCurrentFolder;
            })
        }

        // Then we check to see if empty folders should be removed.
        if (hideEmptyFolders) {
            filteredFolders.folders = filteredFolders.folders.filter(folder => folder.hasNotes);
        }

        // If there is any text in the search bar, filter by name
        if (searchBarText !== '') {
            filteredFolders.folders = filteredFolders.folders.filter(folder => folder.title.toLowerCase().includes(searchBarText.toLowerCase()));
        }

        return filteredFolders;

    }

    getOrderedFolders = (state, folders) => {

        // There are multiple ways to order the folders, defined by the 
        // orderByOption in the state which is passed in here as a parameter.
        const { orderByOption } = state;

        // To order the folders, we need to give each folder a sort value that
        // allows us to run the mergesort. This sort value will depend on the
        // type of sorting we want to do and also the position at which the item should fall.
        // I'm going to achieve this by making an object keys of sort value.

        const sortValues = new Array();
        const folderSortValuePairs = {};

        switch (orderByOption) {

            case 'Title':
                folders.forEach(folder => {
                    sortValues.push(this.getAlphabeticalSortValue(folder.title, ALPHABET_MAX_DEPTH));
                });
                break;

            default:
                folders.forEach(folder => {
                    sortValues.push(folder.id);
                })

        }

        console.log(sortValues);

        for (let i = 0; i < this.folders.length; i++) {
            folderSortValuePairs[sortValues[i]] = this.folders[i];
        }

        const orderedSortValues = mergeSort(sortValues);

        const orderedFolders = new FolderArray([]);

        orderedSortValues.forEach(sortValue => orderedFolders.folders.push(folderSortValuePairs[sortValue]));

        return orderedFolders;

    }

    getAlphabeticalSortValue = (title, maxDepth) => {
        // Getting the alphabetical sort value works as such:
        // Iterate from the first character through the title, until you have
        // examined a number of characters indicated by maxDepth - this is
        // how many letters into the title the function will search.
        // Get the unicode representation of these 5 characters, multiply it
        // by a power of 10, respective to its position in the title
        // and then add all of them together. This way, the word 'aab'
        // will have a larger sortValue than 'aaa'.

        let sortValue = 0;

        const lowerCaseTitle = title.toLowerCase();
        for (let i = 0; i < maxDepth; i++) {
            sortValue += lowerCaseTitle.charCodeAt(i) * (10 ** i);
        }

        return sortValue;

    }

    getFinalFolders = state => {
        let folders = this.folders;
        folders = this.getFilteredFolders(state);
        
        if (state.orderByOption !== '') {
            folders = this.getFinalFolders(state);
        }

        return folders;
    }

}