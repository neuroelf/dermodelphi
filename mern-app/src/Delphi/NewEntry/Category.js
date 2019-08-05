import React, { Component } from 'react';
import { BLOCKS_ADDCAT, NEWENTRY_CAT_NEW, NEWENTRY_CAT_SELECT } from '../Constants'

export default class DelphiNewEntryCategory extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { newEntry, historyCBlockId } = { ...this.props.AppObj.state};
        const newNewEntry = Object.assign({}, newEntry);
        const newHistoryCBlockId = [ ...historyCBlockId];
        newHistoryCBlockId.push(this.props.AppObj.state.currentCBlockId);
        var newCategory = parseInt(event.target.value);

        // deal with "add category"
        if (newCategory === BLOCKS_ADDCAT) {
            this.props.AppObj.setState( { 
                currentCBlockId: BLOCKS_ADDCAT,
                historyCBlockId: newHistoryCBlockId
            });
            return;
        }

        newNewEntry.category = newCategory;
        this.props.AppObj.setState({ newEntry: newNewEntry });
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const { newEntry } = { ...this.props.AppObj.state };
        return (
            <select value={newEntry.category.toString()}
                disabled={newEntry.name === ''} onChange={this.handleChange}>
                <option value="0" key="0">{NEWENTRY_CAT_SELECT}</option>
                <option value={BLOCKS_ADDCAT} key={BLOCKS_ADDCAT}>{NEWENTRY_CAT_NEW}</option>
                {Object.keys(global.DM_LEVELBFULLNAMES)
                    .map(BNodeId =>
                    <option value={BNodeId} key={BNodeId}>{global.DM_LEVELBFULLNAMES[BNodeId]}</option>)}
            </select>
        );
    }
}
