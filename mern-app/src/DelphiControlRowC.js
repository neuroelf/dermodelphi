import React, { Component } from 'react';

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
        return (
        
<tr class="form-row">
    <td class="form-pad-cell" width="24"></td>
    <td class="form-name-cell">
        {global.DM_LEVELC[this.props.index].label}
    </td>
    <td class="form-control-centered-cell"><input type="checkbox" name="nevus-specialsite-correct" id="nevus-specialsite-correct" value="0" /></td>
    <td class="form-control-cell">
        <table class="form-table"><tr class="form-row">
            <td class="form-control-cell"><select name="nevus-specialsite-correction" id="nevus-specialsite-correction">
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
            <td class="form-control-cell"><input type="text" name="nevus-specialsite-addinfo" id="nevus-specialsite-addinfo" value="" /></td>
        </tr></table>
    </td>
</tr>

        );
    }
}

export default DelphiControlRowC;
