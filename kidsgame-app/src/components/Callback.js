import React from 'react';
import { validateCallback } from '../utils/auth-service';

export class Callback extends React.Component {

  componentDidMount() {
    validateCallback();
    window.location.href = "/";
  }

  render() {
    return null;
  }
}