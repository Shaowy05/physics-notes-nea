import React from "react";

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class ProfileCard extends React.Component {

    render() {

        const { user } = this.props;

        return (
            <div>
                <Container>
                    <Row className={'d-flex justify-content-center'}>
                    <Col md={8} lg={8} xs={12}>
                        <Card className={'shadow'}>
                            <Card.Header style={{ textAlign: 'center' }}>
                                {user.getFullName()}'s Profile
                            </Card.Header>
                        </Card>
                    </Col>
                    </Row>
                </Container>
            </div>
        );

    }

}