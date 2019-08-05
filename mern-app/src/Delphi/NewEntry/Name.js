import React, { Component } from 'react';
import { NEWENTRY_NAME_EMPTY } from '../Constants'

export default class DelphiCorrectionNewName extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    handleChange(event) {
        const { newEntry } = { ...this.props.AppObj.state};
        const newNewEntry = Object.assign({}, newEntry);
        newNewEntry.name = event.target.value;
        this.props.AppObj.setState({ newEntry: newNewEntry });
    }
    
    render() {
        const { currentCBlockId, newEntry } = { ...this.props.AppObj.state};
        return (
            <span>{ (newEntry.pressed === currentCBlockId) ?
                <input className="delphi-form-minwidth"
                    type="text" placeholder={NEWENTRY_NAME_EMPTY}
                    value={newEntry.name} onChange={this.handleChange} />
            :
                ''}
            </span>
        );
    }
}
