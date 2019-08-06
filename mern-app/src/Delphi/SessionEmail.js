import React, { Component } from 'react';
import { SESS_PROMPT_EMAIL } from './Constants'

export default class DelphiSessionEmail extends Component {
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
        this.props.AppObj.setState({ userEmail: event.target.value });
    }
    
    render() {
        const AppObj = this.props.AppObj;
        return (
            <input className="delphi-form-minwidth"
                type="text" placeholder={SESS_PROMPT_EMAIL}
                value={AppObj.state.userEmail} onChange={this.handleChange} />
        );
    }
}
