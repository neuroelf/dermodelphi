import React, { Component } from 'react';
import { CORRECTION_NONE } from './Constants'

export default class DelphiRowIsCorrect extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        const rowState = newState[this.props.CBlockId][this.props.CNodeId];
        newState[this.props.CBlockId][this.props.CNodeId].correct = !rowState.correct;
        this.props.AppObj.setState({blocks: newState});
    }

    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        const rowState = blockState[this.props.CNodeId];
        var disabled = blockState.locked;
        if (rowState.correction !== CORRECTION_NONE) {
            disabled = true;
        }
        return (
            <input type="checkbox" checked={!!rowState.correct}
             onChange={this.handleChange} disabled={disabled} />
        );
    }
}
