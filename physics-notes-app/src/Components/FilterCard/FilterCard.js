import React from "react";
import './FilterCard.css';

import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';

// Inheriting from React.Component.
export default class FilterCard extends React.Component {

    // Constructor for the FilterCard component.
    constructor() {
        super();

        // The only state here is one called 'open'. In order to make the user's viewport display information
        // in the most efficient way possible I want them to be able to hide the Filter Card when they
        // look through the folders. The 'open' state defines whether or not this component is collapsed
        // or not.
        this.state = {
            open: false,
        }

    }

    // The render method for the Filter Card component.
    render() {

        // Getting the open state.
        const { open } = this.state;
        // Getting all of the methods used for updating the settings in the Topic Table component. These
        // will be attached to their respective buttons so that the Topic Table component can show the
        // folders that the user wants to see.
        const { 
            updateSearch, updateHideSections, updateHideEmptyFolders, updateOrderByOption,
            tags, updateTagAtIndex 
        } = this.props;

        // Currently there are only two options for ordering the folders, however with scalability in
        // mind, I wanted to make it easy to add options. For this reason, I hold the order by options
        // in an array and iterate over them in the HTML.
        const orderByOptions = ["Number", "Title"];

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
                        <div id="collapsible">
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
                                <Form.Text>Order By:</Form.Text>
                                <div id={'order-by-options'}>
                                {
                                    orderByOptions.map((orderByOption, i) => (
                                        <Form.Check
                                            key={i}
                                            inline
                                            label={orderByOption}
                                            type={'radio'}
                                            name={'orderByOptions'}
                                            id={`${orderByOption}`}
                                            onChange={updateOrderByOption}
                                        />
                                    ))
                                }
                                </div>
                                <Form.Text>Tags:</Form.Text>
                                <div id={'tag-buttons'} style={{
                                    height: '200px',
                                    overflow: 'auto'
                                }}>
                                {
                                    tags.map((tag, i) => 
                                        <ToggleButton
                                            key={i}
                                            className='m-1'
                                            type='checkbox' 
                                            variant='outline-primary'
                                            checked={tag.active}
                                            onClick={(e) => updateTagAtIndex(e, tag.index)}
                                        >
                                            {tag.name}
                                        </ToggleButton>
                                    )
                                }
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </Card>
            </div>
        );
    }
}