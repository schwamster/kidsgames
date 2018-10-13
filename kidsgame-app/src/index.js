import React from 'react';
import ReactDOM from 'react-dom';
import CookieBanner from 'react-cookie-banner';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { About, Callback, Home, KidsgameNav, Logout, MathGame, WordGames, PrivateRoute, Settings, Typing1, LowerCase } from './components';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { isLoggedIn, login } from './utils/auth-service';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PROGRESSCHANGED, KidsgameApi } from './utils/kidsgame-api';
import {
    Alert,
    Button
} from 'reactstrap';

import successWav from './components/assets/sounds/success.wav';
import successMp3 from './components/assets/sounds/success.mp3';
import successOgg from './components/assets/sounds/success.ogg';


const CULTURES = [
    { culture: 'en-GB', flag: 'gb', language: 'en', voice: 'UK English Female', text: 'English (UK)' },
    { culture: 'sv-SE', flag: 'se', language: 'sv', voice: 'Swedish Female', text: 'Svenska' },
    { culture: 'de-DE', flag: 'de', language: 'de', voice: 'Deutsch Female', text: 'Deutsch' }
];


class Root extends React.Component {

    constructor(props) {
        super(props);
        this.api = new KidsgameApi();
        this.api.on(PROGRESSCHANGED, (points) => {
            console.log("great you made progress => ", points);
            this.setState({
                points: points
            });
        }
        );

        this.addProgress = this.addProgress.bind(this);
    }

    texts = {
        'loginToTrackProgress': {
            'en': { value: 'Login to track your progress' },
            'sv': { value: 'Logga in för att följa dina framsteg' },
            'de': { value: 'Melde dich an um deinen Fortschritt zu verfolgen!' }
        },
        'logIn': {
            'en': { value: 'Log in' },
            'sv': { value: 'Logga in' },
            'de': { value: 'Anmelden' }
        },
        'cookieMessage': {
            'en': { value: 'We use cookies to give you the best possible experience' },
            'sv': { value: 'Vi använder cookies för att ge dig bästa möjliga upplevelse' },
            'de': { value: 'Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu bieten' }
        },
    };

    componentDidMount() {
        this.api.getProgress();
    }

    static getCulture = (culture) => {
        let matching = CULTURES.filter(x => x.culture === culture);
        if (matching.length >= 1) {
            return matching[0];
        }
        return CULTURES[0];
    }

    state = {
        culture: Root.getCulture('en-GB')
    }

    changeCulture = (culture) => {
        this.setState({
            culture: Root.getCulture(culture)
        })
    }

    addProgress(points) {
        this.api.addProgress(points);
    }

    translate = (textId) => {
        let text = this.texts[textId];
        return text[this.state.culture.language].value;
    }

    render() {
        const {
            culture
        } = this.state;
        return (
            <div className="">
                <Router>
                    <div>
                        <div></div>
                        <KidsgameNav culture={culture} changeCulture={this.changeCulture} eventEmitter={this.api} />
                        {
                            isLoggedIn() === false ? (
                                <Alert color="secondary">
                                    {this.translate('loginToTrackProgress') + ' '}
                                    <Button color="primary" onClick={() => login()}>{this.translate('logIn')}</Button>
                                </Alert>
                            ) : (
                                    ''
                                )
                        }
                        <CookieBanner
                            message={this.translate('cookieMessage')}
                            onAccept={() => { }}
                            cookie="user-has-accepted-cookies" />
                        <Route exact path="/" component={Home} />
                        <Route exact path="/math" render={props => <MathGame addProgress={this.addProgress} culture={culture} {...props} />} />
                        <Route exact path="/word" render={props => <WordGames culture={culture} {...props} />} />
                        <Route exact path="/word/typing1" render={props => <Typing1 addProgress={this.addProgress} culture={culture} {...props} />} />
                        <Route exact path="/word/lowerCase" render={props => <LowerCase addProgress={this.addProgress} culture={culture} {...props} />} />
                        <Route exact path="/about" component={About} />
                        <PrivateRoute path="/settings" component={Settings} />
                        <Route path="/callback" component={Callback} />
                        <Route path="/logout" component={Logout} />
                    </div>
                </Router>


                <audio id="audio-success">
                    <source src={successWav} type="audio/wav" />
                    <source src={successMp3} type="audio/mpeg" />
                    <source src={successOgg} type="audio/ogg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        );
    }
}


ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
