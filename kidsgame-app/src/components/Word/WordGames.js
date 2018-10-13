import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardText, Row, Col, Button } from 'reactstrap';

export const WordGames = (props) => {
    const texts = {
        'typing': {
            'en': { value: 'Typing' },
            'sv': { value: 'Skriva' },
            'de': { value: 'Tippen' }
        },
        'typing-desc': {
            'en': { value: 'Type the displayed word to practive writting on your keyboard' },
            'sv': { value: 'Skriva orden du ser' },
            'de': { value: 'Tippe das gezeigte Wort ab' }
        },
        'lowerCase': {
            'en': { value: 'Lower Case Letters' },
            'sv': { value: 'Små Bokstäver' },
            'de': { value: 'Kleine Buchstaben' }
        },
        'lowerCase-desc': {
            'en': { value: 'Type the lower case letter that is displayed to learn how which upper and lower case character belong together' },
            'sv': { value: 'Skriv den små bokstäver som visas för att få reda på hur stor bokstaven ser ut' },
            'de': { value: 'Tippe die gezeigten Buchstaben ab um kleine und grosse Buchstaben zuordnen zu können' }
        },
        'play': {
            'en': { value: 'Play' },
            'sv': { value: 'Start' },
            'de': { value: 'Los geht\'s' }
        },
    };

    const translate = (textId) => {
        let text = texts[textId];
        return text[props.culture.language].value;
    }

    return (
        <div className="container game">
            <Row>
                <Col sm="6">
                    <Card body>
                        <CardTitle>{translate('typing')}</CardTitle>
                        <CardText>{translate('typing-desc')}</CardText>
                        <Button tag={Link} to="/word/typing1">{translate('play')}</Button>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card body>
                        <CardTitle>{translate('lowerCase')}</CardTitle>
                        <CardText>{translate('lowerCase-desc')}</CardText>
                        <Button tag={Link} to="/word/lowerCase">{translate('play')}</Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

