import React, { Component } from 'react';
import * as DCONST from './DelphiConstants.js'

export default class DelphiSelectCorrection extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        newState[this.props.CBlockId][this.props.CNodeId].correction = event.target.value;
        this.props.AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        const rowState = blockState[this.props.CNodeId];
        const CNode = global.DM_LEVELCNODES[this.props.CNodeId];
        return (
            <select value={rowState.correction} onChange={this.handleChange} disabled={!!rowState.correct}>
                <option value={DCONST.CORRECTION_NONE} key={0}>Correction needed...</option>
                <option value={DCONST.CORRECTION_TYPO} key={1}>Wrong spelling / typo</option>
                <option value={DCONST.CORRECTION_NEWNAME} key={2}>Suggest different name</option>
                <option value={DCONST.CORRECTION_ADDSYN} key={11}>Additional synonyms</option>
                <option value={DCONST.CORRECTION_COMBINE} key={21}>Combine with other diagnosis</option>
                <option value={DCONST.CORRECTION_MOVETOCAT} key={22}>Assign to a different category</option>
                <option value={DCONST.CORRECTION_ADDMODS} key={31}>Add modifiers</option>
                { CNode.modifiers.length === 0 ?
                    <option value={DCONST.CORRECTION_DELMODS} key={32} disabled>Remove modifiers</option>
                    :
                    <option value={DCONST.CORRECTION_DELMODS} key={32}>Remove modifiers</option>
                }
                { CNode.modifiers.length === 0 ?
                    <option value={DCONST.CORRECTION_EDITMODS} key={33} disabled>Edit modifiers</option>
                    :
                    <option value={DCONST.CORRECTION_EDITMODS} key={33}>Edit modifiers</option>
                }
                <option value={DCONST.CORRECTION_DELETE} key={41}>Remove diagnosis completely</option>
                <option value={DCONST.CORRECTION_OTHER} key={91}>Other (please specify!)</option>
            </select>
        );
    }
}
