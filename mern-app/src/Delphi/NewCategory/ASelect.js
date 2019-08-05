import React, { Component } from 'react';
import { BLOCKS_ADDCAT, NEWCATEGORY_ACAT_NEW } from '../Constants'

export default class DelphiNewCategoryASelect extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { newCategory } = { ...this.props.AppObj.state};
        const newNewCategory = Object.assign({}, newCategory);
        var newACategory = parseInt(event.target.value);
        newNewCategory.acat = newACategory;
        this.props.AppObj.setState({ newCategory: newNewCategory });
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const { newCategory } = { ...this.props.AppObj.state };
        return (
            <select value={newCategory.acat.toString()} onChange={this.handleChange}>
                {Object.keys(global.DM_LEVELANAMES)
                    .map(ANodeId =>
                    <option value={ANodeId} key={ANodeId}>{global.DM_LEVELANAMES[ANodeId]}</option>)}
                <option value={BLOCKS_ADDCAT} key={BLOCKS_ADDCAT}>{NEWCATEGORY_ACAT_NEW}</option>
            </select>
        );
    }
}
