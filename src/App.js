import React, { Component } from 'react';
import {Dialler} from "./Dialler";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBone} from '@fortawesome/free-solid-svg-icons'
import 'bulma/css/bulma.css'
import './App.css';

class App extends Component {
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
            </div>
        );
    }
}

export default App;
