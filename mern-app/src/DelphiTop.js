import React, { Component } from 'react';
import DelphiTree from './DelphiTree.js';

class DelphiTop extends Component {
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
    <div className="top-bar">
        <table border="0">
            <tbody>
                <tr height="64">
                    <td valign="bottom">
                        <img src={process.env.PUBLIC_URL + '/img/dm_logo.png'} width="60" height="60" alt="DM Logo" />
                    </td>
                    <td width="24"></td>
                    <td valign="middle">
                        <h1>Dermatology Diagnosis Mapper - Consensus Survey</h1>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div className="tree-container" id="treeInfoContainer" height="64">
        <p className="general-paragraph-small">
            <button onClick={this.showOrHideTree}>Please click here to show the full taxonomy tree.</button>
        </p>
    </div>
    <DelphiTree />
</div>
        )
    }
}

export default DelphiTop;
