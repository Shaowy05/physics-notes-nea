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
/*             rootNode: new TreeNode(0, []),
            sectionNodes: [],
            topicNodes: [],
            subtopicNodes: [] */

            topicDirectory: new Tree(new TreeNode({
                id: 0,
                number: 0,
                title: "~"
            }, []))
        }
    }

    // Methods to populate the tree
    createTree(sections, topics, subtopics) {
    }

    // After the table is rendered
/*     componentDidMount() {
        // Destructuring state
        const { rootNode } = this.state

        // Populating tree
        this.mockDirectory.sections.forEach(section => {

            // Each node has data which is an object with the
            // number and title of the given section/topic            
            let sectionData = {
                number: section.number,
                title: section.title
            }

            // Populating the children array with the topics
            let sectionChildren = section.topics.forEach(topic => {

                let topicData = {
                    number: topic.number,
                    title: topic.title
                }

                let topicNode = new TreeNode(topicData, []);

                return topicNode;

            })

            // Create a temporary node
            let sectionNode = new TreeNode(sectionData, sectionChildren);

            // Add the section to the root node
            root.addChild(sectionNode);

        })

        console.log(root);

    } */

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