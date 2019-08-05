import React, { Component } from 'react';
import * as DC from './Constants'

export default class DelphiSubmit extends Component {
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
        const { user, sessionId, sessionDate,
            newAs, newBs, newCs, blocks  } = { ...this.props.AppObj.state };
        const submitObj = {
            user: user,
            sessionId: sessionId,
            sessionDate: sessionDate,
            newAs: newAs,
            newBs: newBs,
            newCs: newCs,
            blocks: blocks
        };
        console.log(JSON.stringify(submitObj));
    }

    // this component contains the (rendering) logic as to whether
    // or not a user can continue with the next block
    render() {
        const { blocks } = { ...this.props.AppObj.state };
        var disabled = false;
        const blockIds = Object.keys(blocks);
        for (var bc = 0; bc < blockIds.length; bc++) {
            const block = blocks[blockIds[bc]];
            if (!block.locked) {
                disabled = true;
                break;
            }
        }

        return (
            <button onClick={this.handleClick}
                disabled={disabled}>{DC.TXT_SUBMIT}</button>
        );
    }
}
