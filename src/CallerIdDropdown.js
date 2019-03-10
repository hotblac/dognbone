import React, { Component } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";

export class CallerIdDropdown extends Component {

    handleDropdownToggle = () => {
        this.callerIdDropdown && this.callerIdDropdown.classList.toggle('is-active');
    };

    handleSelect = (twilioNumber) => {
        this.props.onChange(twilioNumber);
        this.callerIdDropdown && this.callerIdDropdown.classList.remove('is-active');
    };

    render() {
        return(
            <div className="dropdown" id="caller-id-dropdown" ref={el => this.callerIdDropdown = el}>
                <p className="help dropdown-trigger" onClick={this.handleDropdownToggle}>Caller ID: {this.props.callerId} <FontAwesomeIcon icon={faAngleDown} /></p>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {this.props.twilioNumbers && this.props.twilioNumbers.map(twilioNumber =>
                            <p key={twilioNumber} className="dropdown-item" data-value={twilioNumber} onClick={() => this.handleSelect(twilioNumber)}>{twilioNumber}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}