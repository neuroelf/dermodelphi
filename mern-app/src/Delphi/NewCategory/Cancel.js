import React, { Component } from 'react';
import { NEWENTRY_CANCEL } from '../Constants'

export default class DelphiNewCategoryCancel extends Component {
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

        // extract historyCBlockId to go back
        const { historyCBlockId } = { ...this.props.AppObj.state};
        const newHistoryCBlockId = [ ...historyCBlockId];
        var currentCBlockId = newHistoryCBlockId.pop();

        // reset state for these controls
        const newNewCategory = {
            acat: 1,
            aname: '',
            bname: ''
        }
        this.props.AppObj.setState( {
            currentCBlockId: currentCBlockId,
            historyCBlockId: newHistoryCBlockId,
            newCategory: newNewCategory
        });
    }

    render() {
        return (
            <button onClick={this.handleClick}>{NEWENTRY_CANCEL}</button>
        );
    }
}
