import React, { Component } from 'react';

export class CallerIdDropdown extends Component {

    render() {
        return(
            <div id="callerIdField" className="field">
                <div className="select control">
                    <select id="caller-id-dropdown" value={this.props.callerId} onChange={this.props.onChange}>
                        {this.props.twilioNumbers && this.props.twilioNumbers.map((twilioNumber) =>
                            <option key={twilioNumber} value={twilioNumber}>{twilioNumber}</option>
                        )}
                    </select>
                </div>
            </div>
        );
    }
}