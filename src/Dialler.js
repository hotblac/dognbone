import React, { Component } from 'react';
import 'bulma/css/bulma.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'

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
                <button className="button is-success is-rounded" onClick={this.handleSubmit}>
                    <span class="icon">
                        <FontAwesomeIcon icon={faPhone} />
                    </span>
                </button>
            </div>
        );
    }

}