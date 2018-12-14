import React, { Component } from 'react';

export class DigitButton extends Component {

    render() {
        return (
            <button className="button is-rounded" onClick={this.props.onClick} value={this.props.digit}>
                <div>{this.props.digit}</div>
            </button>
        );
    }
}