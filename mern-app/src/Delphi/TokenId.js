import React, { Component } from 'react';
import { TOKEN_PROMPT_ID } from './Constants'

export default class DelphiTokenId extends Component {
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
        this.props.AppObj.setState({ tokenId: event.target.value });
    }
    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.props.AppObj.checkToken(event);
        }
    }
    
    render() {
        const AppObj = this.props.AppObj;
        return (
            <input type="text" placeholder={TOKEN_PROMPT_ID}
                value={AppObj.state.tokenId}
                onChange={this.handleChange} onKeyUp={this.handleKeyUp} />
        );
    }
}
