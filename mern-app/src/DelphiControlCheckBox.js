import React, { Component } from 'react';

function correctName(id) {
    return `correct` + id.toString();
}

class DelphiControlCheckBox extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.markRowAsCorrect = this.markRowAsCorrect.bind(this);
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
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
             id={correctName(this.props.nodeId)} value={this.state.value} />
        );
    }
}

export default DelphiControlCheckBox;
