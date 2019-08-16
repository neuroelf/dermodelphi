import React from 'react'
import * as DC from '../Constants'

function changesCell(CNodeId, sessionId, changeItem) {
    return <li key={"ci" + sessionId + '_' + CNodeId.toString() + "_" + changeItem.type}>
        <span><b>{changeItem.type}</b>
        {(changeItem.label !== '') ? ': ' : ''}<font color="#d8d8d8"> {changeItem.label}</font></span>
    </li>
}
function resultCell(CNodeId, sessionId, cnodeState, adminSessions) {
    var changes = [];
    var combineId, combineCatId, moveCatId;
    if (cnodeState.correction === DC.CORRECTION_DELETE) {
        changes.push({
            type: DC.CORRECTION_DELETE_TXT,
            label: ''
        });
        return  <td className="delphi-diagnosis-results-table"><ul>
                    {changes.map(c => changesCell(CNodeId, sessionId, c))}
                </ul></td>
    }
    if (cnodeState.corrcombine !== 0) {
        combineId = cnodeState.corrcombine;
        combineCatId = Math.floor(combineId / 10000);
        if ((combineId in global.DM_LEVELCNODES) && (combineCatId in global.DM_LEVELBFULLNAMES)) {
            changes.push({
                type: DC.CORRECTION_COMBINE_TXT,
                label: global.DM_LEVELBFULLNAMES[combineCatId] + ' - ' + global.DM_LEVELCNODES[combineId].name
            });    
        } else {
            changes.push({
                type: DC.CORRECTION_COMBINE_TXT,
                label: DC.CORRECTION_COMBINE_USER_DEFINED_TXT
            });    
        }
        return  <td className="delphi-diagnosis-results-table"><ul>
                    {changes.map(c => changesCell(CNodeId, sessionId, c))}
                </ul></td>
    }
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
    if ((cnodeState.correction === DC.CORRECTION_DELBOTH) ||
        (cnodeState.correction === DC.CORRECTION_DELSYNS)) {
        changes.push({
            type: DC.CORRECTION_DELSYNS_TXT,
            label: ''
        });
    }
    if (cnodeState.correditsyns !== '') {
        changes.push({
            type: DC.CORRECTION_EDITSYNS_TXT,
            label: cnodeState.correditsyns.split(';').join(', ')
        });
    }
    if (cnodeState.corrnewsyns !== '') {
        changes.push({
            type: DC.CORRECTION_NEWSYNS_TXT,
            label: cnodeState.corrnewsyns.split(';').join(', ')
        });
    }
    if ((cnodeState.correction === DC.CORRECTION_DELBOTH) ||
        (cnodeState.correction === DC.CORRECTION_DELMODS)) {
        changes.push({
            type: DC.CORRECTION_DELMODS_TXT,
            label: ''
        });
    }
    if (cnodeState.correditmods !== '') {
        changes.push({
            type: DC.CORRECTION_EDITMODS_TXT,
            label: cnodeState.correditmods.split(';').join(', ')
        });
    }
    if (cnodeState.corrnewmods !== '') {
        changes.push({
            type: DC.CORRECTION_NEWMODS_TXT,
            label: cnodeState.corrnewmods.split(';').join(', ')
        });
    }
    if (cnodeState.corrmoveto !== 0) {
        moveCatId = cnodeState.corrmoveto;
        if (moveCatId in global.DM_LEVELBFULLNAMES) {
            changes.push({
                type: DC.CORRECTION_MOVECAT_TXT,
                label: global.DM_LEVELBFULLNAMES[moveCatId]
            });
        } else {
            var moveCatA = '', moveCatB = '', cc;
            if (sessionId in adminSessions) {
                const adminSession = adminSessions[sessionId];
                for (cc = 0; cc < adminSession['newBs'].length; cc++) {
                    if (adminSession['newBs'][cc]['id'] === moveCatId) {
                        moveCatB = adminSession['newBs'][cc]['name'];
                        if (moveCatId < 300) {
                            moveCatA = global.DM_LEVELANAMES[Math.floor(moveCatId / 100)]
                        } else {
                            var moveSCatId = Math.floor(moveCatId / 100);
                            for (cc = 0; cc < adminSession['newAs'].length; cc++) {
                                if (adminSession['newAs'][cc]['id'] === moveSCatId) {
                                    moveCatA = adminSession['newAs'][cc]['name'];
                                    break;
                                }
                            }
                        }
                        if (moveCatA === '') {
                            moveCatA = DC.CORRECTION_MOVECAT_SCAT_UNKNOWN;
                        }
                        break;
                    }
                }
            } else {
                moveCatA = DC.CORRECTION_MOVECAT_SCAT_UNKNOWN;
                moveCatB = DC.CORRECTION_MOVECAT_USER;
            }
            changes.push({
                type: DC.CORRECTION_MOVECAT_TXT,
                label: moveCatA + ' - ' + moveCatB + DC.CORRECTION_MOVECAT_USER
            });    
        }
    }
    if (cnodeState.corrother !== '') {
        changes.push({
            type: DC.CORRECTION_OTHER_TXT,
            label: cnodeState.corrother
        });
    }
    return  <td className="delphi-diagnosis-results-table"><ul>
                {changes.map(c => changesCell(CNodeId, sessionId, c))}
            </ul></td>
}

function resultRow(CNodeId, adminSubBlock, adminSessions) {
    var sessionId = adminSubBlock.sessionId;
    if (!(CNodeId in adminSubBlock.block)) {
        return <tr className="delphi-diagnosis-results-table" key={'cr' + adminSubBlock.sessionId + '_' + CNodeId.toString()}>
            <td className="delphi-diagnosis-results-table">{adminSubBlock.sessionId}</td>
            <td className="delphi-diagnosis-results-table">{DC.TXT_RESULTS_PENDING}</td>
            <td></td>
        </tr>
    }
    const cnodeState = adminSubBlock.block[CNodeId];
    return <tr className="delphi-diagnosis-results-table" key={'cr' + adminSubBlock.sessionId + '_' + CNodeId.toString()}>
        <td className="delphi-diagnosis-results-table">{adminSubBlock.sessionId}</td>
        <td className="delphi-diagnosis-results-table">{(!!cnodeState.correct) ? DC.TXT_RESULTS_APPROVE :
             (cnodeState.correction === DC.CORRECTION_NONE) ? DC.TXT_RESULTS_PENDING :
             DC.TXT_RESULTS_CORRECTED}</td>
        {(!cnodeState.correct && cnodeState.correction !== DC.CORRECTION_NONE) ?
            resultCell(CNodeId, sessionId, cnodeState, adminSessions) : <td></td>}
    </tr>
}

// this function performs a series of mangling steps
export default function DiagnosisResults(CNodeId, adminBlock, adminSessions) {

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
    {adminBlock.map(b => resultRow(CNodeId, b, adminSessions))}
</tbody></table>
    </div>;
}
