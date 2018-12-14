import React, { Component } from 'react';
import 'bulma/css/bulma.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import {Device} from "twilio-client";
import { Keypad } from './Keypad';

export class Dialler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: '',
            number: ''
        };
    }

    componentDidMount() {
        Device.on('ready', device => {
            this.setState({status: 'Device ready'});
            console.log('Device.connect: number:' + this.state.number);
            Device.connect({number: this.state.number});
        });
        Device.on('connect', connection => {
            this.setState({status: 'Connected'});
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

    handlePhoneNumberChange = (event) => {
        const phoneNumber = event.target.value;
        this.setState({number: phoneNumber});
    };

    handleKeyPress = (event) => {
        const keyPressed = event.target.value;
        this.setState((state, props) => ({
            number: state.number + keyPressed
        }));
    };

    handleSubmit = () => {
        fetch('/api/token')
            .then(response => this.handleErrors(response))
            .then(response => response.text())
            .then(token => {
                Device.setup(token);
                this.setState({
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
            <div>
                <div id="phoneNumberField" className="field">
                    <div className="control">
                        <input type="text" className="input" value={this.state.number} onChange={this.handlePhoneNumberChange}/>
                    </div>
                </div>

                <Keypad onChange={this.handleKeyPress}/>

                <div id="callButtonField" className="field">
                    <button className="button is-success is-rounded" onClick={this.handleSubmit}>
                        <span className="icon">
                            <FontAwesomeIcon icon={faPhone} />
                        </span>
                    </button>
                    <p className="help">{this.state.status}</p>
                </div>
            </div>
        );
    }

}