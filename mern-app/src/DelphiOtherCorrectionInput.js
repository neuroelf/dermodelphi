import React, { Component } from 'react';

class DelphiOtherCorrectionInput extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        newState[this.props.CBlockId][this.props.CNodeId].corrother = event.target.value;
        this.props.AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        return (
            <input className="form-minwidth" type="text" placeholder="Please describe the desired correction(s)..."
                value="" onChange={this.handleChange} />
        );
    }
}

export default DelphiOtherCorrectionInput;
