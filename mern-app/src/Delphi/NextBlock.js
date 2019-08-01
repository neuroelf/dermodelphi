import React, { Component } from 'react';
import * as DC from './Constants'

export default class DelphiNextBlock extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goToNextBlock = this.goToNextBlock.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    
    goToNextBlock(event) {
        event.preventDefault();
        const { blocks } = { ...this.props.AppObj.state };
        var currentCBlockId = parseInt(this.props.CBlockId);
        var nextCBlockId = DC.BLOCKS_ALL;
        const newState = blocks;
        newState[currentCBlockId].locked = true;
        var bc;
        for (bc = 0; bc < global.DM_LEVELCBLOCKIDS.length; bc++) {
            if (global.DM_LEVELCBLOCKIDS[bc] === currentCBlockId) {
                if (bc < (global.DM_LEVELCBLOCKIDS.length - 1)) {
                    nextCBlockId = global.DM_LEVELCBLOCKIDS[bc+1];
                }
            }
        }
        
        this.props.AppObj.setState({blocks: newState, currentCBlockId: nextCBlockId});
    }

    // this component contains the (rendering) logic as to whether
    // or not a user can continue with the next block
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        var disabled = false;
        var anymissing = false;
        var CNodes = Object.keys(blockState);
        var numCNodes = CNodes.length;
        var cc;
        var lastBlock = this.props.CBlockId === global.DM_LEVELCBLOCKIDS[global.DM_LEVELCBLOCKIDS.length - 1];

        // iterating over all nodes (rows)
        for (cc = 0; cc < numCNodes; cc++) {

            // skipping the "locked" entry
            if (CNodes[cc] === 'locked') { continue; }

            // checking the rowState
            var rowState = blockState[CNodes[cc]];

            // if a control is not marked as correct and no selection made
            if ((!rowState.correct) && (rowState.correction === DC.CORRECTION_NONE)) {

                // no need to look any further
                disabled = true;
                break;
            }

            // if, on the other hand, the row state *is* correct, check next
            if (rowState.correct) { continue; }

            // otherwise, we check depending on the state of correction
            switch (rowState.correction) {
                case DC.CORRECTION_SPELLING:
                    if (rowState.corrspelling === '') {
                        anymissing = true;
                    }
                    break;
                case DC.CORRECTION_NEWNAME:
                    if (rowState.corrnewname === '') {
                        anymissing = true;
                    }
                    break;
                case DC.CORRECTION_NEWSYNS:
                    if (rowState.corrnewsyns === '') {
                        anymissing = true;
                    }
                    break;
                case DC.CORRECTION_COMBINE:
                    if (rowState.corrcombine === 0) {
                        anymissing = true;
                    }
                    break;
                case DC.CORRECTION_MOVECAT:
                    if (rowState.corrmoveto === 0) {
                        anymissing = true;
                    }
                    if ((rowState.corrmoveto === DC.BLOCKS_ALL) &&
                        (rowState.corrmovetox === '')) {
                        anymissing = true;
                    }
                    break;
                case DC.CORRECTION_NEWMODS:
                    if (rowState.corrnewmods === '') {
                        anymissing = true;
                    }
                    break;
                case DC.CORRECTION_OTHER:
                    if (rowState.corrother === '') {
                        anymissing = true;
                    }
                    break;
                default:
                    break;
            }
            if (anymissing) {
                break;
            }
        }
        if (anymissing) {
            disabled = true;
        }

        // if it's not the last block, show next block, otherwise to review
        if (!lastBlock) {
            return (
                <button onClick={this.goToNextBlock}
                    disabled={disabled}>{DC.BLOCK_NEXT}</button>
            );
        } else {
            return (
                <button onClick={this.goToNextBlock}
                    disabled={disabled}>{DC.BLOCK_REVIEW_ALL}</button>
            );
        }
    }
}
