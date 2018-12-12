import React, { Component } from 'react';

export class Dialler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            state: 'ready'
        };
    }

    handleErrors = (response) => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response;
    };

    handleSubmit = () => {
        fetch('/api/makeCall')
            .then(result => this.handleErrors(result))
            .then(result => this.setState({state: 'dialling'}))
            .catch()
    };

    render() {
        return (
            <div>
                <button className="button is-primary" onClick={this.handleSubmit}>Dial!</button>
            </div>
        );
    }

}