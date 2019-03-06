import React, { Component } from 'react';
import { Dialler } from "./Dialler";
import { LoginModal } from "./LoginModal";
import * as api from "./Backend.api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBone} from '@fortawesome/free-solid-svg-icons'
import 'bulma/css/bulma.css'
import './App.css';
import {Device} from "twilio-client";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appVersion: 'UNKNOWN_VERSION',
            token: '',
            twilioNumber: '',
            deviceState: '',
            deviceErrorCode: '',
            deviceErrorMessage: ''
        };
    }

    captureDeviceStateChange = (state) => {
        Device.on(state, obj => {
            if (state === 'error') {
                this.setState({
                    deviceState: 'error',
                    deviceErrorCode: obj.code,
                    deviceErrorMessage: obj.message
                });
            } else {
                this.setState({
                    deviceState: state
                });
            }
        });
    };

    componentDidMount() {
        this.captureDeviceStateChange('cancel');
        this.captureDeviceStateChange('connect');
        this.captureDeviceStateChange('disconnect');
        this.captureDeviceStateChange('error');
        this.captureDeviceStateChange('incoming');
        this.captureDeviceStateChange('offline');
        this.captureDeviceStateChange('ready');

        api.version()
            .then(versionString => {
                console.log('App version: ' + versionString);
                this.setState({appVersion: versionString});
            })
            .catch(error => {
                console.log('Failed to get app version: ' + error)
            });
    }

    handleNotificationDismiss = () => {
        this.setState({
            deviceErrorCode: '',
            deviceErrorMessage: ''
        })
    };

    handleLogin = (capabilityToken) => {
        this.setState({token: capabilityToken});
        Device.setup(capabilityToken);
    };

    handleTwilioNumberUpdate = (twilioNumber) => {
        this.setState({twilioNumber: twilioNumber});
    };

    /**
     * Show login modal if user has not logged in yet OR if given login
     * credentials were incorrect.
     * Incorrect login credentials result in a valid login token being returned
     * but the device will fail to initialize and show offline status.
     *
     * @returns {boolean}
     */
    isLoginModalVisible = () => {
        return !this.state.token || this.state.deviceState === 'offline';
    };

    render() {
        return (
            <div>
                <section className="hero has-text-centered is-dark">
                    <div className="hero-body">
                        <h1 className="title">Dog n Bone</h1>
                        <h2 className="subtitle">A browser phone powered by <a href="https://www.twilio.com">Twilio</a></h2>
                    </div>
                </section>
                <section className="section has-background-light">
                    {(this.state.deviceErrorCode || this.state.deviceErrorMessage) &&
                    <div className="notification is-danger">
                        <button className="delete" onClick={this.handleNotificationDismiss}/>
                        Device error {this.state.deviceErrorCode}: {this.state.deviceErrorMessage}
                    </div>
                    }
                    <div className="container has-text-centered">
                        <div className="columns is-centered is-mobile">
                            <div className="column box is-narrow" style={{width: '300px'}}>
                                <figure className="avatar is-dark">
                                    <FontAwesomeIcon icon={faBone} size="6x" className="has-text-grey"/>
                                </figure>
                                <Dialler deviceState={this.state.deviceState} callerId={this.state.twilioNumber}/>
                            </div>
                        </div>
                    </div>
                </section>
                <LoginModal visible={this.isLoginModalVisible()} deviceState={this.state.deviceState}
                            onLogin={this.handleLogin} onTwilioNumberLoaded={this.handleTwilioNumberUpdate}/>
                <footer className="footer has-text-centered is-dark">
                    <div className="content">
                        <p><a href="https://github.com/hotblac/dognbone/tree/master">Dog n Bone {this.state.appVersion} @ Github</a></p>
                    </div>
                </footer>
            </div>
        );
    }
}

export default App;
