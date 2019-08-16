import React, { Component } from 'react';
import { BLOCKS_ALL, BLOCKS_ALL_TXT } from './Constants'
import {
    DelphiTreeNodeCollapse,
    DelphiTreeNodeExpand,
    DelphiTreeNodeUpdate,
    DelphiTreeRootElement
    } from './Tree';

export default class DelphiSelectCategory extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { AppObj } = { ...this.props};
        var nextCBlockId = parseInt(event.target.value);
        const { historyCBlockId, tokenValid, tokenId } = { ...AppObj.state };
        const newHistoryBlockId = [ ...historyCBlockId]
        newHistoryBlockId.push(AppObj.state.currentCBlockId)
        if (!!tokenValid && tokenId !== '') {
            AppObj.adminLoadBlocks(parseInt(nextCBlockId));
        }
        AppObj.setState({
            currentCBlockId: nextCBlockId,
            historyCBlockId: newHistoryBlockId,
            query: '',
            results: []
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    componentDidMount() {
        this.componentDidUpdate();
    }
    componentDidUpdate() {
        const { currentCBlockId } = { ...this.props.AppObj.state};
        var currentCCat = Math.floor(currentCBlockId / 100);
        const { children, _children } = { ...DelphiTreeRootElement};
        var ch = children;
        if ((ch === undefined) || (ch === null)) {
            ch = _children;
        }
        if ((ch === undefined) || (ch === null)) {
            return;
        }
        var cc, cch, ccc;
        for (cc = 0; cc < ch.length ; cc++) {
            cch = ch[cc].children;
            if ((cch === undefined) || (cch === null)) {
                cch = ch[cc]._children;
            }
            for (ccc = 0; ccc < cch.length; ccc++) {
                if (cch[ccc].data.id === currentCCat) {
                    DelphiTreeNodeExpand(cch[ccc]);
                } else {
                    DelphiTreeNodeCollapse(cch[ccc]);
                }
            }
        }
        DelphiTreeNodeUpdate(DelphiTreeRootElement);
    }
    
    render() {
        return (
            <select onChange={this.handleChange} value={this.props.AppObj.state.currentCBlockId}>
                <option value={(BLOCKS_ALL).toString()} key={(BLOCKS_ALL).toString()}>{BLOCKS_ALL_TXT}</option>
                {Object.keys(global.DM_LEVELCBLOCKS).map(blockId => 
                    <option key={"block"+blockId} value={blockId}>{global.DM_LEVELCBLOCKID2NAMES[blockId]}</option>)}
            </select>
        );
    }
}
