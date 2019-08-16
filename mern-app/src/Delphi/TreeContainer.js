import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DelphiTree } from './Tree';
import * as d3 from 'd3';
import { TXT_TOGGLE_TREE_OFF, TXT_TOGGLE_TREE_ON,
    BLOCK_INSTRUCTIONS, BLOCKS_INSTRUCT } from './Constants';
const cssfont = require('../css/bpreplay-webfont.woff');

export default class DelphiTreeContainer extends Component {
    constructor(props) {
        super(props);
        this.node = null;
        this.state = { };
        this.goToInstructions = this.goToInstructions.bind(this);
        this.showOrHideTree = this.showOrHideTree.bind(this);
    }
    
    goToInstructions(event) {
        event.preventDefault();

        const { AppObj } = { ...this.props};
        const { historyCBlockId, currentCBlockId } = { ...AppObj.state};
        const newHistoryCBlockId = [ ...historyCBlockId];
        newHistoryCBlockId.push(currentCBlockId);
        var newState = {
            currentCBlockId: BLOCKS_INSTRUCT,
            historyCBlockId: newHistoryCBlockId
        };
        AppObj.setState(newState);
    }

    showOrHideTree(event) {
        event.preventDefault();

        const { AppObj } = { ...this.props};
        var { treeVisible } = { ...AppObj.state};

        treeVisible = !treeVisible;
        AppObj.setState({ treeVisible: treeVisible });

        const iframeDoc = document.getElementById('treeFrame').contentWindow.document;
        const treeRoot = iframeDoc.getElementById('treeRoot');
        var treeVisibility = (treeVisible ? 'visible' : 'hidden');
        d3.select(treeRoot).style("visibility", treeVisibility);
    }
    
    componentDidMount() {
        const iframeDoc = document.getElementById('treeFrame').contentWindow.document;
        iframeDoc.open("text/html", "replace");
        iframeDoc.write(`
<html>
    <head></head>
    <style>
@font-face {
    font-family: 'bpreplayregular';
    src: url('` + cssfont + `') format('woff');
    font-weight: normal;
    font-style: normal;
}
* {
    font-family: bpreplayregular, sans-serif;
}
.node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 2px;
}
.node text {
    stroke-width: 2px;
}
.link {
    fill: none;
    stroke: #ddd;
    stroke-width: 2px;
}
    </style>
    <body><div id="treeRootDiv"></div></body>
</html>`);
        iframeDoc.close();
        ReactDOM.render(<DelphiTree AppObj={this.props.AppObj} />,
            iframeDoc.getElementById('treeRootDiv'));
        }

    render() {
        const { AppObj } = { ...this.props};
        var { currentCBlockId, sessionOk} = { ...AppObj.state};
        return (
<div>
    <div className="delphi-general-paragraph-small">
        <button onClick={this.showOrHideTree}>{
            AppObj.state.treeVisible ? TXT_TOGGLE_TREE_OFF : TXT_TOGGLE_TREE_ON
            }</button>
        { ((!!sessionOk) && (currentCBlockId !== BLOCKS_INSTRUCT)) ?
            <span>
                <font color="#FFFFFF">--------</font>
                <button onClick={this.goToInstructions}>{BLOCK_INSTRUCTIONS}</button>
            </span>
            : ""
        }
    </div>
    <div><iframe frameBorder="0" width="100%" id="treeFrame" title="DM Tree"
        style={(!!AppObj.state.treeVisible ? 
            {overflow: "scroll", height: AppObj.state.treeHeight, width: "98%", position: "absolute"} :
            {overflow: "hidden", height: "0px", width: "98%", position: "absolute"})}>
    </iframe></div>
</div>
        )
    }
}
