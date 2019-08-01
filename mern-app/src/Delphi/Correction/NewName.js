import React, { Component } from 'react';
import { CORRECTION_NEWNAME_EMPTY } from '../Constants'

export default class DelphiCorrectionNewName extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        newState[this.props.CBlockId][this.props.CNodeId].corrnewname = event.target.value;
        this.props.AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        const blockLocked = blockState.locked;
        const rowState = blockState[this.props.CNodeId];
        return (
            <input className="delphi-form-minwidth" disabled={!!blockLocked}
                type="text" placeholder={CORRECTION_NEWNAME_EMPTY}
                value={rowState.corrnewname} onChange={this.handleChange} />
        );
    }
}
