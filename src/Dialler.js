import React, { Component } from 'react';
import 'bulma/css/bulma.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'

export class Dialler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            state: 'Not Ready',
            token: ''
        };
    }

    handleErrors = (response) => {
        if (response.ok) return response;
        else throw new Error(response.statusText);
    };

    handleSubmit = () => {
        fetch('/api/token')
            .then(response => this.handleErrors(response))
            .then(response => this.setState({
                token: response.text(),
                state: 'Ready'
            }))
            .catch(error => {
                console.log('Request failed', error);
                this.setState({state: 'Call setup error: ' + error});
            })
    };

    render() {
        return (
            <div className="field">
                <button className="button is-success is-rounded" onClick={this.handleSubmit}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faPhone} />
                    </span>
                </button>
                <p className="help">{this.state.state}</p>
            </div>
        );
    }

}