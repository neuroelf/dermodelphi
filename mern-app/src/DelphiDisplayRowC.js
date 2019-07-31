import React, { Component } from 'react';
import * as DCONST from './DelphiConstants.js'

function CNodeName(CNodeId, CBlockId, appState) {
    const cnode = global.DM_LEVELCNODES[CNodeId];
    const cnodeState = appState.blocks[CBlockId][CNodeId];
    var nodeName = cnode.name;
    const { modifiers, synonyms } = { ...cnode };
    const newModifiers = modifiers.slice();
    const newSynonyms = synonyms.slice();
    if ((!cnodeState.correct) && (cnodeState.correction !== DCONST.CORRECTION_NONE)) {
        if (cnodeState.correction === DCONST.CORRECTION_DELETE) {
            return <span><i>{nodeName} <small><b><font color="red">to be deleted</font></b></small></i></span>
        }
        if (cnodeState.corrcombine !== 0) {
            return <span><i>{nodeName} <small><b><font color="red">to be combined with:</font> {global.DM_LEVELCNODES[cnodeState.corrcombine].name}</b></small></i></span>
        }
        if (cnodeState.corrnewname !== '') {
            nodeName = cnodeState.corrnewname;
        } else {
            if (cnodeState.corrspelling !== '') {
                nodeName = cnodeState.corrspelling;
            }
        }
        if (cnodeState.correction === DCONST.CORRECTION_DELMODS) {
            newModifiers.length = 0;
        } else {
            if (cnodeState.correditmods !== '') {
                newModifiers.length = 0;
                newModifiers.push.apply(newModifiers, cnodeState.correditmods.split(';').slice());
            }
        }
        if (cnodeState.corrnewmods !== '') {
            newModifiers.push.apply(newModifiers, cnodeState.corrnewmods.split(';'));
        }
        if (cnodeState.corrnewsyns !== '') {
            newSynonyms.push.apply(newSynonyms, cnodeState.corrnewsyns.split(';'));
        }
    }
    if (newModifiers.length === 0) {
        if (newSynonyms.length === 0) {
            nodeName = <span>{nodeName}</span>
        } else {
            nodeName = <span>{nodeName} <small><i>(a.k.a. {newSynonyms.join(', ')})</i></small></span>
        }
    } else if (newModifiers.length === 1) {
        if (newSynonyms.length === 0) {
            nodeName = <span>{nodeName}<br /><small>modifiable by {newModifiers[0].join(', ')})</small></span>
        } else {
            nodeName = <span>{nodeName} <small><i>(a.k.a. {newSynonyms.join(', ')})</i><br />modifiable by {newModifiers[0].join(', ')}</small></span>
        }
    } else {
        if (newSynonyms.length === 0) {
            nodeName = <span>{nodeName}<br /><small>modifiable by [{newModifiers[0].join(', ')}] and [{newModifiers[1].join(', ')}])</small></span>
        } else {
            nodeName = <span>{nodeName} <small><i>(a.k.a. {newSynonyms.join(', ')})</i><br />modifiable by [{newModifiers[0].join(', ')}] and [{newModifiers[1].join(', ')}]</small></span>
        }
    }
    if ((!cnodeState.correct) && (cnodeState.corrmoveto > 0)) {
        if (cnodeState.corrmoveto > 99) {
            nodeName = <span>{nodeName} <small><i><b><font color="red">to be moved to category</font> {global.DM_LEVELBFULLNAMES[cnodeState.corrmoveto]}</b></i></small></span>
        } else {
            if (cnodeState.corrmovetox !== '') {
                nodeName = <span>{nodeName} <small><i><b><font color="red">to be moved to category</font> {cnodeState.corrmovetox}</b> (user provided)</i></small></span>
            }
        }
    }
    if ((!cnodeState.correct) && (cnodeState.corrother !== '')) {
        nodeName = <span>{nodeName} <small><i><b><font color="red">to be corrected by:</font> {cnodeState.corrother}</b></i></small></span>
    }
    return nodeName;
}

export default class DelphiDisplayRowC extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        const rowState = this.props.AppObj.state.blocks[this.props.CBlockId][this.props.CNodeId];
        var firstNodeClass = 'form-row';
        if (this.props.CNodeId % 100 === 1) {
            firstNodeClass = 'form-row-first';
        }
        return (
        
<tr className={firstNodeClass}>
    <td className="form-pad-cell" width="24"></td>
    <td className="form-name-cell">
        {CNodeName(this.props.CNodeId, this.props.CBlockId, this.props.AppObj.state)}
    </td>
    <td className="form-control-centered-cell">
        {
            rowState.correct ? <span><small>correct</small></span> : 
            rowState.correction === DCONST.CORRECTION_NONE ? <span><small><font color="red"><i>to be checked</i></font></small></span> :
            <span><small><b>corrected</b></small></span> }
    </td>
    <td></td>
</tr>

        );
    }
}
