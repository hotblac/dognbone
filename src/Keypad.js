import React, { Component } from 'react';
import {DigitButton} from "./DigitButton";
import 'bulma/css/bulma.css'

export class Keypad extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div className="level">
                    <DigitButton digit='1' onClick={this.props.onChange}/>
                    <DigitButton digit='2' onClick={this.props.onChange}/>
                    <DigitButton digit='3' onClick={this.props.onChange}/>
                </div>


                <div className="level">
                    <DigitButton digit='4' onClick={this.props.onChange}/>
                    <DigitButton digit='5' onClick={this.props.onChange}/>
                    <DigitButton digit='6' onClick={this.props.onChange}/>
                </div>

                <div className="level">
                    <DigitButton digit='7' onClick={this.props.onChange}/>
                    <DigitButton digit='8' onClick={this.props.onChange}/>
                    <DigitButton digit='9' onClick={this.props.onChange}/>
                </div>

                <div className="level">
                    <DigitButton digit='*' onClick={this.props.onChange}/>
                    <DigitButton digit='0' onClick={this.props.onChange}/>
                    <DigitButton digit='#' onClick={this.props.onChange}/>
                </div>
            </div>
        );
    }
}