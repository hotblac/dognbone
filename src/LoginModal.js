import React, { Component } from 'react';
import 'bulma/css/bulma.css'

export class LoginModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountSid: '',
            accountSidValidationError: '',
            authToken: '',
            authTokenValidationError: ''
        };
    }

    /**
     * Validates all form input and sets validation error messages as required.
     * @returns {boolean} true iff form is valid
     */
    validateForm = () => {
        let accountSidValidationError = '';
        let authTokenValidationError = '';
        if (!this.state.accountSid) {
            accountSidValidationError = 'Account SID is required';
        }

        if (!this.state.authToken) {
            authTokenValidationError = 'Auth Token is required';
        }

        this.setState({
            accountSidValidationError: accountSidValidationError,
            authTokenValidationError: authTokenValidationError
        });

        return !(accountSidValidationError || authTokenValidationError);
    };

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name]: target.value
        });
    };

    handleSubmit = () => {
        this.validateForm();
    };

    render() {
        return (
            <div className={'modal ' + (this.props.visible ? 'is-active' : '')}>
                <div className="modal-background"> </div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Login to Twilio</p>
                    </header>
                    <section className="modal-card-body">
                        <p className="level">Login with your Twilio Account SID.</p>
                        <div id="accountSidField" className="field is-horizontal">
                            <label className="field-label">Account SID</label>
                            <div className="field-body">
                                <div className="field is-expanded">
                                    <div className="control">
                                        <input name="accountSid" type="text"
                                               onChange={this.handleInputChange}
                                               className={'input ' + (this.state.accountSidValidationError ? 'is-danger' : '')}/>
                                    </div>
                                    {this.state.accountSidValidationError &&
                                    <p className="help is-danger">{this.state.accountSidValidationError}</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div id="authTokenField" className="field is-horizontal">
                            <label className="field-label">Auth Token</label>
                            <div className="field-body">
                                <div className="field is-expanded">
                                    <div className="control">
                                        <input name="authToken" type="password"
                                               onChange={this.handleInputChange}
                                               className={'input ' + (this.state.authTokenValidationError ? 'is-danger' : '')}/>
                                    </div>
                                    {this.state.authTokenValidationError &&
                                    <p className="help is-danger">{this.state.authTokenValidationError}</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" onClick={this.handleSubmit}>Login</button>
                    </footer>
                </div>
            </div>
        );
    };
}