import React from 'react';
import math from 'mathjs';
import { Clear } from '../Clear';

export class SolutionInput extends React.Component {

    state = {
        value: '',
    }

    validate = (event) => {
        let value = event.target.value;
        let result = math.eval(this.props.problemToString(this.props.problem));
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
