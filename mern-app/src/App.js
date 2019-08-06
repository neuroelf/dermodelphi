// imports
import React, { Component } from 'react';
import axios from 'axios';
import { GlobalHotKeys } from 'react-hotkeys';
import DelphiNotFound from './Delphi/NotFound'
import DelphiTop from './Delphi/Top';
import DelphiWelcome from './Delphi/Welcome';
import DelphiInstructions from './Delphi/Instructions'
import DelphiBlock from './Delphi/Block';
import DelphiNewCategoryPage from './Delphi/NewCategory/Page'
import './App.css';
import * as DC from './Delphi/Constants'
import DelphiAllBlocks from './Delphi/AllBlocks';

// server configuration
global.DM_BACKEND_URL = 'http://localhost:4000/';

// variables for global JSON information
global.DM_TREE = require('./json/dm_diagnoses.json');
global.DM_LEVELANAMES = {};
global.DM_LEVELBNAMES = {};
global.DM_LEVELBFULLNAMES = {};
global.DM_LEVELCBLOCKS = {};
global.DM_LEVELCBLOCKIDS = [];
global.DM_LEVELCBLOCKNAMES = [];
global.DM_LEVELCBLOCKID2NAMES = {};
global.DM_LEVELCNODES = {};

// key map for hotkeys
global.DM_HOTKEYMAP = {
    HK_MARK_BLOCK_AS_CORRECT: DC.HK_MARK_BLOCK_AS_CORRECT,
    HK_NEXT_BLOCK: DC.HK_NEXT_BLOCK
};
global.DM_HOTKEYHANDLERS = {
    HK_MARK_BLOCK_AS_CORRECT: handlerFun,
    HK_NEXT_BLOCK: handlerFun
};
function handlerFun() {
    console.log('Not yet set!');
}

// function for loading the JSON file into global config
function parseDMJSONFile() {
    var anodes = global.DM_TREE.children;
    var aname, anode, bname, bnode, cblock, cnode, blname, blnodes,
        bnodes, cnodes, alen, blen, clen, ac, bc, cc, blc;
    alen = anodes.length;
    blname = '';
    blnodes = [];
    cblock = 0;
    
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
            global.DM_LEVELBNAMES[bnode.id] = bname;
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
            userEmail: '',
            sessionId: '',
            sessionOk: false,
            sessionDate: Date.now(),
            currentCBlockId: DC.BLOCKS_WELCOME,
            historyCBlockId: [],
            newCategory: {
                acat: 1,
                aname: '',
                bname: ''
            },
            newEntry: {
                pressed: 0,
                name: '',
                category: 0
            },
            newAs: [],
            newBs: [],
            newCs: [],
            nextAId: 0,
            nextBId: [1],
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
            if (numBlockNodes > 0) {
                var blockCatId = Math.floor(parseInt(blockNodes[0]) / 10000);
                var blockAId = Math.floor(blockCatId / 100);
                this.state.nextAId = Math.max(this.state.nextAId, blockAId + 1);
                while (this.state.nextBId.length <= this.state.nextAId) {
                    this.state.nextBId.push(1);
                }
                this.state.nextBId[blockAId] = Math.max(
                    this.state.nextBId[blockAId], blockCatId + 1 - 100 * blockAId
                );
            }
            for (cc = 0; cc < numBlockNodes; cc++) {

                // set state for node
                blockState[blockNodes[cc]] = {
                    correct: false,
                    correction: DC.CORRECTION_NONE,
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

        // bind key handler functions
        this.markBlockAsCorrectClick = this.markBlockAsCorrectClick.bind(this);
        this.nextBlockClick = this.nextBlockClick.bind(this);
        this.checkSession = this.checkSession.bind(this);
        this.saveSession = this.saveSession.bind(this);
        this.sessionSaved = this.sessionSaved.bind(this);
        this.sessionSaveFailed = this.sessionSaveFailed.bind(this);
    }

    // key handlers
    markBlockAsCorrectClick(event) {
        var btn = this.refMarkBlockAsCorrect.current;
        if ((btn !== undefined) && (btn !== null)) {
            btn.click();
        }
    }
    nextBlockClick(event) {
        var btn = this.refNextBlock.current;
        if ((btn !== undefined) && (btn !== null)) {
            btn.click();
        }
    }

    // override key handlers
    componentDidMount() {
        global.DM_HOTKEYHANDLERS.HK_MARK_BLOCK_AS_CORRECT = this.markBlockAsCorrectClick;
        global.DM_HOTKEYHANDLERS.HK_NEXT_BLOCK = this.nextBlockClick;
    }

    // hooks for session checking
    checkSession(event) {
        console.log('Checking session...');
        const { userEmail, sessionId } = { ...this.state};
        var AppObj = this;
        axios.get(global.DM_BACKEND_URL + 'checkEmail/' + userEmail + '/' + sessionId)
            .then(function (res) {
                if ('data' in res) {
                    const { data } = { ...res};
                    if (('userEmail' in data) &&
                        ('sessionId' in data)) {
                        if ((data.userEmail === userEmail) &&
                            (data.sessionId === sessionId)) {
                            AppObj.setState({
                                sessionOk: true,
                                currentCBlockId: DC.BLOCKS_INSTRUCT
                             });
                        } else {
                            AppObj.setState({ sessionId: '' });
                            window.alert(DC.SESS_ERROR_NOTFOUND);
                        }
                    } else {
                        AppObj.setState({ sessionId: '' });
                        window.alert(DC.SESS_ERROR_NOTFOUND);
                    }
                } else {
                    AppObj.setState({ sessionId: '' });
                    window.alert(DC.SESS_ERROR_UNEXPECTED);
                }
            })
            .catch(function (err) {
                window.alert('Error:' + JSON.stringify(err));
            });
    }
    // hook for saving session to server
    saveSession() {
        console.log('Saving session...');
        document.body.classList.add('busy-cursor');
        setTimeout(this.sessionSaved, 2000);
    }
    sessionSaved() {
        console.log('Session saved.');
        document.body.classList.remove('busy-cursor');
    }
    sessionSaveFailed() {
        window.alert('Saving session failed!');
        document.body.classList.remove('busy-cursor');
    }
    
    // original idea of Router (using URL in history) replaced
    // with a "poor-man's switch" on the main component
    render() {
        return (
            <GlobalHotKeys keyMap={global.DM_HOTKEYMAP} handlers={global.DM_HOTKEYHANDLERS}><div>
                <DelphiTop AppObj={this} />
                {
                this.state.currentCBlockId === DC.BLOCKS_WELCOME ?
                    <DelphiWelcome AppObj={this} />
                : this.state.currentCBlockId === DC.BLOCKS_INSTRUCT ?
                    <DelphiInstructions AppObj={this} />
                : this.state.currentCBlockId === DC.BLOCKS_ADDCAT ?
                    <div><DelphiNewCategoryPage AppObj={this} /></div>
                : this.state.currentCBlockId === DC.BLOCKS_ALL ?
                    <DelphiAllBlocks AppObj={this} />
                : this.state.currentCBlockId in global.DM_LEVELCBLOCKS ?
                    <DelphiBlock AppObj={this} />
                :
                    <DelphiNotFound AppObj={this} ErrTxt={this.state.currentCBlockId} />
                }
            </div></GlobalHotKeys>
        );
    }
}
