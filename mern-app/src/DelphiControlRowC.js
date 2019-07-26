import React, { Component } from 'react';

function localEncodeHTML(name) {
    var map = {
        '&': '&amp;',
        'è': '&egrave;',
        'é': '&eacute;'
      };
    return name.replace(/[&èé]/g, function(m) { return map[m]; });
}

function CNodeName(cnode) {
    if (cnode.modifiers.length === 0) {
        if (cnode.synonyms.length === 0) {
            return (<span>{cnode.name}</span>);
        } else {
            return (<span>{cnode.name} <small><i>(a.k.a. {localEncodeHTML(cnode.synonyms.join(', '))})</i></small></span>);
        }
    } else if (cnode.modifiers.length === 1) {
        if (cnode.synonyms.length === 0) {
            return (<span>{cnode.name}<br /><small>modifiable by {localEncodeHTML(cnode.modifiers[0].join(', '))})</small></span>);
        } else {
            return (<span>{cnode.name} <small><i>(a.k.a. {localEncodeHTML(cnode.synonyms.join(', '))})</i><br />modifiable by {localEncodeHTML(cnode.modifiers[0].join(', '))}</small></span>);
        }
    } else {
        return <span>c</span>
        return (<span><small>modified by {cnode.modifiers[0].join(', ')}; and modified by {cnode.modifiers[1].join(', ')}</small></span>)
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
    <td className="form-control-centered-cell"><input type="checkbox" name="nevus-specialsite-correct" id="nevus-specialsite-correct" value="0" /></td>
    <td className="form-control-cell">
        <table className="form-table"><tr class="form-row">
            <td className="form-control-cell"><select name="nevus-specialsite-correction" id="nevus-specialsite-correction">
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
            </select></td>
            <td className="form-control-cell"><input type="text" name="nevus-specialsite-addinfo" id="nevus-specialsite-addinfo" value="" /></td>
        </tr></table>
    </td>
</tr>

        );
    }
}

export default DelphiControlRowC;
