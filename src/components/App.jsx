import React from 'react';
import {WordGame} from './WordGame.jsx'
import {MathGame} from './MathGame.jsx'

const Navigation = (props) => {

    const texts = {
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
    };

    const translate = (textId) => {
        let text = texts[textId];
        return text[props.culture.language].value;
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand" onClick={() => window.location.reload()} href="#">
                <img src="./images/brand.svg" width="30" height="30" className="d-inline-block align-top" alt="" />
                <span>Kidsgames</span>
            </a>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto">
                    <li className={"nav-item " + (props.selectedGame === MATHGAME ? 'active' : '')}>
                        <a className="nav-link" onClick={() => props.switchGame(MATHGAME)} href="#">{translate('math')}</a>
                    </li>
                    <li className={"nav-item " + (props.selectedGame === WORDGAME ? 'active' : '')}>
                        <a className="nav-link" onClick={() => props.switchGame(WORDGAME)} href="#">{translate('words')}</a>
                    </li>

                </ul>
                <ul className="navbar-nav">
                    <li className="nav-item dropdown active">
                        <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                            <img src={require(`${props.userAvatar}`)} width="30" height="30" alt="" />
                            <span style={{ marginLeft: 5 + 'px' }}>{props.userName}</span>
                        </a>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">{translate('logOut')}</a>
                        </div>
                    </li>
                    <CultureSelector culture={props.culture} changeCulture={props.changeCulture} />
                </ul>
            </div>
        </nav>
    );
}

const CultureSelector = (props) => {
    return (
        <li className="nav-item dropdown active">
            <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                <span className={'flag-icon flag-icon-' + props.culture.flag}></span>
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a className="dropdown-item" onClick={() => props.changeCulture("de-DE")} href="#">Deutsch</a>
                <a className="dropdown-item" onClick={() => props.changeCulture("sv-SE")} href="#">Svenska</a>
            </div>
        </li>

    );
}

const WORDGAME = 'wordgame';
const MATHGAME = 'mathgame';
class Game extends React.Component {
    state = {
        timesPlayed: 0
    }

    renderGame = () => {
        switch (this.props.game) {
            case MATHGAME:
                return (<MathGame playAgain={this.playAgain} culture={this.props.culture} />);
            case WORDGAME:
            default:
                return (<WordGame playAgain={this.playAgain} culture={this.props.culture}/>);
        }
    }

    playAgain = () => {
        this.setState(prevState => ({ timesPlayed: prevState.timesPlayed + 1 }));
    }

    render() {
        return (
            <div className="container game">
                <div className="row">
                    <div className="col col-lg-2"></div>
                    <div className="col col-md-auto">
                        {this.renderGame()}
                    </div>
                    <div className="col col-lg-2"></div>
                </div>
            </div>
        );
    }
}

const CULTURES = [
    { culture: 'en-GB', flag: 'gb', language: 'en', voice: 'UK English Female', text: 'English (UK)' },
    { culture: 'sv-SE', flag: 'se', language: 'sv', voice: 'Swedish Female', text: 'Svenska' },
    { culture: 'de-DE', flag: 'de', language: 'de', voice: 'Deutsch Female', text: 'Deutsch' }
];



class App extends React.Component {

    static getCulture = (culture) => {
        let matching = CULTURES.filter(x => x.culture === culture);
        if (matching.length >= 1) {
            return matching[0];
        }
        return CULTURES[0];
    }

    state = {
        userName: 'Fritz',
        userAvatar: './assets/images/boy.svg',
        game: MATHGAME,
        culture: App.getCulture('en-GB')
    }

    switchGame = (game) => {
        this.setState({
            game: game,
            userAvatar: './assets/images/girl.svg'
        })
    }

    changeCulture = (culture) => {
        this.setState({
            culture: App.getCulture(culture)
        })
    }

    render() {
        const {
            userName,
            userAvatar,
            game,
            culture
        } = this.state;
        return (
            <div>
                <Navigation selectedGame={game} switchGame={this.switchGame} culture={culture} changeCulture={this.changeCulture} userName={userName} userAvatar={userAvatar} />
                <Game game={game} culture={culture} />
                <div className="fixed-bottom">
                    Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
                    <br></br>
                    Success sound by <a href="https://www.freesound.org/people/rhodesmas/sounds/322930/">rhodesmas</a> under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>
                </div>

                <audio id="audio-success">
                    <source src="./sounds/success.wav" type="audio/wav" />
                    <source src="./sounds/success.mp3" type="audio/mpeg" />
                    <source src="./sounds/success.ogg" type="audio/ogg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        );
    }
}

export default App;