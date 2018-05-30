import React from 'react';
import responsiveVoice from '../assets/scripts/responsivevoice';
import * as d3 from 'd3';


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

export class Problem extends React.Component {
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
        circleEnter.style("fill", function (d) { return d === 2 ? "#0e4ead" : "#ea80fc" });
        circleEnter.attr("cy", function (d) { return 30 * d });
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
                <h4 className="card-title">{this.props.problemToString(this.props.problem)}</h4>
            </span>
        );
    }
}