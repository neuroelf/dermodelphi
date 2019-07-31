import React, { Component } from 'react';

function correctName(id) {
    return `correct` + id.toString();
}

export default class DelphiControlCheckBox extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            checked: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.markRowAsCorrect = this.markRowAsCorrect.bind(this);
    }
    
    handleChange(event) {
        this.setState({checked: event.target.checked});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    markRowAsCorrect() {
        window.alert('pressed');
    }
    
    render() {
        return (
            <input type="checkbox" name={correctName(this.props.nodeId)}
             id={correctName(this.props.nodeId)} checked={!!this.state.checked}
             onChange={this.handleChange} />
        );
    }
}
