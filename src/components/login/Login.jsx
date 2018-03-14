import React from 'react';
import {AuthService} from './auth-service'

export class Login extends React.Component {

    constructor(props){
        console.log("login constructor called");
        super(props);
        this.state = {
            loggedOn: false,
            userName: ''
        }
    }


    componentDidMount = () => {
        
        // window.addEventListener('loggedOn', (e) => {
        //     this.updateUser(e.detail.user);
        // });
        this.authService = new AuthService();

        if(this.authService.isLoggedOn()){
            this.updateUser(this.authService.getUsername());
        }
    }



    texts = {
        'login': {
            'en': { value: 'Log in / Sign up' },
            'sv': { value: 'Logga in' },
            'de': { value: 'Anmelden / Registrieren' }
        },
        'logOut': {
            'en': { value: 'Log out' },
            'sv': { value: 'Logga ut' },
            'de': { value: 'Abmelden' }
        },
    };

    updateUser = (user) => {
        this.setState({ userName: user, loggedOn: true});
    }

    translate = (textId) => {
        let text = this.texts[textId];
        return text[this.props.culture.language].value;
    }

    login = () => {
        this.authService.signIn();        
    }

    logout = () => {
        this.authService.signOut();
    }

    render() {
        const { loggedOn, userName, userAvatar } = this.state;
        return (
            loggedOn ?
                <li className="nav-item dropdown active">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                        <span style={{ marginLeft: 5 + 'px' }}>{this.state.userName}</span>
                    </a>
                    <div className="dropdown-menu">
                        <a className="dropdown-item" onClick={() => this.logout()} href="#">{this.translate('logOut')}</a>
                    </div>
                </li> :
                <li className="nav-link active">
                    <a className="nav-link" onClick={() => this.login()} href="#">{this.translate('login')}</a>
                </li>
        );
    }
}

