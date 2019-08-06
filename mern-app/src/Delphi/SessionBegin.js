import React, { Component } from 'react';
import * as DC from './Constants'

export default class DelphiSessionBegin extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    handleClick(event) {
        event.preventDefault();

        // request whether a session
        this.props.AppObj.checkSession(event);
        return;

        // move to welcome block
        this.props.AppObj.setState( {
            currentCBlockId: DC.BLOCKS_INSTRUCT
        });
    }

    render() {
        const { userEmail, sessionId } = { ...this.props.AppObj.state};
        return (
            <button disabled={(userEmail === '') || (sessionId === '')}
                onClick={this.handleClick}>{DC.SESS_BEGIN}</button>
        );
    }
}
