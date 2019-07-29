import React, { Component } from 'react';
import DelphiControlCheckBox from './DelphiControlCheckBox';

function CNodeName(cnode) {
    if (cnode.modifiers.length === 0) {
        if (cnode.synonyms.length === 0) {
            return (<span>{cnode.name}</span>);
        } else {
            return (<span>{cnode.name} <small><i>(a.k.a. {cnode.synonyms.join(', ')})</i></small></span>);
        }
    } else if (cnode.modifiers.length === 1) {
        if (cnode.synonyms.length === 0) {
            return (<span>{cnode.name}<br /><small>modifiable by {cnode.modifiers[0].join(', ')})</small></span>);
        } else {
            return (<span>{cnode.name} <small><i>(a.k.a. {cnode.synonyms.join(', ')})</i><br />modifiable by {cnode.modifiers[0].join(', ')}</small></span>);
        }
    } else {
        if (cnode.synonyms.length === 0) {
            return (<span>{cnode.name}<br /><small>modifiable by [{cnode.modifiers[0].join(', ')}] and [{cnode.modifiers[1].join(', ')}])</small></span>);
        } else {
            return (<span>{cnode.name} <small><i>(a.k.a. {cnode.synonyms.join(', ')})</i><br />modifiable by [{cnode.modifiers[0].join(', ')}] and [{cnode.modifiers[1].join(', ')}]</small></span>);
        }
    }
}

class DelphiControlRowC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correct: false,
            correction: 0,
            correctionInfo: [0, '']
        };
    }
    
    render() {
        var cnode = global.DM_LEVELCNODES[this.props.CNodeID];
        return (
        
<tr className={"form-row form-row" + Math.floor(this.props.CNodeID / 100).toString()}>
    <td className="form-pad-cell" width="24"></td>
    <td className="form-name-cell">
        {CNodeName(cnode)}
    </td>
    <td className="form-control-centered-cell">
        <DelphiControlCheckBox nodeId={cnode.id} />
    </td>
    <td>
        <table className="form-table"><tr class="form-row">
            <td className="form-control-wide-cell">
                <select name={"correction" + cnode.id.toString()} id={"correction" + cnode.id.toString()}>
                    <option value="default" selected>Correction needed...</option>
                    <option value="misspelled">Mis-spelled / typo</option>
                    <option value="incorrect">Incorrect term</option>
                    <option value="addsynonyms">Additional synonyms</option>
                    <option value="combinewith">Combine with other diagnosis</option>
                    <option value="movetoclass">Assign to a different class</option>
                    <option value="addmodifiers">Add modifiers</option>
                    <option value="delmodifiers" disabled>Remove modifiers</option>
                    <option value="editmodifiers" disabled>Edit modifiers</option>
                    <option value="deletelabel">Remove diagnosis completely</option>
                    <option value="othercorrection">Other (please specify!)</option>
                </select>
            </td>
            <td className="form-control-cell">
                <input type="text" name={"addinfo" + cnode.id.toString()}
                    id={"addinfo" + cnode.id.toString()} value="" />
            </td>
        </tr></table>
    </td>
</tr>

        );
    }
}

export default DelphiControlRowC;
