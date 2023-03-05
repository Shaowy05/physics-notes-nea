import React from "react";
import './FilterCard.css';

import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';

export default class FilterCard extends React.Component {

    constructor() {
        super();

        this.state = {
            open: false,
        }

    }

    render() {

        const { open } = this.state;
        const { 
            updateSearch, updateHideSections, updateHideEmptyFolders, updateOrderByOption,
            tags, updateTagAtIndex 
        } = this.props;

        // The different ways to order the folders, stored in an array.
        // This allows for us to use the .map function to more efficiently
        // display the radio checkboxes.
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