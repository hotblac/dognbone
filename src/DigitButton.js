import React, { Component } from 'react';
import 'bulma/css/bulma.css'

export class DigitButton extends Component {

    render() {
        return (
            <button className="button is-rounded is-info is-large" onClick={this.props.onClick} value={this.props.digit}>
                <div>{this.props.digit}</div>
            </button>
        );
    }
}