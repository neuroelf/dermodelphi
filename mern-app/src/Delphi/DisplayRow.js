import React, { Component } from 'react';
import DiagnosisDone from './func/DiagnosisDone'
import DiagnosisName from './func/DiagnosisName'
import { TABLE_CORRECT, TABLE_CORRECTED, TABLE_CORRECT_NOT_YET } from './Constants.js'

export default class DelphiDisplayRow extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        const rowState = this.props.AppObj.state.blocks[this.props.CBlockId][this.props.CNodeId];
        var firstNodeClass = 'delphi-form-row';
        if (this.props.CNodeId % 100 === 1) {
            firstNodeClass = 'delphi-form-row-first';
        }

        var rowDone = DiagnosisDone(rowState);
        return (
        
<tr className={firstNodeClass}>
    <td width="24"></td>
    <td className="delphi-form-wide-name-cell">
        {DiagnosisName(this.props.CNodeId, this.props.CBlockId, this.props.AppObj.state)}
    </td>
    <td className="delphi-form-control-cell" align="right"><span><small>
        {
            rowState.correct ?
                <span>{TABLE_CORRECT}</span> : 
            (!rowDone) ?
                <font color="red"><i>{TABLE_CORRECT_NOT_YET}</i></font> :
                <b>{TABLE_CORRECTED}</b> }
    </small></span></td>
    <td></td>
</tr>

        );
    }
}
