import React, { Component } from 'react'
import DelphiTreeContainer from './TreeContainer'
import DelphiLinkSetState from './LinkSetState'
import DelphiLogout from './Logout'
import DelphiTokenId from './TokenId'
import DiagnosisDone from './func/DiagnosisDone'
import { IMG_LOGO, IMG_LOGO_ALT, IMG_LOGO_HEIGHT, IMG_LOGO_WIDTH,
    BLOCKS_LOGOUT, TITLE_TXT_FULL, TITLE_TXT_SUBTITLE,
    SESS_INFO, SESS_PROGRESS, } from './Constants'

export default class DelphiTop extends Component {
    constructor(props) {
        super(props);

        this.state = { };
    }
    
    render() {
        const { AppObj } = { ...this.props};
        const { blocks, currentCBlockId, sessionOk, sessionId,
            tokenValid, tokenVisible } = { ...AppObj.state};
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
                <tr height={IMG_LOGO_HEIGHT + 12} valign="middle">
                    <td className="delphi-form-nopadd-cell">
                        <img src={process.env.PUBLIC_URL + IMG_LOGO}
                            alt={IMG_LOGO_ALT} width={IMG_LOGO_WIDTH} height={IMG_LOGO_HEIGHT} />
                    </td>
                    <td width="24"></td>
                    <td valign="middle">
                        <h1>{TITLE_TXT_FULL} - {TITLE_TXT_SUBTITLE}</h1>
                    </td>
                    <td width="120"></td>
                    <td width="192" className="delphi-general-paragraph-small">
                        {(!!sessionOk) ?
                        <div>
                            <font color="white"> {SESS_INFO} <DelphiLinkSetState AppObj={AppObj}
                                stateValue={true} stateProp={'tokenVisible'}
                                className="delphi-session-id" linkText={sessionId} /></font><br />
                            <font color="white"> {SESS_PROGRESS} {doneNodes} of {totalNodes}<br /></font>
                            {(!!tokenVisible && !tokenValid) ?
                            <div>
                                <DelphiTokenId AppObj={AppObj} />
                            </div> : ''}
                            <br />
                            {(currentCBlockId !== BLOCKS_LOGOUT) ?
                                <DelphiLogout AppObj={AppObj} /> : '' }
                        </div> : '' }
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <DelphiTreeContainer AppObj={AppObj} />
</div>

        );
    }
}
