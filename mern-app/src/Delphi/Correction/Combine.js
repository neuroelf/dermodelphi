import React, { Component } from 'react';
import { CORRECTION_COMBINE_SELECT } from '../Constants'

export default class DelphiCorrectionCombine extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        newState[this.props.CBlockId][this.props.CNodeId].corrcombine = parseInt(event.target.value);
        this.props.AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        const blockLocked = blockState.locked;
        var thisCNodeId = this.props.CNodeId;
        var thisBCatId = Math.floor(thisCNodeId / 10000);
        const rowState = blockState[thisCNodeId];
        var CNodeIds = [];
        const blockIds = Object.keys(global.DM_LEVELCBLOCKS).filter(
            key => Math.floor(key / 100) === thisBCatId);
        for (var bc = 0; bc < blockIds.length; bc++) {
            var blockNodes = global.DM_LEVELCBLOCKS[blockIds[bc]];
            for (var nc = 0; nc < blockNodes.length; nc++) {
                if (blockNodes[nc] !== thisCNodeId) {
                    CNodeIds.push(blockNodes[nc]);
                }
            }
        }
        return (
            <select value={rowState.corrcombine.toString()}
                disabled={!!blockLocked} onChange={this.handleChange}>
                <option value="0" key="0">{CORRECTION_COMBINE_SELECT}</option>
                {CNodeIds.map(CNodeId =>
                    <option value={CNodeId} key={CNodeId}>{global.DM_LEVELCNODES[CNodeId].name}</option>)}
            </select>
        );
    }
}
