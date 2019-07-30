import React, { Component } from 'react';
import DelphiCNodeIsCorrect from './DelphiCNodeIsCorrect';
import DelphiSelectCorrection from './DelphiSelectCorrection';
import DelphiTypoCorrection from './DelphiTypoCorrection';
import DelphiNewNameCorrection from './DelphiNewNameCorrection';
import DelphiNewSynsCorrection from './DelphiNewSynsCorrection';
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
        if (cnodeState.combine !== '') {
            // nodeName = <i>combined with {cnodeState.combine}</i>
        } else {
            if (cnodeState.corrspelling !== '') {
                nodeName = cnodeState.corrspelling;
            } else {
                if (cnodeState.corrnewname !== '') {
                    nodeName = cnodeState.corrnewname;
                }
            }
        }
        if (cnodeState.corrnewmods !== '') {
            newModifiers.push(cnodeState.corrnewmods.split(';'));
        }
        if (cnodeState.corrnewsyns !== '') {
            newSynonyms.push(cnodeState.corrnewsyns.split(';'));
        }
    }
    if (newModifiers.length === 0) {
        if (newSynonyms.length === 0) {
            return (<span>{nodeName}</span>);
        } else {
            return (<span>{nodeName} <small><i>(a.k.a. {newSynonyms.join(', ')})</i></small></span>);
        }
    } else if (newModifiers.length === 1) {
        if (newSynonyms.length === 0) {
            return (<span>{nodeName}<br /><small>modifiable by {newModifiers[0].join(', ')})</small></span>);
        } else {
            return (<span>{nodeName} <small><i>(a.k.a. {newSynonyms.join(', ')})</i><br />modifiable by {newModifiers[0].join(', ')}</small></span>);
        }
    } else {
        if (newSynonyms.length === 0) {
            return (<span>{nodeName}<br /><small>modifiable by [{newModifiers[0].join(', ')}] and [{newModifiers[1].join(', ')}])</small></span>);
        } else {
            return (<span>{nodeName} <small><i>(a.k.a. {newSynonyms.join(', ')})</i><br />modifiable by [{newModifiers[0].join(', ')}] and [{newModifiers[1].join(', ')}]</small></span>);
        }
    }
}

class DelphiControlRowC extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        const rowState = this.props.AppObj.state.blocks[this.props.CBlockId][this.props.CNodeId];
        return (
        
<tr className={"form-row form-row" + Math.floor(this.props.CNodeId / 100).toString()}>
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

export default DelphiControlRowC;
