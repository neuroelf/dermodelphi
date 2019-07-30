import React, { Component } from 'react';
import * as DCONST from './DelphiConstants'

class DelphiNextBlockButton extends Component {
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
        const { blocks } = { ...this.props.AppObj.state };
        const { history } = { ...this.props };
        var currentCBlockId = parseInt(this.props.CBlockId);
        var nextCBlockId = 0;
        const newState = blocks;
        newState[currentCBlockId].locked = true;
        var bc;
        for (bc = 0; bc < global.DM_LEVELCBLOCKIDS.length; bc++) {
            console.log([global.DM_LEVELCBLOCKIDS[bc], currentCBlockId]);
            if (global.DM_LEVELCBLOCKIDS[bc] === currentCBlockId) {
                if (bc < (global.DM_LEVELCBLOCKIDS.length - 1)) {
                    nextCBlockId = global.DM_LEVELCBLOCKIDS[bc+1];
                }
            }
        }
        
        this.props.AppObj.setState({blocks: newState, currentCBlockId: nextCBlockId});
        history.push('/block/' + nextCBlockId.toString());
    }

    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        var disabled = false;
        var anymissing = false;
        var CNodes = Object.keys(blockState);
        var numCNodes = CNodes.length;
        var cc;
        var lastBlock = this.props.CBlockId === global.DM_LEVELCBLOCKIDS[global.DM_LEVELCBLOCKIDS.length - 1];
        for (cc = 0; cc < numCNodes; cc++) {
            if (CNodes[cc] === 'locked') { continue; }
            var rowState = blockState[CNodes[cc]];
            if ((!rowState.correct) && (rowState.correction === DCONST.CORRECTION_NONE)) {
                disabled = true;
                break;
            }
            if (rowState.correct) { continue; }
            switch (rowState.correction) {
                case DCONST.CORRECTION_ADDMODS:
                    if (rowState.corraddmods === '') {
                        anymissing = true;
                    }
                    break;
                case DCONST.CORRECTION_TYPO:
                    if (rowState.corrspelling === '') {
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

        if (!lastBlock) {
            return (
                <button onClick={this.goToNextBlock}
                    disabled={disabled}>Continue with the next block</button>
            );
        } else {
            return (
                <button onClick={this.goToOverview}
                    disabled={disabled}>Review all choices</button>
            );
        }
    }
}

export default DelphiNextBlockButton;
