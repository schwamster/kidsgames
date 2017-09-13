import React from 'react';
import responsiveVoice from './assets/scripts/responsivevoice';

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

class Word extends React.Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.word === nextProps.word && this.props.culture.voice === nextProps.culture.voice) {
            return false;
        }
        return true;
    }

    render() {
        responsiveVoice.speak(this.props.word, this.props.culture.voice);
        return (
            <h4 className="card-title">{this.props.word.toUpperCase()}</h4>
        );
    }

}

class WordInput extends React.Component {

    state = {
        value: '',
        sayEachLetter: false
    }

    sayLetter = (event) => {
        if (this.state.sayEachLetter) {
            responsiveVoice.speak(event.key, this.props.voice);
        }
    }

    validate = (event) => {
        let value = event.target.value;
        if (this.props.word.toUpperCase() === value.toUpperCase()) {
            this.setState({ value: value.toUpperCase() }, () => {
                this.props.correctAnswer(value);
                //todo: this should happen after the parent obj has shown the success view
                //not after some random timout...
                setTimeout(() => this.setState({ value: '' }), 1000);
            });

        }
        else {
            this.setState({ value: value.toUpperCase() });
        }
    }

    clear = () => {
        this.setState({ value: '' });
    }

    componentDidMount() {
        this.wordInput.focus();
    }

    render() {

        return (
            <div>
                <div className="form-group">
                    <input onChange={this.validate}
                        onKeyUp={this.sayLetter}
                        ref={(input) => { this.wordInput = input; }}
                        type="word" value={this.state.value}
                        className="form-control"
                        aria-describedby="start typing"
                        placeholder="" />
                </div>
                <Clear onClear={this.clear} culture={this.props.culture} />
            </div>
        )
    }
}

const Clear = (props) => {
    const texts = {
        'clear': {
            'en': { value: 'Clear' },
            'sv': { value: 'Rensa' },
            'de': { value: 'Zurücksetzen' }
        }
    };

    const translate = (textId) => {
        let text = texts[textId];
        return text[props.culture.language].value;
    }

    return (
        <a href="#" onClick={props.onClear} className="btn btn-light float-right">{translate('clear')}</a>
    );
}

const words = [
    'Elsa',
    'Tilda',
    'Bastian',
    'Madelene',
    'Svea'
]

class WordGame extends React.Component {
    static getNextWord = (index) => {
        return words[index];
    }

    static initialState = (props) => ({
        count: 0,
        word: WordGame.getNextWord(0),
        background: 'bg-primary',
        isGameWon: false
    });

    state = WordGame.initialState(this.props);

    correctAnswer = (answer) => {
        var audio_success = document.getElementById('audio-success');
        audio_success.play();
        this.setState({ background: 'bg-success' }, () => {
            setTimeout(this.next, 1000);
        });

    }

    playAgain = () => {
        this.setState(WordGame.initialState(this.props));
        this.props.playAgain();
    }

    next = () => {
        if (this.state.count === (words.length - 1)) {
            this.setState((prevState) => ({
                isGameWon: true
            }));
        }
        else {
            this.setState((prevState) => ({
                count: prevState.count + 1,
                word: WordGame.getNextWord(prevState.count + 1),
                background: 'bg-primary',
                input: ''
            }));
        }
    }

    render() {
        const { word, input, isGameWon } = this.state;
        return (
            isGameWon ?
                <PlayAgain playAgain={this.playAgain} /> :
                <div className={"card text-white mb-3 " + this.state.background} style={{ maxWidth: 20 + 'rem' }}>
                    <div className="card-body">
                        <Word word={word} culture={this.props.culture} />
                        <WordInput voice={this.props.culture} correctAnswer={this.correctAnswer} word={word} />
                    </div>
                </div>
        );
    }
}

const PlayAgain = (props) => {
    return (
        <div style={{ display: 'inline-block' }}>
            <h2>Good Job!</h2>
            <button onClick={props.playAgain} type="button" className="btn btn-primary">Play Again</button>
        </div>
    );
}

const MathGame = (props) => {
    return (
        <span>MathCard</span>
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
            case WORDGAME:
                return (<WordGame playAgain={this.playAgain} culture={this.props.culture} />);
            case MATHGAME:
                return (<MathGame playAgain={this.playAgain} />);
            default:
                return (<WordGame playAgain={this.playAgain} />);
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
        game: WORDGAME,
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
                <div className="fixed-bottom">Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>

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