import React, { Component } from 'react';
import 'bulma/css/bulma.css'

export class LoginModal extends Component {

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
                        <div className="field is-horizontal">
                            <label className="field-label">Account SID</label>
                            <div className="field-body">
                                    <div className="field control is-expanded">
                                        <input className="input" type="text"/>
                                    </div>
                                </div>
                        </div>
                        <div className="field is-horizontal">
                            <label className="field-label">Auth Token</label>
                            <div className="field-body">
                                <div className="field control is-expanded">
                                    <input className="input" type="password"/>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success">Login</button>
                    </footer>
                </div>
            </div>
        );
    };
}