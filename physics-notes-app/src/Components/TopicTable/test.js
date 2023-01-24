import Folder from "../../Logic/Folder";

const addFolders = folderObjects => {
    return new Promise((resolve, reject) => {
        try {
            
            const folders = folderObjects.map(folderObject => {
                return new Folder(
                    folderObject.id
                )
            })

        } catch (error) {
            reject('An error occurred while adding folders');
        }
    })
}

const fetchSections = fetch('http://localhost:3000/folders/sections')
    .then(res => res.json())
    .then()