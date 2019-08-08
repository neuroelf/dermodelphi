import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DelphiTree from './Tree';
import * as d3 from 'd3';
import { BLOCKS_ALL, TXT_TOGGLE_TREE_OFF, TXT_TOGGLE_TREE_ON } from './Constants';
const cssfont = require('../css/bpreplay-webfont.woff');

export default class DelphiTreeContainer extends Component {
    constructor(props) {
        super(props);
        this.node = null;
        this.state = { }
        this.showOrHideTree = this.showOrHideTree.bind(this);
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
    stroke-width: 4px;
}
.link {
    fill: none;
    stroke: #aaa;
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
        return (
<div className="tree-container">
    <div className="delphi-general-paragraph-small">
        <button disabled={AppObj.state.currentCBlockId < BLOCKS_ALL}
            onClick={this.showOrHideTree}>{
                AppObj.state.treeVisible ? TXT_TOGGLE_TREE_OFF : TXT_TOGGLE_TREE_ON
            }</button>
    </div>
    <div><iframe frameBorder="0" width="100%" id="treeFrame" title="DM Tree"
        style={(!!AppObj.state.treeVisible ? 
            {overflow: "scroll", height: "100%", width: "100%", position: "absolute"} :
            {overflow: "hidden", height: "0px", width: "100%", position: "absolute"})}>
    </iframe></div>
</div>
        )
    }
}
