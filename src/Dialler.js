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
            callIsActive: false,
            status: '',
            number: ''
        };
    }

    componentDidMount() {
        Device.on('ready', device => {
            this.setState({
                callIsActive: false,
                status: 'Device ready'
            });
        });
        Device.on('connect', connection => {
            this.setState({
                callIsActive: true,
                status: 'Connected'
            });
        });
        Device.on('disconnect', connection => {
            this.setState({
                callIsActive: false,
                status: 'Disconnected'
            });
        });
        Device.on('error', error => {
            console.log("Device error: ", error.code, error.message);
            this.setState({
                callIsActive: false,
                status: 'Device error'
            });
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

    handleCallButtonClick = () => {
        if (this.state.callIsActive) this.endCall();
        else this.initiateCall();
    };

    initiateCall = () => {
        console.log('Device.connect: number:' + this.state.number);
        Device.connect({number: this.state.number});
    };

    endCall = () => {
        console.log('Device.disconnectAll');
        Device.disconnectAll();
    };

    render() {
        return (
            <div>
                <div id="phoneNumberField" className="field">
                    <div className="control has-icons-left">
                        <span className="icon is-left">
                            <FontAwesomeIcon icon={faPhone} />
                        </span>
                        <input type="text" className="input is-primary is-rounded"
                               placeholder="+44"
                               value={this.state.number} onChange={this.handlePhoneNumberChange}/>
                    </div>
                </div>

                <div className="section">
                    <Keypad onChange={this.handleKeyPress}/>
                </div>

                <div id="callButtonField" className="field">
                    <button className={'button is-rounded is-large ' + (this.state.callIsActive ? 'is-danger' : 'is-success')}
                            onClick={this.handleCallButtonClick}>
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