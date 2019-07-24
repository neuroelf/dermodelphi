import React, { Component } from 'react';
import DelphiControlRowC from './DelphiControlRowC.js';

function BlockControlRows(blockidx) {
    var rows = '';
    var blockrows = global.DM_LEVELCBLOCKS[0];
    var bc;
    var row;
    for (bc = 0; bc < blockrows.length; bc++) {
        row = (
            <DelphiControlRowC index={blockrows[bc]} />
        );
        rows += row;
    }
    return rows;
}

export default class DelphiBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allcorrect: false,
            currentBlock: 0
        };
        this.markBlockControlsAsCorrect = this.markBlockControlsAsCorrect.bind(this);
    }
    
    markBlockControlsAsCorrect() {
        this.setState(state => ({
            allcorrect: true
        }));
    }
    
    render() {
        return (

        <div class="form-container" id="formContainer">
            <form action="action_page.php">
                <table class="form-table" width="100%">
                
<tr class="form-row">
    <td class="form-control-cell" colspan="3">
        <p class="controls-paragraph">
            Current Category: benign &bull; Melanocytic proliferations &bull; Block 8/12
        </p>
        <p class="controls-paragraph">
            <button onClick={this.markBlockControlsAsCorrect}>mark entire block as correct</button>
        </p>
    </td>
    <td class="form-control-cell" align="right">
        <select name="choose-category" id="choose-category">
            <option value="default" selected>Jump to other category and block...</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 1/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 2/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 3/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 4/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 5/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 6/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 7/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 8/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 9/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 10/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 11/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Melanocytic proliferations, Block 12/12</option>
            <option value="benign-melanocytic-proliferations">Benign - Flat melanotic pigmentations, Block 1/1</option>
            <option value="benign-melanocytic-proliferations">Benign - Epidermal proliferations, Block 1/3</option>
            <option value="benign-melanocytic-proliferations">Benign - Epidermal proliferations, Block 2/3</option>
            <option value="benign-melanocytic-proliferations">Benign - Epidermal proliferations, Block 3/3</option>
        </select>
    </td>
</tr>

<tr class="form-header-row">
    <td class="form-pad-cell"></td>
    <td class="form-header-cell">Diagnosis (name)</td>
    <td class="form-header-cell">Correct (yes/no)</td>
    <td class="form-header-cell">Correction (configure as needed)</td>
</tr>

{BlockControlRows()}

                </table>
            </form>
        </div>

        );
    }
}
