import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import { Row } from 'react-bootstrap'

import { API_KEY } from '../Config';

const Recomm = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const recPar = { "resId": props.location.state.selectedId, "number": 4 }
        setIsLoading(true);
        fetch('http://127.0.0.1:5000/Yelp/',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(recPar)
            })
            .then(response => response.json())
            .then(response => {
                console.log(response.result)
                response.result.forEach(id => {
                    axios.get(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${id}`, {
                        headers: {
                            Authorization: `Bearer ${API_KEY}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then((res) => {
                        setDetails((details) => [...details, res.data])
                    }).catch((err) => {
                        console.log(err);
                    })
                })
                setIsLoading(false);
            });
    }, [props.location.state.selectedId])

    if (isLoading) {
        return (
            <h1 style={{ textAlign: 'center', marginTop: '20%' }}>......loading recommendations</h1>
        )
    }
    else {
        console.log(details)
        return (
            <div className="recomm-list">
                <Container>
                    <Row>
                        {
                            details.map((detail) => {
                                return (
                                    <div
                                        className="card-wrapper"
                                        key={detail.id}
                                        style={{
                                            width: "15em",
                                            margin: "auto",
                                            marginTop: "2rem",
                                            borderStyle: "solid",
                                            borderWidth: "0.4em",
                                            borderColor: "#B22222"
                                        }}
                                    >
                                        <Card>
                                            <Card.Img
                                                variant="top"
                                                src={detail.image_url}
                                                style={{
                                                    background: "#d6d6c2",
                                                    width: "100%",
                                                    height: "15em"
                                                }}
                                            />
                                            <Card.Body style={{ width: '100%' }}>
                                                <ListGroup className="flush">
                                                    <ListGroup.Item>{'Name: ' + detail.name}</ListGroup.Item>
                                                    <ListGroup.Item>{'Location: ' + detail.location.state + ', ' + detail.location.city}</ListGroup.Item>
                                                    <ListGroup.Item>{'Category: ' + detail.categories[0].title}</ListGroup.Item>
                                                    <ListGroup.Item>{'Rating: ' + detail.rating}</ListGroup.Item>
                                                </ListGroup>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                );
                            })
                        }
                    </Row>
                    <Row>
                        <Button
                            variant="primary"
                            onClick={() => history.goBack()}
                            style={{ margin: "auto", marginTop: "2em", fontSize: '2em' }}
                        >
                            GO BACK TO SELECTION PAGE
                        </Button>
                    </Row>

                </Container>
            </div>
        )
    }
}

export default Recomm;