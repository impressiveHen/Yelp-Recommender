import React, { useState, useEffect } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container'
import { Row, Col, Image } from 'react-bootstrap'
import axios from 'axios'
import { useHistory } from "react-router-dom";

import { API_KEY, initialData } from '../Config';
import YelpBackGround from '../Assets/yelp-black.jpg';
import './StartPage.css'

const StartPage = (props) => {
    const [carIndex, setCarIndex] = useState(0);
    const [details, setDetails] = useState(initialData)

    const history = useHistory();

    const handleSelect = (selectedIndex) => {
        setCarIndex(selectedIndex);
    };

    useEffect(() => {
        props.idData.forEach(id => {
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
    }, [props.idData])

    return (
        <div className='wrapper'>
            <div style={{ justifyContent: 'center', marginBottom: '1em' }} className="d-flex flex-row">
                <Image src={YelpBackGround} style={{ width: '10em', height: '6em', marginRight: '0.5em' }} roundedCircle />
                <p className="title">Select a restaurant you like!</p>
            </div>
            <Container>
                <Row>
                    <Col xs={1} md={2}></Col>
                    <Col xs={4} md={8}>
                        <Carousel activeIndex={carIndex} onSelect={handleSelect} className="carousel">
                            {details.map((detail, index) => {
                                return (
                                    <Carousel.Item className="carousel-item" key={index}>
                                        <img
                                            style={{ width: '100%', height: '25em' }}
                                            src={detail.image_url}
                                            alt="slide"
                                            onClick={() => {
                                                history.push({
                                                    pathname: "/recomm",
                                                    state: { selectedId: details[carIndex].id }
                                                });
                                            }}
                                        />
                                        <Carousel.Caption style={{ color: '#00BFFF', fontSize: '2em' }}>
                                            <h3>{'Name: ' + detail.name}</h3>
                                            <h3>{'Location: ' + detail.location.state + ', ' + detail.location.city}</h3>
                                            <h3>{'Category: ' + detail.categories[0].title}</h3>
                                            <h3>{'Rating: ' + detail.rating}</h3>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                )
                            }
                            )}
                        </Carousel>
                    </Col>
                    <Col xs={1} md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default StartPage;