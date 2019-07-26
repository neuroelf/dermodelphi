import React, { Component } from 'react';
import DelphiControlRowC from './DelphiControlRowC.js';

export default class DelphiBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allcorrect: false
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
<tbody>
    <tr className={"form-header-row form-row" + this.props.currentCBlock.toString()}>
        <td class="form-control-cell" colspan="3">
            <p class="controls-paragraph">
                Current Category: {global.DM_LEVELCBLOCKID2NAMES[this.props.currentCBlock]}
            </p>
        </td>
        <td class="form-control-cell" align="right"></td>
    </tr>

    <tr className={"form-header-row form-row" + this.props.currentCBlock.toString()}>
        <td class="form-pad-cell"></td>
        <td class="form-header-cell">Diagnosis (name)</td>
        <td class="form-header-cell">Correct (yes/no)</td>
        <td class="form-header-cell">Correction (configure as needed)</td>
    </tr>

    {global.DM_LEVELCBLOCKS[this.props.currentCBlock].map(CNodeID => <DelphiControlRowC CNodeID={CNodeID} />)}

    <tr className={"form-header-row form-row" + this.props.currentCBlock.toString()}>
        <td class="form-control-cell" colspan="3">
            <p class="controls-paragraph">
                <button onClick={this.markBlockControlsAsCorrect}>mark entire block as correct</button>
            </p>
        </td>
        <td class="form-control-cell">
            <div align="right">
                <img src="img/unlocked.png" width="24" height="24" alt="Page unlocked" />
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
