import React, { Component } from 'react';

// helper function
function isDict(v) {
    return !!v &&
        typeof v === 'object' &&
        v !== null &&
        !(v instanceof Array) && !(v instanceof Date);
}

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
        const { AppObj, stateProp, stateValue } = { ...this.props};
        const { tokenId, tokenValid, historyCBlockId } = { ...AppObj.state};
        const newHistoryCBlockId = [ ...historyCBlockId];
        var newState = {};
        if (!isDict(stateProp)) {
            newState[stateProp] = stateValue;
            if (this.props.stateProp === 'currentCBlockId') {
                if (!!tokenValid && tokenId !== '') {
                    AppObj.adminLoadBlocks(parseInt(stateValue));
                }
                newHistoryCBlockId.push(AppObj.state.currentCBlockId);
                newState['historyCBlockId'] = newHistoryCBlockId;
                newState['query'] = '';
                newState['results'] = [];
            }
        } else {
            newState = stateProp;
            if ('currentCBlockId' in newState) {
                if (!!tokenValid && tokenId !== '') {
                    AppObj.adminLoadBlocks(parseInt(newState.currentCBlockId));
                }
                newHistoryCBlockId.push(AppObj.state.currentCBlockId);
                newState['historyCBlockId'] = newHistoryCBlockId
                newState['query'] = '';
                newState['results'] = [];
            }
        }
        AppObj.setState(newState);
    }

    render() {
        if (!this.props.className) {
            return (
                <button className="delphi-button-as-link"
                    onClick={this.handleClick}> {this.props.linkText}</button>
            );
        } else {
            return (
                <button className={this.props.className}
                    onClick={this.handleClick}> {this.props.linkText}</button>
            );
        }
    }
}
