import React from 'react';
import responsiveVoice from '../assets/scripts/responsivevoice';
import { PlayAgain } from '../PlayAgain';
import { Clear } from '../Clear';


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
            <h4 className="card-title">{this.props.word.toLowerCase()}</h4>
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
            responsiveVoice.speak(event.key, this.props.culture.voice);
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

const words = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
]

export class LowerCase extends React.Component {
    static getNextWord = (index) => {
        return words[index];
    }

    static initialState = (props) => ({
        count: 0,
        word: LowerCase.getNextWord(0),
        background: 'bg-primary',
        isGameWon: false
    });

    state = LowerCase.initialState(this.props);

    correctAnswer = (answer) => {
        var audio_success = document.getElementById('audio-success');
        audio_success.play();
        this.props.addProgress(1);
        this.setState({ background: 'bg-success' }, () => {
            setTimeout(this.next, 1000);
        });

    }

    playAgain = () => {
        this.setState(LowerCase.initialState(this.props));
    }

    next = () => {
        if (this.state.count === (words.length - 1)) {
            this.props.addProgress(15);
            this.setState((prevState) => ({
                isGameWon: true
            }));
        }
        else {
            this.setState((prevState) => ({
                count: prevState.count + 1,
                word: LowerCase.getNextWord(prevState.count + 1),
                background: 'bg-primary',
                input: ''
            }));
        }
    }

    render() {
        const { word, isGameWon } = this.state;
        return (
            <div className="container game">
                <div className="row">
                    <div className="col col-lg-2"></div>
                    <div className="col col-md-auto">
                        {
                            isGameWon ?
                                <PlayAgain playAgain={this.playAgain} /> :
                                <div className={"card text-white mb-3 " + this.state.background} style={{ maxWidth: 20 + 'rem' }}>
                                    <div className="card-body">
                                        <Word word={word} culture={this.props.culture} />
                                        <WordInput culture={this.props.culture} correctAnswer={this.correctAnswer} word={word} />
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="col col-lg-2"></div>
                </div>
            </div>
        );
    }
}


