import React, { Component } from 'react';
import { SESS_PROMPT_ID } from './Constants'

export default class DelphiSessionId extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    handleChange(event) {
        this.props.AppObj.setState({ sessionId: event.target.value });
    }
    
    render() {
        const AppObj = this.props.AppObj;
        return (
            <input type="text" placeholder={SESS_PROMPT_ID}
                value={AppObj.state.sessionId} onChange={this.handleChange} />
        );
    }
}
