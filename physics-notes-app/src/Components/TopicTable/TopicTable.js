import React from "react";

// Importing React Bootstrap Components
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";

// Importing the TreeNode class from logic
import TreeNode from "../../Logic/Tree/TreeNode";
import Tree from "../../Logic/Tree/Tree";
import Folder from "../../Logic/Folder";

export default class TopicTable extends React.Component {

    mockSections = [
        {
            sectionId: 0,
            sectionNumber: 1,
            sectionTitle: "Particles and Radiation"
        },
        {
            sectionId: 1,
            sectionNumber: 2,
            sectionTitle: "Waves and Optics"
        },
        {
            sectionId: 2,
            sectionNumber: 3,
            sectionTitle: "Mechanics and Materials"
        }
    ]

    mockTopics = [
        {
            topicId: 0,
            topicNumber: 1,
            topicTitle: "Matter and Radiation",
            sectionId: 0
        },
        {
            topicId: 1,
            topicNumber: 2,
            topicTitle: "Quarks and Leptons",
            sectionId: 0
        },
        {
            topicId: 2,
            topicNumber: 3,
            topicTitle: "Quark Phenomena",
            sectionId: 0
        },
        {
            topicId: 3,
            topicNumber: 4,
            topicTitle: "Waves",
            sectionId: 1
        },
        {
            topicId: 4,
            topicNumber: 5,
            topicTitle: "Optics",
            sectionId: 1
        }
    ]

    mockSubtopics = [
        {
            subtopicId: 0,
            subtopicCode: 1.1,
            subtopicTitle: "Inside the Atom",
            topicId: 0
        },
        {
            subtopicId: 1,
            subtopicCode: 1.2,
            subtopicTitle: "Stable and Unstable Nuclei",
            topicId: 0
        },
        {
            subtopicId: 2,
            subtopicCode: 1.3,
            subtopicTitle: "Photons",
            topicId: 0
        },
        {
            subtopicId: 3,
            subtopicCode: 1.4,
            subtopicTitle: "Particles and Antiparticles",
            topicId: 0
        },
        {
            subtopicId: 4,
            subtopicCode: 1.5,
            subtopicTitle: "Particle Interactions",
            topicId: 0
        },
        {
            subtopicId: 5,
            subtopicCode: 2.1,
            subtopicTitle: "The Particle Zoo",
            topicId: 1
        },
        {
            subtopicId: 1,
            subtopicCode: 2.2,
            subtopicTitle: "Particle Sorting",
            topicId: 1
        },
        {
            subtopicId: 1,
            subtopicCode: 2.3,
            subtopicTitle: "Leptons at Work",
            topicId: 1
        },
    ]

    constructor() {
        super();
        this.state = {
            // Folder array stores each folder at the index
            // specified by its key in the tree
            folderArray: [],
            // The tree for structuring the folders. Max node
            // initially set to 1.
            folderDirectoryTree: new Tree(new TreeNode(0), 50)
        }
    }

    // After the table is rendered
    componentDidMount() {

        const { folderArray, folderDirectoryTree } = this.state;

        // Adding the root node to folder array
        folderArray[0] = new Folder(0, 0, '~', 'root', 0);

        // Counter to give unique values. Initially 1, as 0
        let keyCounter = 1;

        fetch('http://localhost:3000/folders/sections', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                parent_id: 0
            })
        })
        .then(response => response.json())
        .then(sections => sections.forEach(section => {
            // Adding the section to the folder array
            folderArray[keyCounter] = new Folder(
                section.section_id,
                section.section_number,
                section.section_title,
                'section',
                keyCounter
            )

            // Adding its respective node to the tree
            folderDirectoryTree.getRootNode().addChild(new TreeNode(keyCounter));

            // Increment keyCounter
            keyCounter++;
        })).then(() => {
            folderArray.forEach(folder => {
                if (folder.type === 'section') {
                    fetch('http://localhost:3000/folders/topics', {
                        method: 'post',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            parent_id: folder.id
                        })
                    })
                    .then(response => response.json())
                    .then(topics => {
                        topics.forEach(topic => {
                            // Create the folder for the topic
                            folderArray[keyCounter] = new Folder(
                                topic.topic_id,
                                topic.topic_number,
                                topic.topic_title,
                                'topic',
                                keyCounter
                            )

                            // Find the node with the parent folder
                            const parentFolderNode = folderDirectoryTree.breadthFirstTraversal(folder.key);
                            // If the node is found then add a new node for the
                            // folder
                            if (parentFolderNode !== false) {
                                parentFolderNode.addChild(new TreeNode(keyCounter));
                            }

                            keyCounter++;
                        })
                });
            }
        });
    }).then(console.log(folderDirectoryTree.breadthFirstTraversal()));

        /* // Repeat for topics and subtopics
        fetch('http://localhost:3000/folders/topics', {

        })
            .then(response => response.json())
            .then(topics => topics.forEach(topic => {
                // Adding the topic to the folder array
                folderArray[keyCounter] = new Folder(
                    topic.topic_id,
                    topic.topic_number,
                    topic.topic_title,
                    keyCounter
                )
                // Increment keyCounter
                keyCounter++;
            }));

        
        fetch('http://localhost:3000/folders/subtopics')
            .then(response => response.json())
            .then(subtopics => subtopics.forEach(subtopic => {
                // Adding the subtopic to the folder array
                folderArray[keyCounter] = new Folder(
                    subtopic.subtopic_id,
                    subtopic.subtopic_number,
                    subtopic.subtopic_title,
                    keyCounter
                )
                // Increment keyCounter
                keyCounter++;
            })).then(console.log(this.state.folderArray)); */

        

    }

    // Gets all of the topics and stores it in the state

    // Render method for TopicTable
    render() {

        // Returning Topic Table
        return (
            <Table striped bordered hover responsive='md'>
                <thead>
                    <tr>
                        <th>Topic Number</th>
                        <th>Topic Name</th>
                        <th>Notes</th>
                        <th>Questions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Section 1 - Particles and Radiation */}
                    <tr>
                    </tr>
                </tbody>
            </Table>
        );
    }
}