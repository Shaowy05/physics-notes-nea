import React from "react";

import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

export default class FilterCard extends React.Component {

    constructor() {
        super();

        this.state = {
            open: false,

            standardSearchText: '',
            authorSearchText: '',

            orderBy: ''

        }

    }

    render() {

        const { open } = this.state;

        return(
            <Card>
                <Card.Header 
                    onClick={() => this.setState({ open: !open })}
                    aria-controls="filter-settings"
                    aria-expanded={open}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <p id="filter-card-header-text">Filters</p>
                    </Card.Header>
                <Collapse in={open}>
                    <Card.Text>
                        Filter text
                    </Card.Text>
                </Collapse>
            </Card>
        );

    }

}