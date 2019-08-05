import React, { Component } from 'react';
import { NEWCATEGORY_ACAT_ANAME_EMPTY } from '../Constants'

export default class DelphiNewCategoryAName extends Component {
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
        const { newCategory } = { ...this.props.AppObj.state};
        const newNewCategory = Object.assign({}, newCategory);
        newNewCategory.aname = event.target.value;
        this.props.AppObj.setState({ newCategory: newNewCategory });
    }
    
    render() {
        const { newCategory } = { ...this.props.AppObj.state };
        return (
            <input className="delphi-form-minwidth"
                type="text" placeholder={NEWCATEGORY_ACAT_ANAME_EMPTY}
                value={newCategory.aname} onChange={this.handleChange} />
        );
    }
}
