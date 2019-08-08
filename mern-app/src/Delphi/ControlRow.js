import React, { Component } from 'react';
import DelphiRowIsCorrect from './RowIsCorrect';
import DelphiSelectCorrection from './SelectCorrection';
import DelphiCorrectionCombine from './Correction/Combine';
import DelphiCorrectionNewMods from './Correction/NewMods';
import DelphiCorrectionNewName from './Correction/NewName';
import DelphiCorrectionNewSyns from './Correction/NewSyns';
import DelphiCorrectionOther from './Correction/Other';
import DelphiCorrectionReassign from './Correction/Reassign';
import DelphiCorrectionReassignTo from './Correction/ReassignTo';
import DelphiCorrectionSpelling from './Correction/Spelling';
import DiagnosisName from './func/DiagnosisName'
import * as DC from './Constants.js'

export default class DelphiControlRow extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        const rowState = this.props.AppObj.state.blocks[this.props.CBlockId][this.props.CNodeId];
        return (

<tr className="delphi-form-row">
    <td width="24"></td>
    <td className="delphi-form-name-cell">
        {DiagnosisName(this.props.CNodeId, this.props.CBlockId, this.props.AppObj)}
    </td>
    <td className="delphi-form-control-centered-cell">
        <DelphiRowIsCorrect AppObj={this.props.AppObj} 
            CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
    </td>
    <td><table><tbody><tr>
        <td>
            <DelphiSelectCorrection AppObj={this.props.AppObj}
                CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
        </td>
        <td className="delphi-form-nopadd-cell">
            { rowState.correction === DC.CORRECTION_SPELLING ?
                <DelphiCorrectionSpelling AppObj={this.props.AppObj}
                    CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} /> : '' }
            { rowState.correction === DC.CORRECTION_NEWNAME ? 
                <DelphiCorrectionNewName AppObj={this.props.AppObj}
                    CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} /> : '' }
            { rowState.correction === DC.CORRECTION_NEWSYNS ? 
                <DelphiCorrectionNewSyns AppObj={this.props.AppObj}
                    CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} /> : '' }
            { rowState.correction === DC.CORRECTION_COMBINE ? 
                <DelphiCorrectionCombine AppObj={this.props.AppObj}
                    CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} /> : '' }
            { rowState.correction === DC.CORRECTION_MOVECAT ? 
                <table><tbody><tr><td><DelphiCorrectionReassign AppObj={this.props.AppObj}
                    CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} /></td>
                    <td>{((rowState.correction === DC.CORRECTION_MOVECAT) &&
                          (rowState.corrmoveto === 99)) ? 
                            <DelphiCorrectionReassignTo AppObj={this.props.AppObj}
                                CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
                    : '' }</td></tr></tbody></table>
                : '' }
            { rowState.correction === DC.CORRECTION_NEWMODS ? 
                <DelphiCorrectionNewMods AppObj={this.props.AppObj}
                    CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} /> : '' }
            { rowState.correction === DC.CORRECTION_OTHER ?
                <DelphiCorrectionOther AppObj={this.props.AppObj}
                    CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} /> : '' }
        </td>
    </tr></tbody></table></td>
</tr>

        );
    }
}
