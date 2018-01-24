import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import 'bootstrap';
import './main.scss';

ReactDOM.render(<App label="Press Me" />, document.getElementById('root'));

(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js', { scope: '/' })
            .then(() => console.log('Service Worker registered successfully.'))
            .catch(error => console.log('Service Worker registration failed:', error));
    }
})();