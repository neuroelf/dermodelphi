import React, { Component } from 'react';
import * as d3 from 'd3';

class DelphiTree extends Component {
    constructor(props) {
        super(props);
        this.node = null;
        this.state = {
            g: null,
            node: null,
            link: null,
        };
        this.drawTree = this.drawTree.bind(this);
    }
    
    // draw actual tree, code adapted from
    // https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd
    drawTree() {
        const iframeWindow = document.getElementById('treeFrame').contentWindow;
        var margin = {
            left: 12,
            right: 120,
            top: 12,
            bottom: 12
        };
        var winWidth = iframeWindow.innerWidth - margin.left - margin.right;
        var winHeight = 800 - margin.top - margin.bottom;
        const iframeDoc = iframeWindow.document;
        const treeRootDiv = iframeDoc.getElementById('treeContainer');
        const svg = d3.select(treeRootDiv).append('svg')
            .attr("id", "treeRoot")
            .attr("width", winWidth + margin.right + margin.left)
            .attr("height", winHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var transDuration = 750;
        var nodeCount = 0;
        var fontSize = 15;
        var indentation = [10, 170, 520, 600];

        var treemap = d3.tree().size([winHeight, winWidth]);
        var rootElement = d3.hierarchy(global.DM_TREE, function(d) { return d.children; });
        rootElement.x0 = winHeight / 2;
        rootElement.y0 = 0;
        
        // Collapse after the second level (see below)
        rootElement.children.forEach(collapse);
        update(rootElement, 0);

        // inline functions
        //
        // Collapse the node and all it's children
        function collapse(d) {
            if(d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }
        //
        // update
        function update(source, level) {
        
            // Assigns the x and y position for the nodes
            var treeData = treemap(rootElement);
        
            // Compute the new tree layout.
            var nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);
        
            // Normalize for fixed-depth.
            nodes.forEach(function(d){ d.y = indentation[d.depth]});
        
            // ****************** Nodes section ***************************
        
            // Update the nodes...
            var node = svg.selectAll('g.node')
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
                .attr('r', 2e-7)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });
        
            // Add labels for the nodes
            nodeEnter.append('text')
                .attr("font-size", fontSize - 2.4 * level)
                .attr("font-weight", 700 - 100 * level)
                .attr("dy", ".35em")
                .attr("x", function(d) {
                    return d.children || d._children ? -13 : 13;
                })
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(d => d.data.name)
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
                .attr('r', 10)
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
            var link = svg.selectAll('path.link')
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
        
            // Creates a curved (diagonal) path from parent to the child nodes
            function diagonal(s, d) {
        
                var path = `M ${s.y}, ${s.x}
                        C ${(s.y + d.y) / 2}, ${s.x}
                            ${(s.y + d.y) / 2}, ${d.x}
                            ${d.y}, ${d.x}`
            
                return path;
            }
        
            // Toggle children on click.
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d, level+1);
            }
        }

        return;


        // const root = tree(global.DM_TREE, width);
        // let x0 = Infinity;
        // let x1 = -x0;
        // root.each(d => {
        //   if (d.x > x1) x1 = d.x;
        //   if (d.x < x0) x0 = d.x;
        // });
        // const svg = d3.select(treeRootDiv).append('svg')
        //     .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);
        // const g = svg.append("g")
        //     .attr("id", "treeRoot")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", 10)
        //     .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);
        // const link = g.append("g")
        //     .attr("fill", "none")
        //     .attr("stroke", "#555")
        //     .attr("stroke-opacity", 0.4)
        //     .attr("stroke-width", 1.5)
        //     .selectAll("path")
        //     .data(root.links())
        //     .join("path")
        //     .attr("d", d3.linkHorizontal()
        //         .x(d => d.y)
        //         .y(d => d.x));
        // const node = g.append("g")
        //     .attr("stroke-linejoin", "round")
        //     .attr("stroke-width", 3)
        //     .selectAll("g")
        //     .data(root.descendants())
        //     .join("g")
        //     .attr("transform", d => `translate(${d.y},${d.x})`);
          
        // node.append("circle")
        //     .attr("fill", d => d.children ? "#555" : "#999")
        //     .attr("r", 2.5);
      
        // node.append("text")
        //     .attr("dy", "0.31em")
        //     .attr("x", d => d.children ? -6 : 6)
        //     .attr("text-anchor", d => d.children ? "end" : "start")
        //     .text(d => d.data.name)
        //     .clone(true).lower()
        //     .attr("stroke", "white");
        
        // var treeVisibility = (this.props.AppObj.state.treeVisible ? 'visible' : 'hidden');
        // g.style("visibility", treeVisibility);
        // this.setState({
        //     g: g,
        //     link: link,
        //     node: node
        // });

              /*
        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        root = data;
        root.x0 = height / 2;
        root.y0 = 0;
          
        update(root);

        //d3.select(self.frameElement).style("height", "500px");

        function update(source) {

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 180; });

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "treenode")
                .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on("click", click);

            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeEnter.append("text")
                .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .text(function(d) { return d.name; })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("circle")
                .attr("r", 10)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "treelink")
                .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // Toggle children on click.
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


/*
        var root = d3.tree(data);
        var nodes = root.select();
        let x0 = Infinity;
        let x1 = -x0;
        root.each(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });
        
        var svg = d3.select("#treeContainer").append("svg")
            .attr("width", 720)
            .attr("height", 1280)
            .attr("viewBox", [0, 0, 720, x1 - x0 + root.dx * 2]);
        
        var g = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);
        
        var link = g.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));
        
const node = g.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

node.append("circle")
    .attr("fill", d => d.children ? "#555" : "#999")
    .attr("r", 2.5);

node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -6 : 6)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .clone(true).lower()
    .attr("stroke", "white");

return svg.node();
*/
    }
    
    componentDidMount() {
        this.drawTree();
    }

    render() {
        return (
<div>
    <div className="tree-container" id="treeContainer"></div>
</div>
        );
    }
}

export default DelphiTree;
