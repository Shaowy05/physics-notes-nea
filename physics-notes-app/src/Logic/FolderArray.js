// The FolderArray class is used as a data structure to store folders.
// This class is needed in order to implement sorting based off of
// more obscure properties such as titles and author.
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
            hideEmptyFolders, 
            orderByOption
        } = state;
        let filteredFolders;

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
            filteredFolders = folders.filter(folder => {
                return folder.type === 'topic' ? true : false;
            })
        } else {
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

        // Then we check to see if empty folders should be removed.
        if (hideEmptyFolders) {
            filteredFolders = filteredFolders.filter(folder => folder.hasNotes);
        }

        // If there is any text in the search bar, filter by name
        if (searchBarText !== '') {
            filteredFolders = filteredFolders.filter(folder => folder.title.toLowerCase().includes(searchBarText.toLowerCase()));
        }

        filteredFolders = (orderByOption !== '') ? this.orderFolders(filteredFolders) : filteredFolders; 

        return filteredFolders;

    }

}