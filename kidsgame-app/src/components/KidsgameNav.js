import React from 'react';
import { Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import { CultureSelector } from './CultureSelector';

import { PROGRESSCHANGED } from '../utils/kidsgame-api';
import { login, logout, isLoggedIn } from '../utils/auth-service';

import brand from './assets/images/brand.svg';

export class KidsgameNav extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            points: 0
        };
        this.props.eventEmitter.on(PROGRESSCHANGED, (points) => {
            this.setState({
                points: points
            })
        });
    }

    texts = {
        'math': {
            'en': { value: 'Math' },
            'sv': { value: 'Mathe' },
            'de': { value: 'Mathe' }
        },
        'words': {
            'en': { value: 'Typing' },
            'sv': { value: 'Ordlek' },
            'de': { value: 'Tippen' }
        },
        'logOut': {
            'en': { value: 'Log out' },
            'sv': { value: 'Logga ut' },
            'de': { value: 'Abmelden' }
        },
        'logIn': {
            'en': { value: 'Log in' },
            'sv': { value: 'Logga in' },
            'de': { value: 'Anmelden' }
        },
        'settings': {
            'en': { value: 'Settings' },
            'sv': { value: 'Inställnigar' },
            'de': { value: 'Einstellungen' }
        },
        'about': {
            'en': { value: 'About' },
            'sv': { value: 'Info' },
            'de': { value: 'Info' }
        },
        'progress': {
            'en': { value: 'Score' },
            'sv': { value: 'Score' },
            'de': { value: 'Punkte' }
        },
    };

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }


    translate = (textId) => {
        let text = this.texts[textId];
        return text[this.props.culture.language].value;
    }

    render() {
        return (
            <div>
                <Navbar color="primary" light expand="md">
                    <NavbarBrand href="/"><span><img src={brand} width="30" height="30" className="d-inline-block align-top" alt="" /></span> Kidsgames</NavbarBrand>
                    <Nav>
                        {
                            (isLoggedIn()) ?
                                <NavItem>
                                    <NavLink disabled>{this.translate('progress')}: {this.state.points}</NavLink>
                                </NavItem>
                                : ''
                        }
                    </Nav>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <Link className="nav-link" to="/">Home</Link>
                            </NavItem>
                            <NavItem>
                                <Link className="nav-link" to="/math">{this.translate('math')}</Link>
                            </NavItem>
                            <NavItem>
                                <Link className="nav-link" to="/word">{this.translate('words')}</Link>
                            </NavItem>
                            <NavItem>
                                <Link className="nav-link" to="/about">{this.translate('about')}</Link>
                            </NavItem>
                            {
                                (isLoggedIn()) ?
                                    <NavItem>
                                        <Link className="nav-link" to="/settings">{this.translate('settings')}</Link>
                                    </NavItem>
                                    : ''
                            }
                            <NavItem>
                                {
                                    (isLoggedIn()) ?
                                        (
                                            <NavLink onClick={() => logout()} href="#">{this.translate('logOut')}</NavLink>
                                        ) :
                                        (
                                            <NavLink href="#" onClick={() => login()} >
                                                {this.translate('logIn')}
                                            </NavLink>
                                        )
                                }
                            </NavItem>
                            <CultureSelector culture={this.props.culture} changeCulture={this.props.changeCulture} />
                        </Nav>
                    </Collapse>
                </Navbar>
            </div >
        )
    }
}
