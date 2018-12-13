import React, { Component } from 'react';
import 'bulma/css/bulma.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import {Device} from "twilio-client";

export class Dialler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: '',
            token: ''
        };
    }

    componentDidMount() {
        Device.on('ready', device => {
            this.setState({status: 'Ready'});
            Device.connect({});
        });
        Device.on('disconnect', connection => {
            this.setState({status: 'Disconnected'});
        });
        Device.on('error', error => {
            console.log("Device error: ", error.code, error.message);
            this.setState({status: 'Device error'});
        });
    }

    handleErrors = (response) => {
        if (response.ok) return response;
        else throw new Error(response.statusText);
    };

    handleSubmit = () => {
        fetch('/api/token')
            .then(response => this.handleErrors(response))
            .then(response => response.text())
            .then(token => {
                Device.setup(token);
                this.setState({
                    token: token,
                    status: 'Obtained token'
                });
            })
            .catch(error => {
                console.log('Request failed', error);
                this.setState({status: 'Call setup error: ' + error});
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
                <p className="help">{this.state.status}</p>
            </div>
        );
    }

}