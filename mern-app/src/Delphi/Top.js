import React, { Component } from 'react';
import DelphiTreeContainer from './TreeContainer';
import DiagnosisDone from './func/DiagnosisDone';
import { IMG_LOGO, IMG_LOGO_ALT, IMG_LOGO_SIZE, TITLE_TXT_FULL, TITLE_TXT_SUBTITLE,
    SESS_INFO, SESS_PROGRESS } from './Constants'

export default class DelphiTop extends Component {
    constructor(props) {
        super(props);

        this.state = { };
    }
    
    render() {
        const { blocks, sessionOk, sessionId } = { ...this.props.AppObj.state};
        var doneNodes = 0;
        var totalNodes = 0;
        const blockKeys = Object.keys(blocks);
        for (var bc = 0; bc < blockKeys.length; bc++) {
            const block = blocks[blockKeys[bc]];
            const nodeKeys = Object.keys(block);
            for (var nc = 0; nc < nodeKeys.length; nc++) {
                if (nodeKeys[nc] === 'locked') {
                    continue;
                }
                totalNodes++;
                if (DiagnosisDone(block[nodeKeys[nc]])) {
                    doneNodes++;
                }
            }
        }
        return (

<div>
    <div className="delphi-top-bar">
        <table border="0">
            <tbody>
                <tr height={IMG_LOGO_SIZE + 12} valign="middle">
                    <td valign="bottom" className="delphi-form-nopadd-cell">
                        <img src={process.env.PUBLIC_URL + IMG_LOGO}
                            alt={IMG_LOGO_ALT} width={IMG_LOGO_SIZE} height={IMG_LOGO_SIZE} />
                    </td>
                    <td width="24"></td>
                    <td valign="middle">
                        <h1>{TITLE_TXT_FULL} <small> - {TITLE_TXT_SUBTITLE}</small></h1>
                    </td>
                    <td width="192" className="delphi-general-paragraph-small" align="right">
                        {(!!sessionOk) ?
                        <div>
                            <font color="white">{SESS_INFO} {sessionId}<br />
                            {SESS_PROGRESS} {doneNodes} of {totalNodes}</font>
                        </div> : '' }
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <DelphiTreeContainer AppObj={this.props.AppObj} />
</div>

        );
    }
}
