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
        const { AppObj  } = { ...this.props };
        for (var cc = 0; cc < global.DM_LEVELCBLOCKIDS.length; cc++) {
            if (cc === 0) {
                AppObj.saveSessionBlock(this.nullHook, global.DM_LEVELCBLOCKIDS[cc]);
            } else {
                AppObj.saveSessionBlock(null, global.DM_LEVELCBLOCKIDS[cc]);
            }
        }
        window.alert('All data saved.');
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
