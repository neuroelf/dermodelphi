import React from 'react'
import * as DC from '../Constants'
import DiagnosisResults from './DiagnosisResults'

// this function performs a series of mangling steps
export default function DiagnosisName(CNodeId, CBlockId, AppObj) {
    const cnode = global.DM_LEVELCNODES[CNodeId];
    const cnodeState = AppObj.state.blocks[CBlockId][CNodeId];
    var nodeName = cnode.name;
    const { modifiers, synonyms } = { ...cnode };
    const newModifiers = modifiers.slice();
    const newSynonyms = synonyms.slice();

    // admin additions?
    var adminBlock = [];
    var adminResults = '';
    const { tokenId, tokenValid } = { ...AppObj.state};
    if (!!tokenValid && (tokenId.length === 8)) {
        const { adminBlocks } = { ...AppObj.state};
        if (CBlockId in adminBlocks) {
            adminBlock = adminBlocks[CBlockId];
        }
    }
    if (adminBlock.length > 0) {
        adminResults = DiagnosisResults(CNodeId, adminBlock);
    }

    // if some correction must be applied, alter name and
    // alter modifiers and synonyms
    if ((!cnodeState.correct) && (cnodeState.correction !== DC.CORRECTION_NONE)) {

        // if to be deleted, don't bother with anything else
        if (cnodeState.correction === DC.CORRECTION_DELETE) {
            return <span className="delphi-diagnosis-name"><i>{nodeName} <small><b><font color="red">
                {DC.TXT_TO_BE_DELETED}</font></b></small></i>{adminResults}</span>
        }

        // and if to be combined, same!
        if (cnodeState.corrcombine !== 0) {
            return <span className="delphi-diagnosis-name"><i>{nodeName} <small><b><font color="red">
                {DC.TXT_TO_BE_COMBINED_WITH}</font>
                {global.DM_LEVELCNODES[cnodeState.corrcombine].name}
                </b></small></i>{adminResults}</span>
        }

        // a corrected name get priority over spelling correction
        if (cnodeState.corrnewname !== '') {
            nodeName = cnodeState.corrnewname;
        } else {
            if (cnodeState.corrspelling !== '') {
                nodeName = cnodeState.corrspelling;
            }
        }

        // remove original modifiers if that is the selected item
        if (cnodeState.correction === DC.CORRECTION_DELMODS) {
            newModifiers.length = 0;

        // otherwise, if modifiers are edited, replace with those
        } else {
            if (cnodeState.correditmods !== '') {
                newModifiers.length = 0;
                newModifiers.push(cnodeState.correditmods.split(';'));
            }
        }

        // add any new modifiers
        if (cnodeState.corrnewmods !== '') {
            newModifiers.push(cnodeState.corrnewmods.split(';'));
        }

        // and same for synonyms
        if (cnodeState.corrnewsyns !== '') {
            newSynonyms.push.apply(newSynonyms,
                cnodeState.corrnewsyns.split(';').slice());
        }
    }

    // extend name with modifiers and synonyms as requested
    if (newModifiers.length === 0) {
        if (newSynonyms.length === 0) {
            nodeName = <span className="delphi-diagnosis-name">{nodeName}{adminResults}</span>
        } else {
            nodeName = <span className="delphi-diagnosis-name">{nodeName} <small><i>
                ({DC.TXT_AKA} {newSynonyms.join(', ')})
                </i></small>{adminResults}</span>
        }
    } else if (newModifiers.length === 1) {
        if (newSynonyms.length === 0) {
            nodeName = <span className="delphi-diagnosis-name">{nodeName}<br /><small>
                {DC.TXT_MODIFIABLE_BY} {newModifiers[0].join(', ')}
                </small>{adminResults}</span>
        } else {
            nodeName = <span className="delphi-diagnosis-name">{nodeName} <small><i>
                ({DC.TXT_AKA} {newSynonyms.join(', ')})</i><br />
                {DC.TXT_MODIFIABLE_BY} {newModifiers[0].join(', ')}
                </small>{adminResults}</span>
        }
    } else {
        if (newSynonyms.length === 0) {
            nodeName = <span className="delphi-diagnosis-name">{nodeName}<br /><small>
                {DC.TXT_MODIFIABLE_BY} [{newModifiers[0].join(', ')}]
                {DC.TXT_AND_MODIFIABLE_BY} [{newModifiers[1].join(', ')}]
                </small>{adminResults}</span>
        } else {
            nodeName = <span className="delphi-diagnosis-name">{nodeName} <small><i>
                ({DC.TXT_AKA} {newSynonyms.join(', ')})</i><br />
                {DC.TXT_MODIFIABLE_BY} [{newModifiers[0].join(', ')}]
                {DC.TXT_AND_MODIFIABLE_BY} [{newModifiers[1].join(', ')}]
                </small>{adminResults}</span>
        }
    }

    // finally, if moved to a different category, add that
    if ((!cnodeState.correct) && (cnodeState.corrmoveto > 0)) {
        if (cnodeState.corrmoveto > 99) {
            nodeName = <span>{nodeName} <small><i><b><font color="red">
                {DC.TXT_TO_BE_MOVED_TO}</font>
                {global.DM_LEVELBFULLNAMES[cnodeState.corrmoveto]}
                </b></i></small></span>
        } else {
            if (cnodeState.corrmovetox !== '') {
                nodeName = <span>{nodeName} <small><i><b><font color="red">
                {DC.TXT_TO_BE_MOVED_TO}</font> 
                {cnodeState.corrmovetox}</b>
                {DC.TXT_TO_BE_MOVED_OTHER}</i></small></span>
            }
        }
    }

    // and also mention any free-text correction that isn't captured yet
    if ((!cnodeState.correct) && (cnodeState.corrother !== '')) {
        nodeName = <span>{nodeName} <small><i><b><font color="red">
            {DC.TXT_TO_BE_CORRECTED_BY}</font>
            {cnodeState.corrother}</b></i></small></span>
    }
    return nodeName;
}
