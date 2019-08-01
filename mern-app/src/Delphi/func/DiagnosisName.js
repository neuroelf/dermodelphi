import React from 'react'
import * as DC from '../Constants'

// this function performs a series of mangling steps
export default function DiagnosisName(CNodeId, CBlockId, appState) {
    const cnode = global.DM_LEVELCNODES[CNodeId];
    const cnodeState = appState.blocks[CBlockId][CNodeId];
    var nodeName = cnode.name;
    const { modifiers, synonyms } = { ...cnode };
    const newModifiers = modifiers.slice();
    const newSynonyms = synonyms.slice();

    // if some correction must be applied, alter name and
    // alter modifiers and synonyms
    if ((!cnodeState.correct) && (cnodeState.correction !== DC.CORRECTION_NONE)) {

        // if to be deleted, don't bother with anything else
        if (cnodeState.correction === DC.CORRECTION_DELETE) {
            return <span><i>{nodeName} <small><b><font color="red">
                {DC.TXT_TO_BE_DELETED}</font></b></small></i></span>
        }

        // and if to be combined, same!
        if (cnodeState.corrcombine !== 0) {
            return <span><i>{nodeName} <small><b><font color="red">
                {DC.TXT_TO_BE_COMBINED_WITH}</font>
                {global.DM_LEVELCNODES[cnodeState.corrcombine].name}
                </b></small></i></span>
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
            nodeName = <span>{nodeName}</span>
        } else {
            nodeName = <span>{nodeName} <small><i>
                ({DC.TXT_AKA} {newSynonyms.join(', ')})
                </i></small></span>
        }
    } else if (newModifiers.length === 1) {
        if (newSynonyms.length === 0) {
            nodeName = <span>{nodeName}<br /><small>
                {DC.TXT_MODIFIABLE_BY} {newModifiers[0].join(', ')}
                </small></span>
        } else {
            nodeName = <span>{nodeName} <small><i>
                ({DC.TXT_AKA} {newSynonyms.join(', ')})</i><br />
                {DC.TXT_MODIFIABLE_BY} {newModifiers[0].join(', ')}
                </small></span>
        }
    } else {
        if (newSynonyms.length === 0) {
            nodeName = <span>{nodeName}<br /><small>
                {DC.TXT_MODIFIABLE_BY} [{newModifiers[0].join(', ')}]
                {DC.TXT_AND_MODIFIABLE_BY} [{newModifiers[1].join(', ')}]
                </small></span>
        } else {
            nodeName = <span>{nodeName} <small><i>
                ({DC.TXT_AKA} {newSynonyms.join(', ')})</i><br />
                {DC.TXT_MODIFIABLE_BY} [{newModifiers[0].join(', ')}]
                {DC.TXT_AND_MODIFIABLE_BY} [{newModifiers[1].join(', ')}]
                </small></span>
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
