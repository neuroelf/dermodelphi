import React, { Component } from 'react';
import { BLOCKS_ADDCAT, BLOCKS_ALL, NEWENTRY_CAT_NEW, NEWENTRY_CAT_SELECT } from '../Constants'

export default class DelphiNewEntryCategory extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { newEntry } = { ...this.props.AppObj.state};
        const newNewEntry = Object.assign({}, newEntry);
        var newCategory = parseInt(event.target.value);

        // deal with "add category"
        if (newCategory === BLOCKS_ALL) {
            console.log('To be implemented!');
            // jump to another "special block"! with then ability to jump back!
            this.props.AppObj.setState( { currentCBlockId: BLOCKS_ADDCAT });
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
                <option value={BLOCKS_ALL} key={BLOCKS_ALL}>{NEWENTRY_CAT_NEW}</option>
                {Object.keys(global.DM_LEVELBFULLNAMES)
                    .map(BNodeId =>
                    <option value={BNodeId} key={BNodeId}>{global.DM_LEVELBFULLNAMES[BNodeId]}</option>)}
            </select>
        );
    }
}
