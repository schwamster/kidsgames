import React from 'react';

export const PlayAgain = (props) => {
    return (
        <div style={{ display: 'inline-block' }}>
            <h2>Good Job!</h2>
            <button onClick={props.playAgain} type="button" className="btn btn-primary">Play Again</button>
        </div>
    );
}