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
            number: ''
        };
    }

    handlePhoneNumberChange = (event) => {
        const phoneNumber = event.target.value;
        this.setState({number: phoneNumber});
    };

    handleKeyPress = (keyPressed) => {
        console.log(keyPressed);
        this.setState((state, props) => ({
            number: state.number + keyPressed
        }));
    };

    handleCallButtonClick = () => {
        if (this.callIsActive()) this.endCall();
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

    callStatus = () => {
        switch(this.props.deviceState) {
            case 'ready': return 'Device ready';
            case 'connect': return 'Connected';
            case 'disconnect': return 'Disconnected';
            case 'error': return 'Device error';
            default: return '';
        }
    };

    callIsActive = () => {
        return this.props.deviceState === 'connect';
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
                    <button className={'button is-rounded is-large ' + (this.callIsActive() ? 'is-danger' : 'is-success')}
                            onClick={this.handleCallButtonClick}>
                        <span className="icon">
                            <FontAwesomeIcon icon={faPhone} />
                        </span>
                    </button>
                    <p className="help">{this.callStatus()}</p>
                </div>
            </div>
        );
    }

}