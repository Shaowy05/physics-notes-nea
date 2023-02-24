import React from 'react';

export default class NoteCard extends React.Component {

    componentDidMount() {

    }

    render() {

        const { note } = this.props;

        return (
            <div>
                <img src={note.path} />
            </div>
        );
    }

}