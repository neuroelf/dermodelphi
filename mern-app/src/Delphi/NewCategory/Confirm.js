import React, { Component } from 'react';
import { NEWENTRY_CONFIRM,
    NEWCATEGORY_ERROR_ANAME, NEWCATEGORY_ERROR_BNAME
    } from '../Constants'

export default class DelphiNewCategoryConfirm extends Component {
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

        // extract all settings we may possible touch, and copy them
        const { AppObj } = { ...this.props};
        const { blocks, newCategory, newEntry, newAs, newBs, nextAId, nextBId,
            historyCBlockId } = { ...AppObj.state};
        const newBlocks = Object.assign({}, blocks);
        const newNewEntry = Object.assign({}, newEntry);
        const newNewAs = [ ...newAs ];
        const newNewBs = [ ...newBs ];
        var newNextAId = nextAId;
        const newNextBId = [ ...nextBId];
        const newHistoryCBlockId = [ ...historyCBlockId];

        // get newAName and check need to add a super-category
        var newAName = '';
        var newAId = nextAId;
        const oldAIds = Object.keys(global.DM_LEVELANAMES);
        var oldAs = [];
        var idCount = 0;
        for (idCount = 0; idCount < oldAIds.length; idCount++) {
            oldAs.push(global.DM_LEVELANAMES[oldAIds[idCount]].toLowerCase());
        }
        if (newCategory.acat < nextAId) {
            newAName = global.DM_LEVELANAMES[newCategory.acat];
            newAId = newCategory.acat;
        } else {
            newAName = newCategory.aname;
            if ((newAName === '') ||
                (oldAs.includes(newAName.toLowerCase()))) {
                window.alert(NEWCATEGORY_ERROR_ANAME);
                const newNewCategory = Object.assign({}, newCategory);
                newNewCategory.acat = oldAIds[oldAs.indexOf(newAName.toLowerCase())];
                newNewCategory.aname = '';
                this.props.AppObj.setState({ newCategory: newNewCategory });
                return;
            }
        }

        // perform same for B
        var newBName = newCategory.bname;
        const oldBs = Object.keys(global.DM_LEVELBNAMES)
            .filter(BNodeId => (Math.floor(BNodeId / 100) === newAId));
        for (idCount = 0; idCount < oldBs.length; idCount++) {
            oldBs[idCount] = global.DM_LEVELBNAMES[oldBs[idCount]].toLowerCase();
        }
        if (oldBs.includes(newBName.toLowerCase())) {
            window.alert(NEWCATEGORY_ERROR_BNAME);
            return;
        }
        var newBIdValue = 100 * newAId + nextBId[newAId];
        newNextBId[newAId] = newNextBId[newAId]+1;
        global.DM_LEVELANAMES[newAId] = newAName;
        global.DM_LEVELBNAMES[newBIdValue] = newBName;
        global.DM_LEVELBFULLNAMES[newBIdValue] = newAName + " - " + newBName;
        var nextCBlockId = 100*newBIdValue+1;
        global.DM_LEVELCBLOCKS[nextCBlockId] = [];
        global.DM_LEVELCBLOCKIDS.push(nextCBlockId);
        global.DM_LEVELCBLOCKNAMES.push(newAName + " - " + newBName);
        global.DM_LEVELCBLOCKID2NAMES[nextCBlockId] = newAName + " - " + newBName;
        newBlocks[nextCBlockId] = { locked: false };
        newNewEntry.pressed = nextCBlockId;
        newNewEntry.category = newBIdValue;
        if (newCategory.acat >= nextAId) {
            newNewAs.push({
                id: nextAId,
                name: newAName
            });
            newNextAId += 1;
        }
        newNewBs.push({
            id: newBIdValue,
            name: newBName
        });

        // set back to original value
        const newNewCategory = {
            acat: 1,
            aname: '',
            bname: ''
        }
        this.props.AppObj.setState( {
            currentCBlockId: nextCBlockId,
            historyCBlockId: newHistoryCBlockId,
            newCategory: newNewCategory,
            newEntry: newNewEntry,
            nextAId: newNextAId,
            nextBId: newNextBId,
            newAs: newNewAs,
            newBs: newNewBs,
            blocks: newBlocks
        }, () => {
            AppObj.saveSessionBlock(AppObj.nullHook, nextCBlockId);
        });
    }

    render() {
        const { newCategory, nextAId } = { ...this.props.AppObj.state };
        var disabled = !(((newCategory.acat < nextAId)
            || (newCategory.aname !== ''))
            && (newCategory.bname !== ''));
        return (
            <button disabled={disabled}
                onClick={this.handleClick}>{NEWENTRY_CONFIRM}</button>
        );
    }
}
