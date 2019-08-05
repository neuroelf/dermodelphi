// imports
import React, { Component } from 'react';
import DelphiNotFound from './Delphi/NotFound'
import DelphiTop from './Delphi/Top';
import DelphiWelcome from './Delphi/Welcome';
import DelphiBlock from './Delphi/Block';
import './App.css';
import { BLOCKS_ADDCAT, BLOCKS_ALL, CORRECTION_NONE,
    TXT_NOT_YET_IMPLEMENTED } from './Delphi/Constants'
import DelphiAllBlocks from './Delphi/AllBlocks';

// variables for global JSON information
global.DM_TREE = require('./json/dm_diagnoses.json');
global.DM_LEVELANAMES = {};
global.DM_LEVELBFULLNAMES = {};
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
        global.DM_LEVELANAMES[anode.id] = aname;

        // parse categories
        bnodes = anode.children;
        blen = bnodes.length;
        for (bc = 0; bc < blen; bc++) {
            bnode = bnodes[bc];
            bname = bnode.name;
            global.DM_LEVELBFULLNAMES[bnode.id] = aname + " - " + bname;

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

// main component (rendered by index.js)
export default class App extends Component {
    constructor(props) {
        super(props);
        
        // place holder state (will be filled from JSON data)
        this.state = {
            user: '',
            sessionId: '',
            currentCBlockId: 0,
            historyCBlockId: [],
            newEntry: {
                pressed: 0,
                name: '',
                category: 0
                },
            nextAID: 3,
            blocks: {},
            date: Date.now()
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
                    correction: CORRECTION_NONE,
                    corrspelling: '',
                    corrnewname: '',
                    corrnewsyns: '',
                    corrcombine: 0,
                    corrmoveto: 0,
                    corrmovetox: '',
                    corrnewmods: '',
                    correditmods: '',
                    corrother: ''
                }
            }

            // store in overall state
            this.state.blocks[blockIds[bc]] = blockState;
        }
    }
    
    // original idea of Router (using URL in history) replaced
    // with a "poor-man's switch" on the main component
    render() {
        return (
            <div>
                <DelphiTop />
                {
                this.state.currentCBlockId === 0 ?
                    <DelphiWelcome AppObj={this} />
                : this.state.currentCBlockId === BLOCKS_ADDCAT ?
                    <div>{TXT_NOT_YET_IMPLEMENTED}</div>
                : this.state.currentCBlockId === BLOCKS_ALL ?
                    <DelphiAllBlocks AppObj={this} />
                : this.state.currentCBlockId in global.DM_LEVELCBLOCKS ?
                    <DelphiBlock AppObj={this} />
                :
                    <DelphiNotFound AppObj={this} ErrTxt={this.state.currentCBlockId} />
                }
            </div>
        );
    }
}
