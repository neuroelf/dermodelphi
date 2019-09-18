import React, { Component } from 'react';
import { BLOCK_MARK_AS_CORRECT, CORRECTION_NONE } from './Constants'

export default class DelphiMarkBlockCorrect extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.props.AppObj.refMarkBlockAsCorrect = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.markBlockAsCorrect = this.markBlockAsCorrect.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    
    markBlockAsCorrect(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        const blockState = newState[this.props.CBlockId];
        var CNodes = Object.keys(blockState);
        var numCNodes = CNodes.length;
        var cc;
        for (cc = 0; cc < numCNodes; cc++) {
            if (CNodes[cc] === 'locked') { continue; }
            if (global.DM_LEVELCNODES[CNodes[cc]].status !== 'visible') { continue; }
            var rowState = blockState[CNodes[cc]];
            if (rowState.correction !== CORRECTION_NONE) {
                return;
            }
            newState[this.props.CBlockId][CNodes[cc]].correct = true;
        }
        this.props.AppObj.setState({blocks: newState});
    }

    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        var disabled = blockState.locked;
        if (!disabled) {
            var anymissing = false;
            var CNodes = Object.keys(blockState);
            var numCNodes = CNodes.length;
            var cc;
            for (cc = 0; cc < numCNodes; cc++) {
                if (CNodes[cc] === 'locked') { continue; }
                if (global.DM_LEVELCNODES[CNodes[cc]].status !== 'visible') { continue; }
                var rowState = blockState[CNodes[cc]];
                if (rowState.correction !== CORRECTION_NONE) {
                    disabled = true;
                    break;
                }
                if (!rowState.correct) {
                    anymissing = true;
                }
            }
            if (!anymissing) {
                disabled = true;
            }
        }

        return (
            <button onClick={this.markBlockAsCorrect} ref={this.props.AppObj.refMarkBlockAsCorrect}
                disabled={disabled}>{BLOCK_MARK_AS_CORRECT}</button>
        );
    }
}
