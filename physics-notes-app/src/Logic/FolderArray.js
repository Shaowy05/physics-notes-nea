// Here we import the merge sort algorithm from the algorithms folder. This function is used extensively
// throughout the program as part of ordering the folders.
import mergeSort from "./Algorithms/MergeSort";

// Exporting the folder array class to be used in the React app.
export default class FolderArray {

    // PROPERTIES ==================================================================================
    // The only propery of the Folder Array class is the folders array which stores all the folders.
    // Here we initialise this array, calling the orderFoldersByNumber method to ensure that they start
    // off ordered by number.
    constructor(folders) {

        // By default sort the folders by number
        this.folders = this.orderFoldersByNumber(folders);

    }
    // =============================================================================================

    // METHODS =====================================================================================
    // The first method is filterFolders. This has the job of taking in certain options from the web
    // app and removing any folders that don't abide by the options selected. When calling the getFolders,
    // method, this is the first operation performed on the folder array because we want to reduce the
    // workload of ordering the folders later on. All of these parameters here are options that the
    // user can adjust to get the folders that are relevant.
    filterFolders = (folders, currentFolder, folderDirectoryTree, searchBarText, hideSections, hideEmptyFolders, tags) => {

        // First we load the current node (i.e. folder) that the user is on. We need to this to grab
        // the child folders of that node, since we only want to render the folders that belong to the
        // current node. To do this we use the BFT with a search key that was implemented in the Tree
        // class.
        const currentTreeNode = folderDirectoryTree.breadthFirstTraversal(currentFolder.id);

        // Initialise the filtered folders array. This is to be returned at the
        // end of the method.
        let filteredFolders;

        // If the user has opted to hide sections, we remove them from the folder array. We also have
        // to check that the current folder is not a topic, this is so that the user can't hide the
        // sections while inside a section.
        if (hideSections && currentFolder.type !== 'topic') {
            // To filter the folders we use the built in filter function, iterating over all the folders
            // and checking the type property on the folder. If it is a topic we return true to retain
            // it, otherwise setting it to false.
            filteredFolders = folders.filter(folder => folder.type === 'topic' ? true : false);
        }
        // Otherwise, the user doesn't want to hide the sections and we want to remove any folders that
        // aren't children of the parent folder. Similarly to before we iterate over each folder and
        // check whether or not that folder is part of the children property of the current node. If
        // so then we want to retain it, otherwise we can remove it.
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

        // If the user has opted to hide empty folders, then we iterate over the remaining folders and
        // remove ones where their hasNotes property is false.
        if (hideEmptyFolders) {
            filteredFolders = filteredFolders.filter(folder => folder.hasNotes);
        }

        // If there is text in the search bar, then we want to remove any folders whose names don't
        // match the text in the search bar. Here we use the .includes method to find out whether or
        // not the title contains the search text.
        if (searchBarText !== '') {
            filteredFolders = filteredFolders.filter(folder => folder.title.toLowerCase().includes(searchBarText.toLowerCase()));
        }

        // Finally, we filter the remaining folders based off the tags that the user has selected. We
        // leave this for last because it is computationally the most strenuous. The first thing we
        // need to do is get all the tags that are 'active' i.e the user has clicked no them.
        const activeTags = tags.filter(tag => tag.active)

        // If the number of active tags is not 0, then we need to perform some logic to remove folders
        // who don't have that tag.
        if (activeTags.length !== 0) {
            // Iterate over the remaining folders, for each folder...
            filteredFolders = filteredFolders.filter(folder => {
                // Create a variable to store a boolean value, this will indicate whether or not the
                // folder has one of the active tags. Initially false.
                let folderHasActiveTag = false;
                // For each of the active tags that we retrieved earlier, we want to loop over all of
                // the tags belonging to the folder, if one of the tags matches the active tag then
                // we set the declared boolean to be true.
                activeTags.forEach(activeTag => {
                    folder.tags.forEach(folderTag => {
                        if (activeTag.id === folderTag.id) {
                            folderHasActiveTag = true;
                        }
                    })
                })

                // Finally, we return the folderHasActiveTag boolean. If the folder has one of the active
                // tags, this will be true otherwise it will be false and that folder will be removed
                // from the filteredFolders array.
                return folderHasActiveTag;

            });
        }

        // Once all of the filtering has been successfully done, we can return the array of newly filtered
        // folders so that they can go on to be ordered.
        return filteredFolders;

    }

