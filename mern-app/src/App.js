import React, { Component } from 'react';
import DelphiTop from './DelphiTop.js';
import DelphiBlock from './DelphiBlock.js';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.css';
//import logo from './logo.svg';
import './App.css';
//import './mockup.css';

// load global JSON information
global.DM_TREE = require('./json/dm_diagnoses.json');
global.DM_LEVELANAMES = [];
global.DM_LEVELBNAMES = [];
global.DM_LEVELCBLOCKS = {};
global.DM_LEVELCBLOCKNAMES = [];
global.DM_LEVELCBLOCKID2NAMES = {};
global.DM_LEVELCNODES = {};

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentCBlock: 0,
            blocks: {}
        };
        
        var anodes = global.DM_TREE.children;
        var aname, anode, bname, bnode, cblock, cnode, blname, blnodes,
            bnodes, cnodes, alen, blen, clen, ac, bc, cc, blc;
        alen = anodes.length;
        blname = '';
        blnodes = [];
        cblock = 0;
        for (ac = 0; ac < alen; ac++) {
            anode = anodes[ac];
            aname = anode.name;
            global.DM_LEVELANAMES.push(aname);
            bnodes = anode.children;
            blen = bnodes.length;
            for (bc = 0; bc < blen; bc++) {
                bnode = bnodes[bc];
                bname = bnode.name;
                global.DM_LEVELBNAMES.push(aname + " - " + bname);
                cnodes = bnode.children;
                clen = cnodes.length;
                blc = 0;
                for (cc = 0; cc < clen; cc++) {
                    cnode = cnodes[cc];
                    global.DM_LEVELCNODES[cnode.id] = cnode;
                    if (cnode.blockid !== cblock) {
                        if (cblock !== 0) {
                            global.DM_LEVELCBLOCKS[cblock] = blnodes;
                            if (this.state.currentCBlock === 0) {
                                this.state.currentCBlock = cblock;
                            }
                        }
                        blnodes = [];
                        cblock = cnode.blockid;
                        blc = blc + 1;
                        blname = aname + " - " + bname + ", block " + blc.toString();
                        global.DM_LEVELCBLOCKNAMES.push(blname);
                        global.DM_LEVELCBLOCKID2NAMES[cblock] = blname;
                    }
                    blnodes.push(cnode.id);
                }
            }
            global.DM_LEVELCBLOCKS[cblock] = blnodes;
            global.DM_LEVELCBLOCKNAMES.push(blname);
            global.DM_LEVELCBLOCKID2NAMES[cblock] = blname;
        }
    }
    
    render() {

        return (
            <div>
                <DelphiTop />
                <div class="form-row controls-paragraph" align="right">
                    <select name="choose-category" id="choose-category">
                        <option value="0" selected>Jump to other category and block...</option>
                        {global.DM_LEVELCBLOCKNAMES.map(
                            blockName => <option value="{blockName}">{blockName}</option>
                        )}
                    </select>
                </div>

                <p>&nbsp;</p>

                <div class="form-container" id="formContainer">
                    <form action="action_page.php">
                        <table class="form-table" width="100%">
                            {Object.keys(global.DM_LEVELCBLOCKS).map(
                                blockID => <DelphiBlock currentCBlock={blockID} />
                            )}
                        </table>
                    </form>
                </div>
            </div>
      );

    }
}

export default App;
