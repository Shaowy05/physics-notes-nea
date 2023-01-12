import React from "react";

// Importing React Bootstrap Components
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";

// Importing the TreeNode class from logic
import TreeNode from "../../Logic/Tree/TreeNode";
import Tree from "../../Logic/Tree/Tree";

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
            topicDirectoryTree: new Tree(new TreeNode(0, {
                id: 0,
                number: 0,
                title: "~"
            }, 'root'))
        }
    }

    // After the table is rendered
    componentDidMount() {
        this.populateTree()
    }

    // PopulateLayer will take in 1 of sections, topics or subtopics
    // and add all of them to the tree.
    populateTree() {

        // Key Counter stores the key for each node
        let keyCounter = 1;
        const rootNode = this.state.topicDirectoryTree.getRootNode()

        // Grabbing the sections from the database
        fetch('http://localhost:3000/topicdirectory/sections')
            // After the response is received convert json to object 
            .then(response => response.json())
            // Then iterate through object and add to tree
            .then(sections => {
                sections.forEach(section => {
                    // Getting the root node and adding the sections
                    rootNode.addChild(new TreeNode(keyCounter, {
                            sectionId: section.section_id,
                            sectionNumber: section.section_number,
                            sectionTitle: section.section_title
                        }))

                    // Increment the keyCounter
                    keyCounter++;
                });
            });

            // Grabbing the topics from the database
            fetch('http://localhost:3000/topicdirectory/topics')
                .then(response => response.json())
                .then(topics => {
                    topics.forEach(topic => {
                        // Find the section that the topic belongs to
                    })
                })

    }    

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