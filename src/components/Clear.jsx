import React from 'react';

export const Clear = (props) => {
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