// imports
import React, { Component } from 'react';
import DelphiTop from './DelphiTop.js';
import DelphiWelcome from './DelphiWelcome.js';
import DelphiBlock from './DelphiBlock.js';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; //, Link // from 'react-router-dom';
import './App.css';
import * as DCONST from './DelphiConstants.js'

// variables for global JSON information
global.DM_TREE = require('./json/dm_diagnoses.json');
global.DM_LEVELANAMES = [];
global.DM_LEVELBNAMES = [];
global.DM_LEVELCBLOCKS = {};
global.DM_LEVELCBLOCKIDS = [];
global.DM_LEVELCBLOCKNAMES = [];
global.DM_LEVELCBLOCKID2NAMES = {};
global.DM_LEVELCNODES = {};

// function for loading the JSON file into global config
function parseDMJSONFile() {
    var anodes = global.DM_TREE.children;
    var aname, anode, bname, bnode, cblock, cnode, blname, blnodes,
        bnodes, cnodes, alen, blen, clen, ac, bc, cc, blc;
    alen = anodes.length;
    blname = '';
    blnodes = [];
    cblock = 0;
    // global.DM_LEVELCBLOCKS[0] = []

    // parse top nodes (currently only 'Benign' and 'Malignant')
    for (ac = 0; ac < alen; ac++) {
        anode = anodes[ac];
        aname = anode.name;
        global.DM_LEVELANAMES.push(aname);

        // parse categories
        bnodes = anode.children;
        blen = bnodes.length;
        for (bc = 0; bc < blen; bc++) {
            bnode = bnodes[bc];
            bname = bnode.name;
            global.DM_LEVELBNAMES.push(aname + " - " + bname);

            // parse diagnoses (names)
            cnodes = bnode.children;
            clen = cnodes.length;
            blc = 0;
            for (cc = 0; cc < clen; cc++) {
                cnode = cnodes[cc];
                global.DM_LEVELCNODES[cnode.id] = cnode;

                // begin a new block?
                if (cnode.blockid !== cblock) {

                    // if previous block not "0" (initial value)
                    if (cblock !== 0) {

                        // store node list into array
                        global.DM_LEVELCBLOCKS[cblock] = blnodes;
                    }
                    cblock = cnode.blockid;
                    blc = blc + 1;

                    // create new node list, generate and store name
                    blnodes = [];
                    blname = aname + " - " + bname + ", block " + blc.toString();
                    global.DM_LEVELCBLOCKIDS.push(cblock);
                    global.DM_LEVELCBLOCKNAMES.push(blname);
                    global.DM_LEVELCBLOCKID2NAMES[cblock] = blname;
                }

                // add node to list
                blnodes.push(cnode.id);
            }
        }
        // also for last block (at the end of the loops)
        global.DM_LEVELCBLOCKS[cblock] = blnodes;
    }
return;
}

// not-found component for Switch/Router (simple for now)
const DelphiNotFound = () => <h2>This page/component wasn't found.</h2>

// main component (rendered by index.js)
class App extends Component {
    constructor(props) {
        super(props);
        
        // place holder state (will be filled from JSON data)
        this.state = {
            currentCBlockId: 10101,
            blocks: {}
        };

        // parse the JSON file synchronously
        parseDMJSONFile();

        // below, the state is extended such that
        // - each block has a state (i.e. whether controls are locked)
        // - and each row within the block has a set of states

        // iterate over blocks
        var bc, cc, blockNodes;
        var blockIds = Object.keys(global.DM_LEVELCBLOCKS);
        var numBlocks = blockIds.length;
        for (bc = 0; bc < numBlocks; bc++) {

            // initialize block state with { locked: false }
            var blockState = {
                locked: false
            };

            // get and iterater over block nodes
            blockNodes = global.DM_LEVELCBLOCKS[blockIds[bc]];
            var numBlockNodes = blockNodes.length;
            for (cc = 0; cc < numBlockNodes; cc++) {

                // set state for node
                blockState[blockNodes[cc]] = {
                    correct: false,
                    correction: DCONST.CORRECTION_NONE,
                    corrspelling: '',
                    corrnewname: '',
                    corrnewsyns: '',
                    corrcombine: 0,
                    corrmoveto: 0,
                    corrnewmods: '',
                    correditmods: '',
                    corrother: ''
                }
            }

            // store in overall state
            this.state.blocks[blockIds[bc]] = blockState;
        }
    }
    
    // output for main component is wrapped in Router containing
    // - the DelphiTop (title)
    // - and a Switch (to create a default/error route)
    // - and then the entry page (DelphiWelcome)
    // - as well as a Block route to work as a "page" like control
    render() {
        return (
            <Router>
                <DelphiTop />
                <Switch>
                    <Route path="/" exact component={DelphiWelcome} />
                    <Route path="/block/:CBlockId"
                        render={(props) => <DelphiBlock {...props} AppObj={this} />} />
                    <Route component={DelphiNotFound} />
                </Switch>
            </Router>
        );
    }
}

export default App;
