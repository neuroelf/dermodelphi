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
    }
    
    render() {
        return (
<div>
    <div class="info-container" id="infoContainer" height="80">
        <p class="title-paragraph">
            Dermatology Diagnosis Mapper - Consensus Survey
        </p>
    </div>

    <div class="tree-container" id="treeInfoContainer" height="64">
        <p class="general-paragraph-small">
            <button onClick={this.showOrHideTree}>Please click here to show the sub-tree of the current category.</button>
        </p>
    </div>
    
    <div class="tree-container" id="treeContainer" height={this.state.treeVisibleHeight}>
        <DelphiTree />
    </div>
</div>

        )
    }
}

export default DelphiTop;
