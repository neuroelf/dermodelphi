import React, { Component } from 'react';
import { NEWENTRY_CONFIRM, NEWENTRY_ERROR_BAD_BLOCK, NEWENTRY_ERROR_CNAME,
    CORRECTION_NONE } from '../Constants'

export default class DelphiNewEntryConfirm extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    handleClick(event) {
        event.preventDefault();
        const { blocks, newEntry, newCs } = { ...this.props.AppObj.state};
        var newName = newEntry.name;
        var newCBlockId = newEntry.pressed;
        var newCCatId = Math.floor(newCBlockId / 100);
        const CBlock = global.DM_LEVELCBLOCKS[newCBlockId];
        if (CBlock === undefined) {
            window.alert(NEWENTRY_ERROR_BAD_BLOCK);
            return;
        }
        const oldCNodes = Object.keys(global.DM_LEVELCNODES)
            .filter(CNodeId => (Math.floor(global.DM_LEVELCNODES[CNodeId].id / 10000) === newCCatId));
        var oldCs = [];
        var idCount = 0;
        for (idCount = 0; idCount < oldCNodes.length; idCount++) {
            oldCs.push(global.DM_LEVELCNODES[oldCNodes[idCount]].name.toLowerCase());
        }
        if (oldCs.includes(newName.toLowerCase())) {
            window.alert(NEWENTRY_ERROR_CNAME);
            return;
        }
        var newCNodeId = 100 * newCBlockId;
        for (idCount = 0; idCount < CBlock.length; idCount++) {
            newCNodeId = Math.max(newCNodeId, CBlock[idCount]);
        }

        // handle adding the actual diagnosis here
        newCNodeId++;
        global.DM_LEVELCNODES[newCNodeId] =	{
            name: newName,
            id: newCNodeId,
            blockid: newCBlockId,
            modifiers: [],
            synonyms: []
        };
        global.DM_LEVELCBLOCKS[newCBlockId].push(newCNodeId);
        const newBlocks = Object.assign({}, blocks);
        newBlocks[newCBlockId][newCNodeId] = {
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
        };
        const newNewCs = [ ...newCs];
        newNewCs.push({
            name: newName,
            id: newCNodeId,
            blockid: newCBlockId
        });

        // set back to original value
        const newNewEntry = {
            pressed: 0,
            name: '',
            category: 0
        }
        this.props.AppObj.setState( {
            currentCBlockId: this.props.AppObj.state.currentCBlockId,
            newEntry: newNewEntry,
            blocks: newBlocks
        });
    }

    render() {
        const { newEntry } = { ...this.props.AppObj.state };
        return (
            <button disabled={(newEntry.name === '' || newEntry.category < 101)}
                onClick={this.handleClick}>{NEWENTRY_CONFIRM}</button>
        );
    }
}
