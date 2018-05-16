import React from 'react';
import { Redirect } from 'react-router'


export const Home = (props) => {
    return (
        <div>
            <Redirect to="/math"/>             
        </div>
    );
}