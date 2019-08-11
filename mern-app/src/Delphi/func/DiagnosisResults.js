import React from 'react'
import * as DC from '../Constants'

function changesCell(CNodeId, sessionId, changeItem) {
    return <li key={"ci" + sessionId + '_' + CNodeId.toString() + "_" + changeItem.type}>
        <span><b>{changeItem.type}</b>
        {(changeItem.label !== '') ? ': ' : ''}<font color="#d8d8d8"> {changeItem.label}</font></span>
    </li>
}
function resultCell(CNodeId, sessionId, cnodeState) {
    var changes = [];
    var combineId, combineCatId;
    if (cnodeState.correction === DC.CORRECTION_DELETE) {
        changes.push({
            type: DC.CORRECTION_DELETE_TXT,
            label: ''
        });
    } else {
        if (cnodeState.corrcombine === 0) {
            if (cnodeState.corrnewname !== '') {
                changes.push({
                    type: DC.CORRECTION_NEWNAME_TXT,
                    label: cnodeState.corrnewname
                });
            } else {
                if (cnodeState.corrspelling !== '') {
                    changes.push({
                        type: DC.CORRECTION_SPELLING_TXT,
                        label: cnodeState.corrspelling
                    });
                }
            }
            if (cnodeState.corrnewsyns !== '') {
                changes.push({
                    type: DC.CORRECTION_NEWSYNS_TXT,
                    label: cnodeState.corrnewsyns.split(';').join(', ')
                });
            }
            if (cnodeState.corrnewmods !== '') {
                changes.push({
                    type: DC.CORRECTION_NEWMODS_TXT,
                    label: cnodeState.corrnewmods.split(';').join(', ')
                });
            }
            if (cnodeState.correction === DC.CORRECTION_DELMODS) {
                changes.push({
                    type: DC.CORRECTION_DELMODS_TXT,
                    label: ''
                });
            }
            if (cnodeState.corrmoveto !== 0) {
                combineCatId = cnodeState.corrmoveto;
                if (combineCatId in global.DM_LEVELBFULLNAMES) {
                    changes.push({
                        type: DC.CORRECTION_MOVECAT_TXT,
                        label: global.DM_LEVELBFULLNAMES[combineCatId]
                    });
                } else {
                    if (cnodeState.corrmovetox !== '') {
                        changes.push({
                            type: DC.CORRECTION_MOVECAT_TXT,
                            label: cnodeState.corrmovetox
                        });    
                    }
                }
            }
            if ((cnodeState.correction === DC.CORRECTION_OTHER) && (cnodeState.corrother !== '')) {
                changes.push({
                    type: DC.CORRECTION_OTHER_TXT,
                    label: cnodeState.corrother
                });
            }
        } else {
            combineId = cnodeState.corrcombine;
            combineCatId = Math.floor(combineId / 10000);
            if ((combineId in global.DM_LEVELCNODES) && (combineCatId in global.DM_LEVELBFULLNAMES)) {
                changes.push({
                    type: DC.CORRECTION_COMBINE_TXT,
                    label: global.DM_LEVELBFULLNAMES[combineCatId] + ' - ' + global.DM_LEVELCNODES[combineId].name
                });    
            }
        }
    }
    return <td className="delphi-diagnosis-results-table">
<ul>{changes.map(c => changesCell(CNodeId, sessionId, c))}</ul></td>
}

function resultRow(CNodeId, adminSubBlock) {
    var sessionId = adminSubBlock.sessionId;
    const cnodeState = adminSubBlock.block[CNodeId];
    return <tr className="delphi-diagnosis-results-table" key={'cr' + adminSubBlock.sessionId + '_' + CNodeId.toString()}>
        <td className="delphi-diagnosis-results-table">{adminSubBlock.sessionId}</td>
        <td className="delphi-diagnosis-results-table">{(!!cnodeState.correct) ? DC.TXT_RESULTS_APPROVE :
             (cnodeState.correction === DC.CORRECTION_NONE) ? DC.TXT_RESULTS_PENDING :
             DC.TXT_RESULTS_CORRECTED}</td>
        {(!cnodeState.correct && cnodeState.correction !== DC.CORRECTION_NONE) ? resultCell(CNodeId, sessionId, cnodeState) : <td></td>}
    </tr>
}

// this function performs a series of mangling steps
export default function DiagnosisResults(CNodeId, adminBlock) {

    if (adminBlock === null || adminBlock === undefined || adminBlock.length === 0) {
        return <div className="delphi-diagnosis-results">{DC.TXT_RESULTS_NORESULTS}</div>
    }

    return <div className="delphi-diagnosis-results">
<table className="delphi-diagnosis-results-table"><tbody>
    <tr className="delphi-diagnosis-results-table" key="000000">
        <td className="delphi-diagnosis-results-table" colSpan="3">{adminBlock.length.toString() + DC.TXT_RESULTS_NUMRATERS}</td>
    </tr>
    <tr className="delphi-diagnosis-results-table" key="000001">
        <th className="delphi-diagnosis-results-table">{DC.TXT_RESULTS_RATERID}</th>
        <th className="delphi-diagnosis-results-table">{DC.TXT_RESULTS_STATUS}</th>
        <th className="delphi-diagnosis-results-table" width="320">{DC.TXT_RESULTS_CORRECTIONS}</th>
    </tr>
    {adminBlock.map(b => resultRow(CNodeId, b))}
</tbody></table>
    </div>;
}
