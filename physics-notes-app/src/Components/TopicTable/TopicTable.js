import React from "react";

// Importing React Bootstrap Components
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";

// Importing the TreeNode class from logic
import TreeNode from "../../Logic/TreeNode";

export default class TopicTable extends React.Component {

    mockDirectory = {
        sections: [
            {
                number: 1,
                title: "Particles and Radiation",
                topics: [
                    {
                        number: 1,
                        title: "Matter and Radiation",
                    },
                    {
                        number: 2,
                        title: "Quarks and Leptons",
                    }
                ]
            },
            {
                number: 2,
                title: "Waves and Optics",
                topics: [
                    {
                        number: 4,
                        title: "Waves"
                    }
                ]
            }
        ]
    };

    mockSubtopics = [
        {
            sectionnumber: 1,
            subtopicnumber: "1.1",
            subtopictitle: "Inside the Atom",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 1,
            subtopicnumber: "1.2",
            subtopictitle: "Stable and Unstable Nuclei",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 1,
            subtopicnumber: "1.3",
            subtopictitle: "Photons",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 1,
            subtopicnumber: "1.4",
            subtopictitle: "Particles and Antiparticles",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 1,
            subtopicnumber: "1.5",
            subtopictitle: "Particle Interactions",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 2,
            subtopicnumber: "4.1",
            subtopictitle: "Waves and Vibrations",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 2,
            subtopicnumber: "4.2",
            subtopictitle: "Measuring Waves",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 2,
            subtopicnumber: "4.3",
            subtopictitle: "Wave Properties 2",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 2,
            subtopicnumber: "4.4",
            subtopictitle: "Wave Properties 1",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 2,
            subtopicnumber: "4.5",
            subtopictitle: "Stationary and Progressive Waves",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 2,
            subtopicnumber: "4.6",
            subtopictitle: "More about Stationary Waves on Strings",
            notes: 0,
            questions: 0
        },
        {
            sectionnumber: 2,
            subtopicnumber: "4.7",
            subtopictitle: "Using an Oscilloscope",
            notes: 0,
            questions: 0
        }
    ]

    constructor() {
        super();
        this.state = {
            root: new TreeNode(0, [])
        }
    }

    // After the table is rendered
    componentDidMount() {
    // Destructuring state
    const { root } = this.state

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