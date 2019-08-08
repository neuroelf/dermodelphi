import React, { Component } from 'react';
import * as d3 from 'd3';
//import DiagnosisName from './func/DiagnosisName'

// a lot of the code in this file was adapted from 
// https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd

const transDuration = 750;
const fontSize = [22, 18, 12, 10];
const indentation = [20, 120, 512, 576];
const margin = {
    left: 0,
    right: 24,
    top: 0,
    bottom: 24
};

//var AppObj = null;
var nodeCount = 0;
var rootElement = null;
var treeMap = null;
var treeSvg = null;

// swap state of children and animate
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

// collapse/expand nodes
function collapse(d) {
    if(d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}
function expand(d) {
    if(d._children) {
        d.children = d._children;
        d.children.forEach(collapse);
        d._children = null;
    }
}

// return a curved (diagonal) path from parent to the child nodes
function diagonal(s, d) { return `
    M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x} ${(s.y + d.y) / 2} ${d.x} ${d.y} ${d.x}`;
}

// update visualization
function update(source) {

    // Assigns the x and y position for the nodes
    var treeData = treeMap(rootElement);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d){ d.y = indentation[d.depth]});

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = treeSvg.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++nodeCount); });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr("font-size", d => fontSize[d.depth])
        .attr("font-weight", d => 700 - 100 * d.depth)
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(d => d.data.name) //(d.depth < 3 ? d.data.name :
            //DiagnosisName(d.data.id, Math.floor(d.data.id / 100), AppObj)
            //))
        .clone(true).lower()
        .attr("stroke", "white");
                
    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
        .duration(transDuration)
        .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
        .attr('r', 6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(transDuration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = treeSvg.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(transDuration)
        .attr('d', function(d){ return diagonal(d, d.parent) });

    // Remove any exiting links
    link.exit().transition()
        .duration(transDuration)
        .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

class DelphiTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            g: null,
            node: null,
            link: null,
        };
        this.drawTree = this.drawTree.bind(this);
        //AppObj = this.props.AppObj;
    }
    
    // draw actual tree, code adapted from
    drawTree() {
        const iframeWindow = document.getElementById('treeFrame').contentWindow;
        var winWidth = iframeWindow.innerWidth - margin.left - margin.right;
        var winHeight = window.innerHeight - margin.top - margin.bottom - 120;
        this.props.AppObj.setState({ treeHeight: winHeight });
        const iframeDoc = iframeWindow.document;
        var treeRootSvg = iframeDoc.getElementById('treeContainer');
        treeSvg = d3.select(treeRootSvg)
            .attr("width", Math.max(winWidth + margin.right + margin.left - 32, 880))
            .attr("height", winHeight + margin.top + margin.bottom - 44)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        treeMap = d3.tree()
            .size([winHeight - margin.bottom, winWidth]);
        rootElement = d3.hierarchy(global.DM_TREE, function(d) { return d.children; });
        rootElement.x0 = winHeight / 2;
        rootElement.y0 = 0;
        
        // Collapse after the second level (see below)
        rootElement.children.forEach(collapse);
        update(rootElement);
        rootElement.children.forEach(click);
   }
    
    componentDidMount() {
        this.drawTree();
    }

    render() {
        return (
<div>
    <div className="tree-container"><svg id="treeContainer"></svg></div>
</div>
        );
    }
}

export {
    click as DelphiTreeNodeClick,
    collapse as DelphiTreeNodeCollapse,
    expand as DelphiTreeNodeExpand,
    rootElement as DelphiTreeRootElement,
    update as DelphiTreeNodeUpdate,
    DelphiTree
};
