import React from 'react';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import User from '../../Logic/User';

import './NoteCard.css';
import ForumCard from '../ForumCard/ForumCard';

export default class NoteCard extends React.Component {
    
    constructor() {
        super();

        this.state = {
            imageUrl: null,
            author: null
        }

    }

    componentDidMount() {
        const { note } = this.props;

        const getImage = fetch(`http://localhost:3000/notes/image/${note.id}`)
            .then(response => response.json())
            .then(data => {

                if (!data.success) {
                    throw Error('Failure while attempting to get notes');
                }

                return new Promise((resolve, reject) => {
                    resolve(data.imageUrl);
                    reject('Failed to get notes');
                })
            })
            .catch(err => console.log(err));

        const getAuthor = fetch(`http://localhost:3000/users/${note.authorId}`)
            .then(response => response.json())
            .then(data => new Promise((resolve, reject) => {
                console.log(data);
                const author = new User(
                    data.user.user_id,
                    data.user.first_name,
                    data.user.last_name,
                    data.user.can_post,
                    data.user.intake,
                    data.user.private,
                    data.user.num_of_posts
                );
                
                resolve(author);
                reject('Failed to create user');

            }))
            .catch(err => console.log(err));

        Promise.all([getImage, getAuthor])
            .then(data => {
                const [ imageUrl, author ] = data;

                this.setState({ author: author, imageUrl: imageUrl });

            })

    }

    render() {

        const { note, parentFolder } = this.props;
        const { author, imageUrl } = this.state;

        if (imageUrl === null || author === null) {
            return(
                <div className={'centralise'}>
                    <h1>Getting the Notes...</h1>
                    <div className={'loader'}></div>
                </div>
            );
        }

        else {
            console.log(author.isPrivate)
            return(
                <div>
                    <Container>
                        <Row className={'d-flex justify-content-center'}>
                        <Col md={8} lg={6} xs={12}>
                            <Card className={'shadow'}>
                                <Card.Img src={imageUrl} />
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Header>Information</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                    {
                                        (!author.isPrivate) ?
                                            `Posted By ${author.getFullName()} `
                                        :
                                            'Posted By Private User '
                                    }
                                    To {parentFolder.title}
                                    </Card.Text>

                                    <ForumCard parentNote={note} />

                                </Card.Body>
                            </Card>
                        </Col>
                        </Row>
                    </Container>
                </div>
            );
        }

    }

}