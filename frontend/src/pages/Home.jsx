import { Container, Row, Col } from 'react-bootstrap';

export default function Home() {
    return (
        <Container style={{ padding: 20 }}>
            <Row>
                <Col>
                    <h2>Home Page</h2>
                    <p>Welcome to the home page!</p>
                </Col>
            </Row>
        </Container>
    );
}