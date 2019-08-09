import React, { Component } from 'react';
import { SESS_PROMPT_ID } from './Constants'

export default class DelphiSessionId extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    handleChange(event) {
        this.props.AppObj.setState({ sessionId: event.target.value });
    }
    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.props.AppObj.checkSession(event);
        }
    }
    
    render() {
        const AppObj = this.props.AppObj;
        return (
            <input type="text" placeholder={SESS_PROMPT_ID}
                value={AppObj.state.sessionId}
                onChange={this.handleChange} onKeyUp={this.handleKeyUp} />
        );
    }
}
