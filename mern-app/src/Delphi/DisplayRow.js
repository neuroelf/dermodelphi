import React, { Component } from 'react';
import DiagnosisDone from './func/DiagnosisDone'
import DiagnosisName from './func/DiagnosisName'
import DelphiLinkSetState from './LinkSetState'
import { TABLE_CORRECT, TABLE_CORRECTED, TABLE_CORRECT_NOT_YET } from './Constants.js'

export default class DelphiDisplayRow extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        const { CNodeId, CBlockId } = { ...this.props };
        const rowState = this.props.AppObj.state.blocks[CBlockId][CNodeId];
        var firstNode = false;
        var blockNum = null;
        var firstNodeClass = 'delphi-form-row';
        if (CNodeId % 100 === 1) {
            firstNode = true;
            blockNum = (((CNodeId - 1) / 100) % 100).toString();
            firstNodeClass = 'delphi-form-row-first';
        }
        var nodeStatus = global.DM_LEVELCNODES[CNodeId].status;
        var rowDone = (nodeStatus !== 'visible') ? nodeStatus : DiagnosisDone(rowState);
        return (
        
<tr className={firstNodeClass}>
    <td width="60">{(firstNode) ? "Bl." + blockNum : null}</td>
    <td className="delphi-form-wide-name-cell" width="85%">
        {DiagnosisName(this.props.CNodeId, this.props.CBlockId, this.props.AppObj)}
    </td>
    <td className="delphi-form-control-cell" align="right"><span><small>
        {
            rowState.correct ?
                <span>{TABLE_CORRECT}</span> : 
            (!rowDone) ?
                <font color="red"><i><DelphiLinkSetState AppObj={this.props.AppObj}
                    stateProp="currentCBlockId" stateValue={this.props.CBlockId}
                    linkText={TABLE_CORRECT_NOT_YET} /></i></font> :
            (nodeStatus === 'visible') ?
                <b>{TABLE_CORRECTED}</b> :
                <b>{nodeStatus}</b> }
    </small></span></td>
    <td></td>
</tr>

        );
    }
}