    // This is the parent function for the other ordering functions. Here we decide what way we want
    // to order the folders. This method takes in two parameters, the folders and the way that the user
    // wants to order the folders.
    orderFolders = (folders, orderByOption) => {

        // Declaring a variable to store the final product.
        let orderedFolders;

        // Here we use a switch statement to pick the function to use. I opted for the switch statement
        // due to the compact format for handling the conditional logic. Currently there are three ways
        // to order the folders, but if this ever increased then the switch statement makes it easy
        // to add them.
        switch (orderByOption) {

            // If the user wants to order by number, then we run number variant. This is the default 
            // way to order them in the constructor.
            case 'Number':
                orderedFolders = this.orderFoldersByNumber(folders);
                break;

            // If the user wants to order by Title...
            case 'Title':
                orderedFolders = this.orderFoldersByTitle(folders);
                break;

            // Finally, if no option is passed in (or if the option is invalid) then we order them by
            // ID. This is the switch statement default due to the fact that each folder has a unique
            // ID so the odds of a failure occuring when ordering this way is quite low.
            default:
                orderedFolders = this.orderFoldersById(folders);

        }

        // Once all the ordering is done we can return the final array to the user.
        return orderedFolders;
        
    }

    // This method is needed for two different reasons. The first is in the case that the user wants
    // to order the folders by ID. The other is that, in the case that two or more folders are indistinguishable
    // from each other, either by title or by number etc, we want to order them by ID. This is because
    // the folder's ID should be unique to itself, so there should never be a case where two folders
    // are indistinguishable by ID.
    orderFoldersById = folders => {

        // Create an array to store the final ordered folders.
        let orderedFolders = [];
        // Create an array to store the IDs of the folders. This is so that we can use the merge sort
        // on the IDs rather than the actual folders themselves.
        let idArray = [];

        // We need a way of linking the IDs back to the folder it came from. The easiest way to do this
        // while maintaining constant lookup times is a javascript object. Here we create an empty one
        // that we can add key value pairs to.
        const idToFolder = {};

        // For each folder in the folders array...
        folders.forEach(folder => {
            // Add a key value pair to the object.
            idToFolder[folder.id] = folder;
            // And push the ID to the ID array.
            idArray.push(folder.id);
        })

        // Now we use the merge sort function on the ID array.
        idArray = mergeSort(idArray);

        // Using the idToFolder 'dictionary' we sequentially add the folders to the ordered folders
        // variable we created at the start, resulting in an orderd array of folders.
        idArray.forEach(id => orderedFolders.push(idToFolder[id]));

        // Finally we return the folders
        return orderedFolders;

    }

    // The method to order the folders by number
    orderFoldersByNumber = folders => {

        // Create the empty array that will store the ordered folders that is returned at the end.
        let orderedFolders = [];

        // Similarly to above, we need a 'dictionary' to link the numbers to the folder which it came
        // from. The key difference here is that, while before keys had a one to one relationship with
        // a folder, now a key has an array as its respective value. The reason for this is that some
        // folders will have the same number, and as a result the 'dictionary' will have to accomodate
        // for this scenario.
        const numberToFolders = {};
        // Here we have an array storing all the different numbers that the folders have.
        let numbers = [];

        // Looping over all the folders...
        folders.forEach(folder => {
            
            // If the number of this folder is not already in the 'dictionary' then we need to create
            // a new one.
            if (numberToFolders[folder.number] === undefined) {
                // Here we create the key for the 'dictionary' and also add a value to it. Note that
                // we are adding an array with the folder in it, not a singular folder like before.
                numberToFolders[folder.number] = [folder];

                // And add the number to the array of numbers.
                numbers.push(folder.number);

            }
            // Otherwise, if there is already a key then we want to add the folder to the array belonging
            // to the number key in the 'dictionary'.
            else {
                numberToFolders[folder.number].push(folder);
            }

        })

        // Unlike before when we could safely assume that each key only represented one folder, here
        // we need to go through each of the key-value pairs and order the arrays one by one and order
        // them. Here we loop through the key-value paires in the 'dictionary'...
        for (const [number, folders] of Object.entries(numberToFolders)) {
            // And then we apply the orderFoldersById method to it that we implemented earlier on the
            // folders belonging to the key that we are currently inspecting.
            numberToFolders[number] = this.orderFoldersById(folders);
        }

        // Once each of the individual arrays are sorted by ID, we can then sort the numbers array using
        // the merge sort function.
        numbers = mergeSort(numbers);

        // Since the numbers are ordered, and any folders with the same number are in turn ordered by
        // ID, we can now add all of the arrays to the ordered folders array.
        numbers.forEach(number => {
            orderedFolders = orderedFolders.concat(numberToFolders[number]);
        });

        // Finally, we can return the ordered folders array.
        return orderedFolders;

    }

