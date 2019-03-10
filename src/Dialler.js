import React, { Component } from 'react';
import 'bulma/css/bulma.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import {Device} from "twilio-client";
import { Keypad } from './Keypad';
import {CallerIdDropdown} from "./CallerIdDropdown";

// Dial UK numbers only
const countryCode = '+44';

export class Dialler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            number: '',
            callerId: ''
        };
    }

    componentWillReceiveProps(props) {
        this.setState({ callerId: props.twilioNumbers[0] });
    }

    handlePhoneNumberChange = (event) => {
        const phoneNumber = event.target.value;
        this.setState({number: phoneNumber});
    };

    handleKeyPress = (keyPressed) => {
        this.setState((state, props) => ({
            number: state.number + keyPressed
        }));
    };

    handleCallButtonClick = () => {
        if (this.callIsActive()) this.endCall();
        else this.initiateCall();
    };

    handleCallerIdChange = (event) => {
        const callerId = event.target.value;
        this.setState({callerId: callerId});
    };

    initiateCall = () => {
        // E.164 formatted phone number (including international calling code)
        const phoneNumber = countryCode + this.state.number.replace(/^0/, ''); // Strip leading zero
        console.log('Device.connect: number:' + phoneNumber);
        Device.connect({
            number: phoneNumber,
            callerId: this.state.callerId
        });
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
                <p className="help">Caller ID: {this.state.callerId}</p>
                <CallerIdDropdown twilioNumbers={this.props.twilioNumbers} callerId={this.state.callerId} onChange={this.handleCallerIdChange}/>

                <div id="phoneNumberField" className="field has-addons">
                    <div className="control">
                        <span id="countryCode" className="button is-static is-rounded">{countryCode}</span>
                    </div>
                    <div className="control">
                        <input type="text" className="input is-primary is-rounded"
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