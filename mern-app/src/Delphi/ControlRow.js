import React, { Component } from 'react'
import DelphiRowIsCorrect from './RowIsCorrect'
import DelphiFormatPaint from './FormatPaint'
import DelphiFormatReset from './FormatReset'
import DelphiSelectCorrection from './SelectCorrection'
import DelphiCorrectionCombine from './Correction/Combine'
import DelphiCorrectionEditMods from './Correction/EditMods'
import DelphiCorrectionEditSyns from './Correction/EditSyns'
import DelphiCorrectionNewMods from './Correction/NewMods'
import DelphiCorrectionNewName from './Correction/NewName'
import DelphiCorrectionNewSyns from './Correction/NewSyns'
import DelphiCorrectionOther from './Correction/Other'
import DelphiCorrectionReassign from './Correction/Reassign'
import DelphiCorrectionSpelling from './Correction/Spelling'
import DiagnosisName from './func/DiagnosisName'
import * as DC from './Constants.js'

export default class DelphiControlRow extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        const { AppObj, CBlockId, CNodeId } = { ...this.props};
        const { blocks } = { ...AppObj.state};
        const rowState = blocks[CBlockId][CNodeId];
        var blockLocked = blocks[CBlockId]['locked'];
        var rowIsIncomplete = ((!rowState.correct) && (
            (rowState.correction === DC.CORRECTION_NONE) ||
            ((rowState.correction === DC.CORRECTION_SPELLING) && (rowState.corrspelling === '')) ||
            ((rowState.correction === DC.CORRECTION_NEWNAME) && (rowState.corrnewname === '')) ||
            ((rowState.correction === DC.CORRECTION_NEWSYNS) && (rowState.corrnewsyns === '')) ||
            ((rowState.correction === DC.CORRECTION_EDITSYNS) && (rowState.correditsyns === '')) ||
            ((rowState.correction === DC.CORRECTION_NEWMODS) && (rowState.corrnewmods === '')) ||
            ((rowState.correction === DC.CORRECTION_EDITMODS) && (rowState.correditmods === '')) ||
            ((rowState.correction === DC.CORRECTION_COMBINE) && (rowState.corrcombine === 0)) ||
            ((rowState.correction === DC.CORRECTION_MOVECAT) && (rowState.corrmoveto === 0)) ||
            ((rowState.correction === DC.CORRECTION_OTHER) && (rowState.corrother === ''))
        ));
        if (global.DM_LEVELCNODES[CNodeId].status === 'locked') {
            blockLocked = true;
            rowIsIncomplete = false;
            rowState.correct = true;
            rowState.correction = DC.CORRECTION_NONE;
        }
        var controlClass, selectClass;
        if (rowIsIncomplete) {
            controlClass = 'delphi-form-incomplete-control-cell';
        } else {
            controlClass = 'delphi-form-control-cell';
        }
        if ((!rowState.correct) && (rowState.correction === DC.CORRECTION_NONE)) {
            selectClass = 'delphi-form-incomplete-control-cell';
        } else {
            selectClass = 'delphi-form-control-cell';
        }
        return (

<tr className="delphi-form-row">
    <td width="24"></td>
    <td className="delphi-form-name-cell">
        {DiagnosisName(CNodeId, CBlockId, AppObj)}
    </td>
    <td className="delphi-form-control-centered-cell">
        <DelphiRowIsCorrect AppObj={AppObj} 
            CBlockId={CBlockId} CNodeId={CNodeId} />
    </td>
    <td><table><tbody><tr>
        <td className={selectClass}>
            <DelphiSelectCorrection AppObj={AppObj}
                CBlockId={CBlockId} CNodeId={CNodeId} />
        </td>
        <td>{
            ((!blockLocked) &&
            (!rowState.correct) &&
            (rowState.correction !== DC.CORRECTION_NONE)) ?
            <DelphiFormatReset AppObj={AppObj} CNodeId={CNodeId} /> : "" }
        </td>
        <td className={controlClass + " delphi-form-nopadd-cell"}>
            { rowState.correction === DC.CORRECTION_NEWNAME ? 
                <DelphiCorrectionNewName AppObj={AppObj}
                    CBlockId={CBlockId} CNodeId={CNodeId} /> : ''
            }
            { rowState.correction === DC.CORRECTION_SPELLING ?
                <DelphiCorrectionSpelling AppObj={AppObj}
                    CBlockId={CBlockId} CNodeId={CNodeId} /> : ''
            }
            { rowState.correction === DC.CORRECTION_COMBINE ? 
                <DelphiCorrectionCombine AppObj={AppObj}
                    CBlockId={CBlockId} CNodeId={CNodeId} /> : ''
            }
            { rowState.correction === DC.CORRECTION_MOVECAT ? 
                <DelphiCorrectionReassign AppObj={AppObj}
                    CBlockId={CBlockId} CNodeId={CNodeId} /> : ''
            }
            { rowState.correction === DC.CORRECTION_EDITSYNS ? 
                <DelphiCorrectionEditSyns AppObj={AppObj}
                    CBlockId={CBlockId} CNodeId={CNodeId} /> : ''
            }
            { rowState.correction === DC.CORRECTION_NEWSYNS ? 
                <DelphiCorrectionNewSyns AppObj={AppObj}
                    CBlockId={CBlockId} CNodeId={CNodeId} /> : ''
            }
            { rowState.correction === DC.CORRECTION_EDITMODS ? 
                <DelphiCorrectionEditMods AppObj={AppObj}
                    CBlockId={CBlockId} CNodeId={CNodeId} /> : ''
            }
            { rowState.correction === DC.CORRECTION_NEWMODS ? 
                <DelphiCorrectionNewMods AppObj={AppObj}
                    CBlockId={CBlockId} CNodeId={CNodeId} /> : ''
            }
            { rowState.correction === DC.CORRECTION_OTHER ?
                <DelphiCorrectionOther AppObj={AppObj}
                    CBlockId={CBlockId} CNodeId={CNodeId} /> : ''
            }
        </td><td>
            { (((CNodeId % 100) === 1) && (!blockLocked) &&
               (((rowState.correction === DC.CORRECTION_NEWMODS) &&
                 (rowState.corrnewmods !== '')) ||
                ((rowState.correction === DC.CORRECTION_MOVECAT) &&
                 (rowState.corrmoveto !== 0)) ||
                ((rowState.correction === DC.CORRECTION_OTHER) &&
                 (rowState.corrother !== '')))) ?
                <DelphiFormatPaint AppObj={AppObj} CNodeId={CNodeId} /> : "" }
        </td>
    </tr></tbody></table></td>
</tr>

        );
    }
}
