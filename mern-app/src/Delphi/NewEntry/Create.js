import React, { Component } from 'react';
import { NEWENTRY_CREATE }  from '../Constants'

export default class DelphiNewEntryCreate extends Component {
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
        const newNewEntry = {
            pressed: this.props.AppObj.state.currentCBlockId,
            name: '',
            category: Math.floor(this.props.AppObj.state.currentCBlockId / 100)
        };
        this.props.AppObj.setState({ newEntry: newNewEntry });
    }

    render() {
        return (
            <button onClick={this.handleClick}>{NEWENTRY_CREATE}</button>
        );
    }
}
