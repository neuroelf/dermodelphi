import React, { Component } from 'react';
import { NEWENTRY_CONFIRM }  from '../Constants'

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
        const { newEntry } = { ...this.props.AppObj.state};

        // handle adding the actual diagnosis here
        console.log(newEntry);

        // set back to original value
        const newNewEntry = {
            pressed: 0,
            name: '',
            category: 0
        }
        this.props.AppObj.setState( {
            currentCBlockId: this.props.AppObj.state.currentCBlockId,
            newEntry: newNewEntry
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