    // Ordering by title is more difficult than ordering by number or by ID, since comparing two strings
    // is a more complicated process. As is standard, we want the folders in alphabetical order, and
    // if two words start the same, we go letter by letter until we find a disparity. Like the numbers
    // ordering method, if there is no disparity at all, i.e. the two titles are the same (which shouldn't
    // happen), then we should order the folders by ID. The orderFoldersByTitle takes two parameters
    // unlike the previous two. The first is the array of folders to sort, and the second is the character
    // index. This is the index of the character that the method is comparing, initially set to 0 so
    // that we start at the first character. We need the character index because this method is RECURSIVE
    // and will be called repetitively by this method, incrementing the character index each time.
    orderFoldersByTitle = (folders, characterIndex = 0) => {

        // Create an array to store the final ordered folders array.
        let orderedFolders = [];
        // An array of the character codes that can be sorted.
        let characterCodes = [];

        // Since this method is based off of recursion, we want to make sure that any titles that have
        // already been completely searched through are removed from the folders array and added to
        // the ordered folders, since they must come before any of the other folders.
        folders = folders.filter(folder => {
                    
            // Here we use regex and the .replace method to remove any spaces in the title, alongside
            // converting all the characters to lower case. This is because we don't want to include
            // those in our ordering.
            const correctedTitle = folder.title.toLowerCase().replace(/\s+/g, '');

            // If the new length of the title is the same as the character index, then the title has
            // been fully compared and inspected, and we can remove it from the folder and add it to
            // the ordered folders array.
            if (correctedTitle.length === characterIndex) {
                orderedFolders.push(folder);
                return false;
            }
            // Otherwise do not remove it from the folders array as it has not been completely looked
            // through yet.
            else {
                return true;
            }

        });

        // Here we create the dictionary matching the character code of the letter being inspected to
        // an array of folders with that character code. Similarly to the numbers ordering method, there
        // is no guarantee that two folders will have different letters, so each key must reference
        // an array of folders.
        const charCodeToFolders = {};

        // Looping through each one of the folders.
        folders.forEach(folder => {

            // Again we correct the title of the folder using regex.
            const correctedTitle = folder.title.toLowerCase().replace(/\s+/g, '');
            // Then we grab the character code of the letter at the index we are looking at.
            const folderCharacterCode = correctedTitle.charCodeAt(characterIndex);            

            // If there is no entry for that character code in the dictionary, then we create one and
            // assign an array, currently with only this folder in it, to its value.
            if (charCodeToFolders[folderCharacterCode] === undefined) {
                charCodeToFolders[folderCharacterCode] = [folder];
                characterCodes.push(folderCharacterCode);
            }
            // Otherwise, the character code has already been seen, and we push the folder to the array
            // instead.
            else {
                charCodeToFolders[folderCharacterCode].push(folder);
            }
        })

        // Now we need to order each of the arrays inside the dictionary. We do this by recursively
        // calling the orderFoldersByTitle method on each array. Note the base case here is when the
        // length of the array is 1, hence the array must be sorted.
        for (const [charCode, folders] of Object.entries(charCodeToFolders)) {
            // If the length of the array is not 1, then we need to order this folder by title as well.
            if (folders.length !== 1) {
                // Calling this method on this array of folders, incrementing the character index by
                // 1 so that we are now looking at the next character along.
                charCodeToFolders[charCode] = this.orderFoldersByTitle(folders, characterIndex + 1);
            }
        }

        // Once all of the folders are properly ordered by title, we can now use the merge sort function
        // on the character codes to get them in order.
        characterCodes = mergeSort(characterCodes);

        // Now we iterate over the character codes, sequentially adding their respective folders to
        // the ordered folders array.
        characterCodes.forEach(charCode => {
            orderedFolders = orderedFolders.concat(charCodeToFolders[charCode]);
        })

        // Finally we return the ordered folders array, either as the final product or for the previous
        // call of the method to use.
        return orderedFolders;

    }

    // Get folders is the method that will be called in the React app. This is the overarching method
    // which uses the state to decide what sort of actions should be done on the folders.
    getFolders = state => {

        // Here we destructure the options in the state for easier use.
        const {
            searchBarText,
            hideSections,
            hideEmptyFolders,
            orderByOption,
            tags
        } = state;

        // Now we get the current folder. This is used in the filter folders method to find the children.
        const currentFolder = state.folderPathStack.top();

        // Then we get the Tree instance for the folders, this is also used in the filter folders method.
        const folderDirectoryTree = state.folderDirectoryTree;

        // Getting the folders in the folder array.
        let folders = this.folders;

        // Running the filterFolders method to remove any folders the user doesn't want to see.
        folders = this.filterFolders(folders, currentFolder, folderDirectoryTree, searchBarText, hideSections, hideEmptyFolders, tags);

        // Running the orderFolders method to sort the folders into the form that the user wants to
        // see.
        folders = this.orderFolders(folders, orderByOption);

        // Finally we return the folders to the user.
        return folders;

    }
    // =============================================================================================

}