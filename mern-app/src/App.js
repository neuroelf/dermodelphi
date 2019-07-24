import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
//import './mockup.css';
import DelphiTop from './DelphiTop.js';
import DelphiBlock from './DelphiBlock.js';

// load global JSON information
global.DM_DIAGS = require('./json/dm_diagnoses.json');
global.DM_LEVELA = {}
global.DM_LEVELB = {}
global.DM_LEVELC = {}
global.DM_LEVELCBLOCKS = {}
global.DM_TREE = {'name': '', 'children': []}

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentCBlock: 0,
            levelA: [],
            levelB: [],
            levelC: [],
            lockedBlocks: []
        };
        
        var dd = global.DM_DIAGS.data;
        var dda = dd.levelA;
        var ddb = dd.levelA;
        var ddc = dd.levelA;
        var alen = dda.length;
        var blen = ddb.length;
        var clen = ddc.length;
        var bc;
        var ai;
        var bi;
        var pa;
        var pb;
        var anames = [];
        var bnames = {};
        for (bc = 0; bc < alen; bc++) {
            global.DM_LEVELA[dda[bc].index] = dda[bc];
            this.state.levelA.push({
                index: dda[bc].index,
                correct: false,
                correction: 0,
                correctionInfo: []
            });
            global.DM_TREE['children'].push({'name': dda[bc].label, 'children': []});
            anames.push(dda[bc].label);
            bnames[bc] = [];
        }
        for (bc = 0; bc < blen; bc++) {
            global.DM_LEVELB[ddb[bc].index] = ddb[bc];
            this.state.levelB.push({
                index: ddb[bc].index,
                correct: false,
                correction: 0,
                correctionInfo: []
            });
            pa = ddb[bc].parent[0];
            for (ai = 0; ai < global.DM_TREE.children.length; ai++) {
                if (anames[ai] === pa) break;
            }
            global.DM_TREE['children'][ai]['children'].push({'name': ddb[bc].label, 'children': []});
            bnames[ai].push(ddb[bc].label);
        }
        for (bc = 0; bc < clen; bc++) {
            global.DM_LEVELC[ddc[bc].index] = ddc[bc];
            this.state.levelC.push({
                index: ddc[bc].index,
                correct: false,
                correction: 0,
                correctionInfo: [0, '']
            });
            var cb = ddc[bc].block;
            if (global.DM_LEVELCBLOCKS[cb] === undefined) {
                global.DM_LEVELCBLOCKS[cb] = [];
            }
            global.DM_LEVELCBLOCKS[cb].push(ddc[bc].index);
            pa = ddc[bc].parent[0];
            pb = ddc[bc].parent[1];
            for (ai = 0; ai < global.DM_TREE.children.length; ai++) {
                if (anames[ai] === pa) break;
            }
            for (bi = 0; bi < global.DM_TREE.children[ai].children.length; bi++) {
                if (bnames[ai][bi] === pb) break;
            }
            global.DM_TREE['children'][ai]['children'][bi]['children'].push({'name': ddc[bc].label, 'value': ddc[bc].index});
        }
    }
    
    render() {
      return (
<div>

    <DelphiTop />

    <DelphiBlock block={this.state.currentCBlock} />

</div>
      );
    }
}

export default App;
