import React from "react";

// Importing React Bootstrap Components
import Table from "react-bootstrap/Table";

export default class TopicTable extends React.Component {
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
            </Table>
        );
    }
}