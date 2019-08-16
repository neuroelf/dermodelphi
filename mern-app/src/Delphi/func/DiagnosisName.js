import React from 'react'
import * as DC from '../Constants'
import DiagnosisResults from './DiagnosisResults'

// this function performs a series of mangling steps
export default function DiagnosisName(CNodeId, CBlockId, AppObj) {
    const cnode = global.DM_LEVELCNODES[CNodeId];
    const cnodeState = AppObj.state.blocks[CBlockId][CNodeId];
    var cnodeCorrect = cnodeState.correct;
    var nodeName = cnode.name;
    const { modifiers, synonyms } = { ...cnode };
    const oldModifiers = modifiers.slice();
    const oldSynonyms = synonyms.slice();
    var oldModifiersText, oldSynonymsText;

    // admin additions?
    var adminBlock = [];
    var adminResults = '';
    var isAdmin = false;
    const { tokenId, tokenValid, adminBlocks, adminSessions } = { ...AppObj.state};
    if (!!tokenValid && (tokenId.length === 8)) {
        isAdmin = true;
        if (CBlockId in adminBlocks) {
            adminBlock = adminBlocks[CBlockId];
        }
    }
    if (adminBlock.length > 0) {
        adminResults = DiagnosisResults(CNodeId, adminBlock, adminSessions);
    }
    cnodeCorrect = cnodeCorrect | isAdmin;

    // if to be deleted, don't bother with anything else
    if ((!cnodeCorrect) && (cnodeState.correction === DC.CORRECTION_DELETE)) {
        return <span className="delphi-diagnosis-name"><i>{nodeName} <small><b><font color="red">
            {DC.TXT_TO_BE_DELETED}</font></b></small></i>{adminResults}</span>
    }

    // and if to be combined, same!
    if ((!cnodeCorrect) &&
        (cnodeState.correction === DC.CORRECTION_COMBINE) &&
        (cnodeState.corrcombine !== 0)) {
        return <span className="delphi-diagnosis-name"><i>{nodeName} <small><b><font color="red">
            {DC.TXT_TO_BE_COMBINED_WITH}</font>
            {global.DM_LEVELCNODES[cnodeState.corrcombine].name}
            </b></small></i>{adminResults}</span>
    }

    //
    // not deleted and not combined, create old synonyms and modifiers text (if not deleted)
    //
    if ((oldModifiers.length === 0) ||
        ((!cnodeCorrect) && 
         ((cnodeState.correction === DC.CORRECTION_DELBOTH) ||
          (cnodeState.correction === DC.CORRECTION_DELMODS)))) {
        oldModifiersText = <span></span>
    } else {
        if (oldModifiers.length === 1) {
            oldModifiersText = <span><br /><small>
                {DC.TXT_MODIFIABLE_BY} {oldModifiers[0].join(', ')}</small></span>
        } else {
            oldModifiersText = <span><br /><small>
                {DC.TXT_MODIFIABLE_BY} [{oldModifiers[0].join(', ')}]
                    {DC.TXT_AND_MODIFIABLE_BY} [{oldModifiers[1].join(', ')}]</small></span>
        }
    }
    if ((oldSynonyms.length === 0) ||
        ((!cnodeCorrect) &&
         ((cnodeState.correction === DC.CORRECTION_DELBOTH) ||
          (cnodeState.correction === DC.CORRECTION_DELSYNS)))) {
        oldSynonymsText = <span></span>
    } else {
        oldSynonymsText = <span><small><i> ({DC.TXT_AKA} {oldSynonyms.join(', ')})</i></small></span>
    }

    // name correction
    var renameCorrection;
    if ((!cnodeCorrect) &&
        (cnodeState.correction !== DC.CORRECTION_NONE) &&
        (cnodeState.corrnewname !== '')) {
        renameCorrection = <span> <small><b><font color="red">
            {DC.TXT_TO_BE_RENAMED_TO} </font>{cnodeState.corrnewname}</b></small></span>
    } else {
        if ((!cnodeCorrect) && 
            (cnodeState.correction !== DC.CORRECTION_NONE) &&
            (cnodeState.corrspelling !== '')) {
            renameCorrection = <span> <small><b><font color="red">
            {DC.TXT_TO_BE_CORRECTED_TO} </font>{cnodeState.corrspelling}</b></small></span>
        } else {
            renameCorrection = <span></span>
        }
    }

    // synonyms deleted
    var synsDeleted;
    if ((!cnodeCorrect) &&
        ((cnodeState.correction === DC.CORRECTION_DELBOTH) ||
         (cnodeState.correction === DC.CORRECTION_DELSYNS))) {
        synsDeleted = <span> <small><b><font color="red">{DC.TXT_SYNS_DELETED}</font></b></small></span>
    } else {
        synsDeleted = <span></span>
    }

    // edited synonyms
    var editSyns;
    if ((!cnodeCorrect) && 
        (cnodeState.correction !== DC.CORRECTION_NONE) &&
        (cnodeState.correditsyns !== '')) {
        editSyns = <span> <small><b><font color="red">{DC.TXT_SYNS_TO_BE_EDITED} </font>
            (<i>{DC.TXT_AKA_EDITED}{cnodeState.correditsyns.split(';').join(', ')}</i>)</b></small></span>
    } else {
        editSyns = <span></span>
    }

    // new synonyms
    var newSyns;
    if ((!cnodeCorrect) && 
        (cnodeState.correction !== DC.CORRECTION_NONE) &&
        (cnodeState.corrnewsyns !== '')) {
        newSyns = <span> <small><b>(<i><font color="red">{DC.TXT_AKA_NEW} </font>
            {cnodeState.corrnewsyns.split(';').join(', ')}</i>)</b></small></span>
    } else {
        newSyns = <span></span>
    }

    // modifiers deleted
    var modsDeleted;
    if ((!cnodeCorrect) &&
        ((cnodeState.correction === DC.CORRECTION_DELBOTH) ||
         (cnodeState.correction === DC.CORRECTION_DELMODS))) {
        modsDeleted = <span> <small><b><font color="red">{DC.TXT_MODS_DELETED}</font></b></small></span>
    } else {
        modsDeleted = <span></span>
    }

    // edited modifiers
    var editMods;
    if ((!cnodeCorrect) && 
        (cnodeState.correction !== DC.CORRECTION_NONE) &&
        (cnodeState.correditmods !== '')) {
        editMods = <span><br /><small><b><font color="red">{DC.TXT_MODS_TO_BE_EDITED} </font>
            {cnodeState.correditmods.split(';').slice().join(', ')}</b></small></span>
    } else {
        editMods = <span></span>
    }

    // new modifiers
    var newMods;
    if ((!cnodeCorrect) && 
        (cnodeState.correction !== DC.CORRECTION_NONE) &&
        (cnodeState.corrnewmods !== '')) {
        newMods = <span><br /><small><b><font color="red">{DC.TXT_MODIFIABLE_BY_NEW} </font>
            {cnodeState.corrnewmods.split(';').join(', ')}</b></small></span>
    } else {
        newMods = <span></span>
    }

    // if moved to a different category, add that
    var movedToCat;
    if ((!cnodeCorrect) && 
        (cnodeState.correction !== DC.CORRECTION_NONE) &&
        (cnodeState.corrmoveto > 0)) {
        movedToCat = <span> <small><i><b><font color="red">{DC.TXT_TO_BE_MOVED_TO} </font>
            {global.DM_LEVELBFULLNAMES[cnodeState.corrmoveto]}</b></i></small></span>
    } else {
        movedToCat = <span></span>
    }

    // and also mention any free-text correction that isn't captured yet
    var otherEdits;
    if ((!cnodeCorrect) &&
        (cnodeState.correction !== DC.CORRECTION_NONE) &&
        (cnodeState.corrother !== '')) {
        otherEdits = <span> <small><i><b><font color="red">{DC.TXT_TO_BE_CORRECTED_BY} </font>
            {cnodeState.corrother}</b></i></small></span>
    } else {
        otherEdits = <span></span>
    }

    // put together the name and the synonyms and modifiers (as by now)
    return <span className="delphi-diagnosis-name">
        {nodeName}
        {oldSynonymsText}
        {renameCorrection}
        {synsDeleted}
        {editSyns}
        {newSyns}
        {modsDeleted}
        {movedToCat}
        {oldModifiersText}
        {editMods}
        {newMods}
        {otherEdits}
        {adminResults}</span>
}
