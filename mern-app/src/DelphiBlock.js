import React, { Component } from 'react';
import DelphiControlRowC from './DelphiControlRowC.js';

export default class DelphiBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allcorrect: false
        };
        this.markBlockControlsAsCorrect = this.markBlockControlsAsCorrect.bind(this);
        this.setNewBlock = this.setNewBlock.bind(this);
    }
    
    markBlockControlsAsCorrect() {
        this.setState(state => ({
            allcorrect: true
        }));
    }

    setNewBlock() {
        var nextBlock = document.getElementById('choose-category').value;
        if (nextBlock === 0) {
            // nothing yet
        } else {
            this.props.history.push('/block/0');
            this.props.history.push('/block/' + nextBlock.toString());
        }
    }
    
    render() {

        const { params } = this.props.match;
        return (
<tbody>
    <tr className={"form-header-row form-row" + params.currentCBlock.toString()}>
        <td class="form-control-cell" colspan="3">
            <p class="controls-paragraph">
                Current Category: {global.DM_LEVELCBLOCKID2NAMES[params.currentCBlock]}
            </p>
        </td>
        <td class="form-control-cell">
            <div class="form-row controls-paragraph" align="right">
                <select name="choose-category" id="choose-category" onChange={this.setNewBlock}>
                    <option value="0" selected>Jump to other category and block...</option>
                    {Object.keys(global.DM_LEVELCBLOCKS).map(
                        blockId => <option value={blockId}>{global.DM_LEVELCBLOCKID2NAMES[blockId]}</option>
                    )}
                </select>
            </div>
        </td>
    </tr>

    <tr className={"form-header-row form-row" + params.currentCBlock.toString()}>
        <td class="form-pad-cell"></td>
        <td class="form-header-cell">Diagnosis (name)</td>
        <td class="form-header-cell">Correct (yes/no)</td>
        <td class="form-header-cell">Correction (configure as needed)</td>
    </tr>

    {global.DM_LEVELCBLOCKS[params.currentCBlock].map(CNodeID => <DelphiControlRowC CNodeID={CNodeID} />)}

    <tr className={"form-header-row form-row" + params.currentCBlock.toString()}>
        <td class="form-control-cell" colspan="3">
            <p class="controls-paragraph">
                <button onClick={this.markBlockControlsAsCorrect}>mark entire block as correct</button>
            </p>
        </td>
        <td class="form-control-cell">
            <div align="right">
                <img src={process.env.PUBLIC_URL + '/img/unlocked.png'} width="24" height="24" alt="Page unlocked" />
                &nbsp;&nbsp;&nbsp;
                <font color="#CCCCCC"><i>this page is already unlocked</i></font>
                &nbsp;&nbsp;&nbsp;
                <button type="button" disabled="disabled">Continue with the next block</button>
            </div>
        </td>
    </tr>
</tbody>
        );
    }
}
