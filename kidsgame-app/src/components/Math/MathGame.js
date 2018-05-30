import React from 'react';
import { PlayAgain } from '../PlayAgain';
import { Problem } from './Problem';
import { SolutionInput } from './SolutionInput'


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


const problems = [
    { type: 'addition', scope: { a: 1, b: 3 } },
    { type: 'addition', scope: { a: 3, b: 7 } },
    { type: 'addition', scope: { a: 2, b: 4 } },
    { type: 'addition', scope: { a: 7, b: 4 } },
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

    getProblems = () => {
        // let url = 'https://2d9foixhz3.execute-api.eu-west-1.amazonaws.com/v1/kidsgame-get-math-problems';
        // let idToken = this.getIdToken();
        // axios.get(
        //     url,
        //     {
        //         headers: {
        //             "Authorization": `Bearer ${idToken.jwtToken}`
        //         }
        //     }
        // )
        //     .then((response) => {
        //         var response = response.data;
        //         console.log(response);
        //     },
        //         (error) => {
        //             var status = error.response.status
        //         }
        //     );
    }

    state = MathGame.initialState(this.props);

    correctAnswer = () => {
        var audio_success = document.getElementById('audio-success');
        audio_success.play();
        this.props.addProgress(5);
        this.setState({ background: 'bg-success' }, () => {
            setTimeout(this.next, 1000);
        });

    }

    playAgain = () => {
        this.setState(MathGame.initialState(this.props));
    }

    next = () => {
        if (this.state.count === (problems.length - 1)) {
            this.props.addProgress(15);
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
        const { problem, isGameWon } = this.state;
        return (
            <div className="container game">
                <div className="row">
                    <div className="col col-lg-2"></div>
                    <div className="col col-md-auto">
                        {isGameWon ?
                            <PlayAgain playAgain={this.playAgain} /> :
                            <div className={"card text-white mb-3 " + this.state.background} style={{ maxWidth: 20 + 'rem' }}>
                                <div className="card-body">
                                    <Problem problemToString={problemToString} problem={problem} culture={this.props.culture} />
                                    <SolutionInput problemToString={problemToString} culture={this.props.culture} correctAnswer={this.correctAnswer} problem={problem} />
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
