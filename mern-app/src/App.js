// imports
import React, { Component } from 'react';
import axios from 'axios';
import { GlobalHotKeys } from 'react-hotkeys';
import DelphiNotFound from './Delphi/NotFound'
import DelphiTop from './Delphi/Top';
import DelphiWelcome from './Delphi/Welcome';
import DelphiInstructions from './Delphi/Instructions'
import DelphiNewCategoryPage from './Delphi/NewCategory/Page'
import DelphiAllBlocks from './Delphi/AllBlocks';
import DelphiBlock from './Delphi/Block';
import './App.css';
import * as DC from './Delphi/Constants'

// server configuration
// global.DM_BACKEND_URL = 'http://localhost:4000/';
global.DM_BACKEND_URL = 'https://delphi.diagnosismapper.com/';

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
                    blname = aname + " - " + bname + DC.BLOCK_TXT + blc.toString();
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
            tokenId: '',
            tokenValid: false,
            tokenVisible: false,
            adminSessions: [],
            adminBlocks: {},
            treeHeight: 0,
            treeVisible: false,
            query: '',
            results: [],
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
            nextAId: 3,
            nextBId: [1, 23, 20, 1],
            blocks: {}
        };

        // parse the JSON file synchronously
        parseDMJSONFile();

        // below, the state is extended such that
        // - each block has a state (i.e. whether controls are locked)
        // - and each row within the block has a set of states

        // iterate over blocks
        var bc, cc, blockNodes, blockState;
        var blockIds = Object.keys(global.DM_LEVELCBLOCKS);
        var numBlocks = blockIds.length;
        for (bc = 0; bc < numBlocks; bc++) {

            // initialize block state with { locked: false }
            blockState = {
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
        this.nullHook = this.nullHook.bind(this);
        this.checkSession = this.checkSession.bind(this);
        this.checkToken = this.checkToken.bind(this);
        this.adminLoadBlocks = this.adminLoadBlocks.bind(this);
        this.loadSession = this.loadSession.bind(this);
        this.saveSession = this.saveSession.bind(this);
        this.saveSessionBlock = this.saveSessionBlock.bind(this);
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

    // null hook
    nullHook() {
        return;
    }

    // hook for session checking
    checkSession(event) {
        //event.preventDefault();
        const { userEmail, sessionId } = { ...this.state};
        var AppObj = this;
        axios.get(global.DM_BACKEND_URL + 'checkEmail/' + userEmail + '/' + sessionId)
        .then(function (res) {
            if ('data' in res) {
                const { data } = { ...res};
                if (('userEmail' in data) &&
                    ('sessionId' in data)) {
                    if ((data.userEmail.toLowerCase() === userEmail.toLowerCase()) &&
                        (data.sessionId === sessionId)) {
                        AppObj.setState({
                            sessionOk: true,
                            currentCBlockId: DC.BLOCKS_INSTRUCT
                            });
                        AppObj.loadSession();
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
            }})
        .catch(function (err) {
            window.alert('Error:' + JSON.stringify(err));
        });
    }

    // hook for token checking
    checkToken(event) {
        //event.preventDefault();
        const { sessionId, tokenId } = { ...this.state};
        if (tokenId.length !== 8) {
            return;
        }
        var AppObj = this;
        axios.get(global.DM_BACKEND_URL + 
            'admin/' + sessionId + '/token/' + tokenId + '/sessions')
        .then(function (res) {
            if ('data' in res) {
                const { data } = { ...res};
                if ('error' in data) {
                    window.alert(data.error);
                    return;
                }
                if (data.length > 1) {
                    AppObj.setState({
                        adminSessions: data,
                        tokenValid: true
                    }, () => {AppObj.adminLoadBlocks()});
                } else {
                    AppObj.setState({ adminSessions: [], adminBlocks: {} });
                    window.alert(DC.TOKEN_ERROR_UNEXPECTED);
                    }
            } else {
                AppObj.setState({ adminSessions: [], adminBlocks: {} });
                window.alert(DC.TOKEN_ERROR_UNEXPECTED);
            }})
        .catch(function (err) {
            window.alert('Error:' + JSON.stringify(err));
        });
    }

    // hook for loading/resuming a session
    adminLoadBlocks(blockId) {
        const { sessionId, tokenId, tokenValid, currentCBlockId } = { ...this.state};
        if (!tokenValid || (tokenId.length !== 8)) {
            return;
        }
        if (blockId === undefined || blockId === null) {
            blockId = currentCBlockId;
        }
        const AppObj = this;
        axios.get(global.DM_BACKEND_URL + 
            'admin/' + sessionId + '/token/' + tokenId + '/blocks/' + blockId)
        .then(function (res) {
            if ('data' in res) {
                const { data } = { ...res};
                if (data === null) {
                    window.alert(DC.SESS_ERROR_UNEXPECTED);
                    return;
                }
                if (data.length === 0) {
                    return;
                }
                var newAdminBlocks = AppObj.state.adminBlocks;
                newAdminBlocks[blockId] = data;
                AppObj.setState({ adminBlocks: newAdminBlocks });
            } else {
                window.alert(DC.TOKEN_ERROR_UNEXPECTED);
            }})
        .catch(function (err) {
            window.alert('Error:' + JSON.stringify(err));
        });
    }

    // hook for loading/resuming a session
    loadSession() {
        const { sessionId } = { ...this.state};
        const AppObj = this;
        const newAs = [];
        const newBs = [];
        const newCs = [];
        const nextAId = [0];
        const nextBId = [];
        const newStateVals = {};
        axios.get(global.DM_BACKEND_URL + 'session/' + sessionId)
        .then(function (res) {
            if ('data' in res) {
                const { data } = { ...res};
                if (data === null) {
                    window.alert(DC.SESS_ERROR_UNEXPECTED);
                    return;
                }
                if ('currentCBlockId' in data) {
                    if (parseInt(data.currentCBlockId) > DC.BLOCKS_ALL) {
                        newStateVals['currentCBlockId'] = parseInt(data.currentCBlockId);
                    }
                }
                if ('newAs' in data) {
                    if (data.newAs.length > 0) {
                        newAs.push.apply(newAs, data.newAs);
                        newStateVals['newAs'] = newAs;
                    }
                }
                if ('newBs' in data) {
                    if (data.newBs.length > 0) {
                        newBs.push.apply(newBs, data.newBs);
                        newStateVals['newBs'] = newBs;
                    }
                }
                if ('newCs' in data) {
                    if (data.newCs.length > 0) {
                        newCs.push.apply(newCs, data.newCs);
                        newStateVals['newCs'] = newCs;
                    }
                }
                if ('nextAId' in data) {
                    nextAId[0] = data.nextAId;
                    newStateVals['nextAId'] = nextAId[0];
                }
                if ('nextBId' in data) {
                    if (data.nextBId.length > 0) {
                        nextBId.push.apply(nextBId, data.nextBId);
                        newStateVals['nextBId'] = nextBId;
                    }
                }
            }
        }).then(function () {
            axios.get(global.DM_BACKEND_URL + 'session/' + sessionId + '/blocks')
            .then(function (res) {
                if ('data' in res) {
                    const { data } = { ...res};
                    if (data === null) {
                        window.alert(DC.SESS_ERROR_UNEXPECTED);
                        return;
                    }
                    const { blocks } = { ...AppObj.state};
                    const newBlocks = Object.assign({}, blocks);
                    for (var bc = 0; bc < data.length; bc++) {
                        const block = data[bc];
                        newBlocks[block.blockId] = block.block;
                    }
                    newStateVals['blocks'] = newBlocks;
                    var blname = '';
                    var cc = 0;
                    for (cc = 0; cc < newAs.length; cc++) {
                        const newANode = newAs[cc];
                        global.DM_LEVELANAMES[newANode.id] = newANode.name;
                    }
                    for (cc = 0; cc < newBs.length; cc++) {
                        const newBNode = newBs[cc];
                        global.DM_LEVELBNAMES[newBNode.id] = newBNode.name;
                        global.DM_LEVELBFULLNAMES[newBNode.id] = 
                            global.DM_LEVELANAMES[Math.floor(newBNode.id / 100)] +
                            " - " + newBNode.name;
                    }
                    for (cc = 0; cc < newCs.length; cc++) {
                        const newCNode = newCs[cc];
                        global.DM_LEVELCNODES[newCNode.id] = {
                            name: newCNode.name,
                            id: newCNode.id,
                            blockid: newCNode.blockid,
                            modifiers: [],
                            synonyms: []
                        };
                        if (!(newCNode.blockid in global.DM_LEVELCBLOCKS)) {
                            global.DM_LEVELCBLOCKS[newCNode.blockid] = [];
                            global.DM_LEVELCBLOCKIDS.push(newCNode.blockid);
                            blname = global.DM_LEVELBFULLNAMES[Math.floor(newCNode.blockid / 100)] + 
                                DC.BLOCK_TXT + (newCNode.blockid % 100).toString();
                            global.DM_LEVELCBLOCKNAMES.push(blname);
                            global.DM_LEVELCBLOCKID2NAMES[newCNode.blockid] = blname;
                        }
                        global.DM_LEVELCBLOCKS[newCNode.blockid].push(newCNode.id);
                    }
                } else {
                    Object.keys(newStateVals).map(key => delete newStateVals[key]);
                }
            }).then(function () {
                AppObj.setState(newStateVals);
            });
        });
    }

    // hook for saving session to server
    saveSession() {
        document.body.classList.add('busy-cursor');
        const { sessionId, currentCBlockId,
            newAs, newBs, newCs, nextAId, nextBId } = { ...this.state};
        var postUrl = global.DM_BACKEND_URL + 'session/' + sessionId + '/save';
        axios.post(postUrl, {
            sessionId: sessionId,
            sessionDate: Date.now(),
            currentCBlockId: currentCBlockId,
            newAs: newAs,
            newBs: newBs,
            newCs: newCs,
            nextAId: nextAId,
            nextBId: nextBId
        })
        .catch(function (err) {
            window.alert('Error: ' + JSON.stringify(err));
        })
        .finally(function () {
            document.body.classList.remove('busy-cursor');
        });
    }
    saveSessionBlock(successFcn, blockId) {
        document.body.classList.add('busy-cursor');
        const AppObj = this;
        const { sessionId, currentCBlockId, blocks } = { ...this.state};
        if (blockId === undefined) {
            blockId = currentCBlockId;
        }
        var postUrl = global.DM_BACKEND_URL +
            'session/' + sessionId + '/block/' + blockId.toString() + '/save';
        axios.post(postUrl, {
            block: blocks[parseInt(blockId)]
        })
        .then(function (res) {
            if ('data' in res) {
                const { data } = { ...res};
                if (data === null) {
                    window.alert(DC.SESS_ERROR_UNEXPECTED);
                    document.body.classList.remove('busy-cursor');
                    return;
                }
                if (!('ok' in data)) {
                    window.alert(DC.SESS_ERROR_UNEXPECTED);
                    document.body.classList.remove('busy-cursor');
                    return;
                }
                if (data.ok !== 1) {
                    window.alert(DC.SESS_ERROR_UNEXPECTED);
                    document.body.classList.remove('busy-cursor');
                    return;
                }
                if (successFcn !== null) {
                    successFcn();
                    AppObj.saveSession();
                }
            } else {
                window.alert(DC.SESS_ERROR_UNEXPECTED);
            }
        })
        .catch(function (err) {
            window.alert(JSON.stringify(err));
        });
        document.body.classList.remove('busy-cursor');
    }
    
    // original idea of Router (using URL in history) replaced
    // with a "poor-man's switch" on the main component
    render() {
        return (
            <GlobalHotKeys keyMap={global.DM_HOTKEYMAP} handlers={global.DM_HOTKEYHANDLERS}><div>
                <DelphiTop AppObj={this} />
                <div style={{ display: (!!this.state.treeVisible ? 'none': 'initial') }}>
                    {this.state.currentCBlockId === DC.BLOCKS_WELCOME ?
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
                </div>
            </div></GlobalHotKeys>
        );
    }
}
