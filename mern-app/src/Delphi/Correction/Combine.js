import React, { Component } from 'react';

export default class DelphiCombineCorrection extends Component {
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
        const rowState = blockState[this.props.CNodeId];
        const CNodeIds = global.DM_LEVELCBLOCKS[this.props.CBlockId];
        return (
            <select value={rowState.corrcombine.toString()} onChange={this.handleChange}>
                <option value="0" key="0">Please select the diagnosis to combine with...</option>
                {CNodeIds.filter(CNodeId => CNodeId !== this.props.CNodeId)
                    .map(CNodeId =>
                    <option value={CNodeId} key={CNodeId}>{global.DM_LEVELCNODES[CNodeId].name}</option>)}
            </select>
        );
    }
}
