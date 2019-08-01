import React, { Component } from 'react';
import DelphiTree from './Tree';
import { IMG_LOGO, IMG_LOGO_ALT, IMG_LOGO_SIZE,
    TITLE_TXT_FULL, TXT_TOGGLE_TREE_ON } from './Constants'

export default class DelphiTop extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            treeVisible: false,
            treeVisibleHeight: 0
        };
        this.showOrHideTree = this.showOrHideTree.bind(this);
    }
    
    showOrHideTree() {
        window.alert('pressed');
    }
    
    render() {
        return (

<div>
    <div className="delphi-top-bar">
        <table border="0">
            <tbody>
                <tr height="64">
                    <td valign="bottom">
                        <img src={process.env.PUBLIC_URL + IMG_LOGO}
                            alt={IMG_LOGO_ALT} width={IMG_LOGO_SIZE} height={IMG_LOGO_SIZE} />
                    </td>
                    <td width="24"></td>
                    <td valign="middle">
                        <h1>{TITLE_TXT_FULL}</h1>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div className="delphi-tree-container" id="treeInfoContainer" height="64">
        <p className="delphi-general-paragraph-small">
            <button onClick={this.showOrHideTree}>{TXT_TOGGLE_TREE_ON}</button>
        </p>
    </div>
    <DelphiTree />
</div>

        );
    }
}
