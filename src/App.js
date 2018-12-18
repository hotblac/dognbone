import React, { Component } from 'react';
import { Dialler } from "./Dialler";
import { LoginModal } from "./LoginModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBone} from '@fortawesome/free-solid-svg-icons'
import 'bulma/css/bulma.css'
import './App.css';
import {Device} from "twilio-client";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            deviceErrorCode: '',
            deviceErrorMessage: ''
        };
    }

    componentDidMount() {
        Device.on('error', error => {
            console.log("Device error: ", error.code, error.message);
            this.setState({
                deviceErrorCode: error.code,
                deviceErrorMessage: error.message
            });
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
                                <Dialler/>
                            </div>
                        </div>
                    </div>
                </section>
                <LoginModal visible={!this.state.token} onLogin={this.handleLogin}/>
            </div>
        );
    }
}

export default App;
