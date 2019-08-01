import React, { Component } from 'react';
import DelphiCNodeIsCorrect from './DelphiCNodeIsCorrect';
import DelphiSelectCorrection from './DelphiSelectCorrection';
import DelphiTypoCorrection from './DelphiTypoCorrection';
import DelphiNewNameCorrection from './DelphiNewNameCorrection';
import DelphiNewSynsCorrection from './DelphiNewSynsCorrection';
import DelphiCombineCorrection from './DelphiCombineCorrection';
import DelphiReassignCorrection from './DelphiReassignCorrection';
import DelphiReassignToCorrection from './DelphiReassignToCorrection';
import DelphiNewModsCorrection from './DelphiNewModsCorrection';
import DelphiOtherCorrectionInput from './DelphiOtherCorrectionInput';
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

export default class DelphiControlRowC extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        const rowState = this.props.AppObj.state.blocks[this.props.CBlockId][this.props.CNodeId];
        return (

<tr className="form-row">
    <td className="form-pad-cell" width="24"></td>
    <td className="form-name-cell">
        {CNodeName(this.props.CNodeId, this.props.CBlockId, this.props.AppObj.state)}
    </td>
    <td className="form-control-centered-cell">
        <DelphiCNodeIsCorrect AppObj={this.props.AppObj} 
            CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
    </td>
    <td>
        <table className="form-table"><tbody><tr className="form-row">
            <td className="form-control-wide-cell">
                <DelphiSelectCorrection AppObj={this.props.AppObj}
                    CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
            </td>
            <td className="form-nopadd-cell">
                { rowState.correction === DCONST.CORRECTION_TYPO ?
                    <DelphiTypoCorrection AppObj={this.props.AppObj}
                        CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
                    : '' }
            </td>
            <td className="form-nopadd-cell">
                { rowState.correction === DCONST.CORRECTION_NEWNAME ? 
                    <DelphiNewNameCorrection AppObj={this.props.AppObj}
                        CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
                    : '' }
            </td>
            <td className="form-nopadd-cell">
                { rowState.correction === DCONST.CORRECTION_ADDSYN ? 
                    <DelphiNewSynsCorrection AppObj={this.props.AppObj}
                        CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
                    : '' }
            </td>
            <td className="form-nopadd-cell">
                { rowState.correction === DCONST.CORRECTION_COMBINE ? 
                    <DelphiCombineCorrection AppObj={this.props.AppObj}
                        CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
                    : '' }
            </td>
            <td className="form-nopadd-cell">
                { rowState.correction === DCONST.CORRECTION_MOVETOCAT ? 
                    <DelphiReassignCorrection AppObj={this.props.AppObj}
                        CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
                    : '' }
            </td>
            <td className="form-nopadd-cell">
                { ((rowState.correction === DCONST.CORRECTION_MOVETOCAT) &&
                    (rowState.corrmoveto === 99)) ? 
                    <DelphiReassignToCorrection AppObj={this.props.AppObj}
                        CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
                    : '' }
            </td>
            <td className="form-nopadd-cell">
                { rowState.correction === DCONST.CORRECTION_ADDMODS ? 
                    <DelphiNewModsCorrection AppObj={this.props.AppObj}
                        CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
                    : '' }
            </td>
            <td className="form-nopadd-cell">
                { rowState.correction === DCONST.CORRECTION_OTHER ?
                    <DelphiOtherCorrectionInput AppObj={this.props.AppObj}
                        CBlockId={this.props.CBlockId} CNodeId={this.props.CNodeId} />
                    : '' }
            </td>
        </tr></tbody></table>
    </td>
</tr>

        );
    }
}
