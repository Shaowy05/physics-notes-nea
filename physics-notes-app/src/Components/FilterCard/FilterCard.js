import React from "react";
import './FilterCard.css';

import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

export default class FilterCard extends React.Component {

    constructor() {
        super();

        this.state = {
            open: false,
        }

    }

    render() {

        const { open } = this.state;
        const { updateSearch, updateHideSections, updateHideEmptyFolders } = this.props;

        return(
            <div>
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
                        <div id="filters">
                            <InputGroup size={'sm'} className={'mb-3'}>
                                <InputGroup.Text>Search</InputGroup.Text> 
                                <Form.Control onChange={updateSearch} />
                            </InputGroup>
                            <Form.Check
                                type={'checkbox'} 
                                label={'Hide Sections'}
                                onChange={updateHideSections}
                            />
                            <Form.Check 
                                type={'checkbox'}
                                label={'Hide Empty Folders'}
                                onChange={updateHideEmptyFolders}
                            />
                        </div>
                    </Collapse>
                </Card>
            </div>
        );

    }

}