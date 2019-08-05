import React, { Component } from 'react';
import { NEWCATEGORY_ACAT_BNAME_EMPTY } from '../Constants'

export default class DelphiNewCategoryBName extends Component {
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
        newNewCategory.bname = event.target.value;
        this.props.AppObj.setState({ newCategory: newNewCategory });
    }
    
    render() {
        const { newCategory } = { ...this.props.AppObj.state };
        return (
            <input className="delphi-form-minwidth"
                type="text" placeholder={NEWCATEGORY_ACAT_BNAME_EMPTY}
                value={newCategory.bname} onChange={this.handleChange} />
        );
    }
}
