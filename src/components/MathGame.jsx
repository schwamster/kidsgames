import React from 'react';
import responsiveVoice from './assets/scripts/responsivevoice';
import { PlayAgain } from './PlayAgain.jsx';
import { Clear } from './Clear.jsx';
import math from 'mathjs';
import * as d3 from 'd3';

const problemToString = (problem) => {
    if (problem.type === 'addition') {
        return `${problem.scope.a} + ${problem.scope.b}`
    }

    if (problem.type === 'subtraction') {
        return `${problem.scope.a} - ${problem.scope.b}`
    }

    console.log('problemToString: unknown problem type');
    return "0 + 0";
}

const problemToVoiceString = (problem) => {
    if (problem.type === 'addition') {
        return `${problem.scope.a} + ${problem.scope.b}`
    }

    if (problem.type === 'subtraction') {
        //TODO: culture is needed here at some point..
        return `${problem.scope.a} minus ${problem.scope.b}`
    }

    console.log('problemToVoiceString: unknown problem type');
    return "0 + 0";
}

class Problem extends React.Component {
    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.problem === nextProps.problem && this.props.culture.voice === nextProps.culture.voice) {
            return false;
        }
        return true;
    }

    visualizeNumbers = () => {
        var svg = d3.select("svg");  
        svg.selectAll('*').remove();      
        var elementsA = Array(this.props.problem.scope.a).fill(1);
        var elementsB = Array(this.props.problem.scope.b).fill(2);
        var elements = elementsA.concat(elementsB);
        
        var circle = svg.selectAll("circle")
            .data(elements);

        var circleEnter = circle.enter().append("circle");
        circleEnter.style("fill", function(d){return d==2 ? "#0e4ead": "#ea80fc"});
        circleEnter.attr("cy", function(d){ return 30 * d});
        circleEnter.attr("cx", function (d, i) { return i * 25 + 10; });
        circleEnter.attr("r", "10");
    }

    componentDidUpdate = () => {
        
        responsiveVoice.speak(problemToVoiceString(this.props.problem), this.props.culture.voice);
        this.visualizeNumbers();
    }

    componentDidMount = () => {
        
        responsiveVoice.speak(problemToVoiceString(this.props.problem), this.props.culture.voice);
        this.visualizeNumbers();
    }

    render() {
        return (
            <span>
                <svg id="svg-math" height="100">
                </svg>
                <h4 className="card-title">{problemToString(this.props.problem)}</h4>
            </span>
        );
    }
}

class SolutionInput extends React.Component {

    state = {
        value: '',
    }

    validate = (event) => {
        let value = event.target.value;
        let result = math.eval(problemToString(this.props.problem));
        if (result.toString() === value) {
            this.setState({ value: value }, () => {
                this.props.correctAnswer();
                //todo: this should happen after the parent obj has shown the success view
                //not after some random timout...
                setTimeout(() => this.setState({ value: '' }), 1000);
            });

        }
        else {
            this.setState({ value: value });
        }
    }

    clear = () => {
        this.setState({ value: '' });
    }

    componentDidMount() {
        this.solutionInput.focus();
    }

    render() {

        return (
            <div>
                <div className="form-group">
                    <input onChange={this.validate}
                        ref={(input) => { this.solutionInput = input; }}
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

const problems = [
    { type: 'addition', scope: { a: 4, b: 3 } },
    { type: 'addition', scope: { a: 3, b: 7 } },
    { type: 'addition', scope: { a: 2, b: 4 } },
    { type: 'subtraction', scope: { a: 4, b: 3 } }
];

export class MathGame extends React.Component {

    static initialState = (props) => ({
        count: 0,
        background: 'bg-primary',
        isGameWon: false,
        problem: MathGame.getNextProblem(0)
    });

    static getNextProblem = (index) => {
        return problems[index];
    }

    state = MathGame.initialState(this.props);

    correctAnswer = () => {
        var audio_success = document.getElementById('audio-success');
        audio_success.play();
        this.setState({ background: 'bg-success' }, () => {
            setTimeout(this.next, 1000);
        });

    }

    playAgain = () => {
        this.setState(MathGame.initialState(this.props));
        this.props.playAgain();
    }

    next = () => {
        if (this.state.count === (problems.length - 1)) {
            this.setState((prevState) => ({
                isGameWon: true
            }));
        }
        else {
            this.setState((prevState) => ({
                count: prevState.count + 1,
                problem: MathGame.getNextProblem(prevState.count + 1),
                background: 'bg-primary'
            }));
        }
    }

    render() {
        const { problem, input, isGameWon } = this.state;
        return (
            isGameWon ?
                <PlayAgain playAgain={this.playAgain} /> :
                <div className={"card text-white mb-3 " + this.state.background} style={{ maxWidth: 20 + 'rem' }}>
                    <div className="card-body">
                        <Problem problem={problem} culture={this.props.culture} />
                        <SolutionInput culture={this.props.culture} correctAnswer={this.correctAnswer} problem={problem} />
                    </div>
                </div>
        );
    }
}
