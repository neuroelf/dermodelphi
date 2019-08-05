import React, { Component } from 'react';
import * as DC from './Constants'

export default class DelphiGoBack extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    
    goBack(event) {
        event.preventDefault();
        const { historyCBlockId } = { ...this.props.AppObj.state };
        const newHistoryCBlockId = [ ...historyCBlockId]
        var nextCBlockId = 0
        if (newHistoryCBlockId.length > 0) {
            nextCBlockId = newHistoryCBlockId.pop();
        }
        this.props.AppObj.setState({
            currentCBlockId: nextCBlockId,
            historyCBlockId: newHistoryCBlockId
        });
    }

    // this component contains the (rendering) logic as to whether
    // or not a user can continue with the next block
    render() {
        const blockHistory = this.props.AppObj.state.historyCBlockId;

        return (
            <button onClick={this.goBack}
                disabled={blockHistory.length === 0}>{DC.BLOCK_PREVIOUS}</button>
        );
    }
}
