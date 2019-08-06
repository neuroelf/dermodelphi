import React, { Component } from 'react';
import DiagnosisDone from './func/DiagnosisDone';
import * as DC from './Constants'

export default class DelphiNextBlock extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.props.AppObj.refNextBlock = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goToNextBlock = this.goToNextBlock.bind(this);
        this.saveBlock = this.saveBlock.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    
    saveBlock(event) {
        event.preventDefault();
        const AppObj = this.props.AppObj;
        const { blocks } = { ...AppObj.state };
        if (this.props.continue === 'yes') {
            var currentCBlockId = parseInt(this.props.CBlockId);
            const newState = Object.assign({}, blocks);
            newState[currentCBlockId].locked = true;
            AppObj.setState({
                blocks: newState
            }, () => {
                AppObj.saveSessionBlock(this.goToNextBlock);
            });
        } else {
            AppObj.saveSessionBlock(this.props.AppObj.nullHook);
        }
    }
    goToNextBlock() {
        
        // lock and advance block
        const { blocks, historyCBlockId } = { ...this.props.AppObj.state };
        var currentCBlockId = parseInt(this.props.CBlockId);
        var nextCBlockId = DC.BLOCKS_ALL;
        const newState = Object.assign({}, blocks);
        const newHistoryBlockId = [ ...historyCBlockId]
        newState[currentCBlockId].locked = true;
        newHistoryBlockId.push(currentCBlockId)
        var bc;
        for (bc = 0; bc < global.DM_LEVELCBLOCKIDS.length; bc++) {
            if (global.DM_LEVELCBLOCKIDS[bc] === currentCBlockId) {
                if (bc < (global.DM_LEVELCBLOCKIDS.length - 1)) {
                    nextCBlockId = global.DM_LEVELCBLOCKIDS[bc+1];
                }
            }
        }
        
        this.props.AppObj.setState({
            blocks: newState,
            currentCBlockId: nextCBlockId,
            historyCBlockId: newHistoryBlockId
        });
    }

    // this component contains the (rendering) logic as to whether
    // or not a user can continue with the next block
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        var disabled = false;
        var CNodes = Object.keys(blockState);
        var numCNodes = CNodes.length;
        var cc;
        var lastBlock = this.props.CBlockId === global.DM_LEVELCBLOCKIDS[global.DM_LEVELCBLOCKIDS.length - 1];

        // iterating over all nodes (rows)
        for (cc = 0; cc < numCNodes; cc++) {

            // skipping the "locked" entry
            if (CNodes[cc] === 'locked') { continue; }

            // if a control is not marked as correct and no selection made
            if (!DiagnosisDone(blockState[CNodes[cc]])) {
                disabled = true;
                break;
            }
        }

        // if it's not the last block, show next block, otherwise to review
        if (!lastBlock) {
            if (this.props.continue === 'yes') {
                return (
                    <button onClick={this.saveBlock} ref={this.props.AppObj.refNextBlock}
                        disabled={disabled}>{DC.BLOCK_NEXT}</button>
                );
            } else {
                return (
                    <button onClick={this.saveBlock}>{DC.BLOCK_SAVE}</button>
                );
            }
        } else {
            if (this.props.continue === 'yes') {
                return (
                    <button onClick={this.saveBlock}
                        disabled={disabled}>{DC.BLOCK_REVIEW_ALL}</button>
                );
            } else {
                return (
                    <button onClick={this.saveBlock}>{DC.BLOCK_SAVE}</button>
                );
            }
        }
    }
}
