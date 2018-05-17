import React from 'react';
import {Jumbotron} from 'reactstrap';

export const About = (props) => {
    return (
        <div>
            <Jumbotron>
                <h1 className="display-3">Thanks for checking out this project!</h1>
                <p className="lead">This is a simple project to test out a few things and get my daughter to play around a bit with simple math and word games</p>
                <hr className="my-2" />
                <p>Please note the following projects/assets that i used to make this possible</p>
                Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
                <br></br>
                Success sound by <a href="https://www.freesound.org/people/rhodesmas/sounds/322930/">rhodesmas</a> under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>
            </Jumbotron>
        </div>
    );
}

