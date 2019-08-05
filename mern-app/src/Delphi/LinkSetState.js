import React, { Component } from 'react';

export default class DelphiLinkSetState extends Component {
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
        const { historyCBlockId } = { ...this.props.AppObj.state};
        const newHistoryCBlockId = [ ...historyCBlockId];
        const newState = {};
        newState[this.props.stateProp] = this.props.stateValue;
        if (this.props.stateProp === 'currentCBlockId') {
            newHistoryCBlockId.push(this.props.AppObj.state.currentCBlockId);
            newState['historyCBlockId'] = newHistoryCBlockId
        }
        this.props.AppObj.setState(newState);
    }

    render() {
        return (
            <button className="delphi-button-as-link"
                onClick={this.handleClick}> {this.props.linkText}</button>
        );
    }
}
