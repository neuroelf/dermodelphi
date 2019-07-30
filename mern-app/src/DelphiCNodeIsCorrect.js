import React, { Component } from 'react';
import * as DCONST from './DelphiConstants'

class DelphiCNodeIsCorrect extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        const rowState = newState[this.props.CBlockId][this.props.CNodeId];
        newState[this.props.CBlockId][this.props.CNodeId].correct = !rowState.correct;
        this.props.AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        const rowState = blockState[this.props.CNodeId];
        var disabled = blockState.locked;
        if (rowState.correction !== DCONST.CORRECTION_NONE) {
            disabled = true;
        }
        return (
            <input type="checkbox" checked={!!rowState.correct}
             onChange={this.handleChange} disabled={disabled} />
        );
    }
}

export default DelphiCNodeIsCorrect;
