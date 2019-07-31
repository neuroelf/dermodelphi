import React, { Component } from 'react';

export default class DelphiReassignCorrection extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        newState[this.props.CBlockId][this.props.CNodeId].corrmoveto = parseInt(event.target.value);
        this.props.AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        var thisBNodeId = Math.floor(parseInt(this.props.CBlockId) / 100);
        const rowState = blockState[this.props.CNodeId];
        return (
            <select value={rowState.corrmoveto.toString()} onChange={this.handleChange}>
                <option value="0" key="0">Please select the category to move this to...</option>
                <option value="99" key="99">Other (please specify...)</option>
                {Object.keys(global.DM_LEVELBFULLNAMES).filter(BNodeId => BNodeId !== thisBNodeId)
                    .map(BNodeId =>
                    <option value={BNodeId} key={BNodeId}>{global.DM_LEVELBFULLNAMES[BNodeId]}</option>)}
            </select>
        );
    }
}
