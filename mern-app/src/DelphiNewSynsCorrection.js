import React, { Component } from 'react';

class DelphiNewSynsCorrection extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        newState[this.props.CBlockId][this.props.CNodeId].corrnewsyns = event.target.value;
        this.props.AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        const rowState = blockState[this.props.CNodeId];
        return (
            <input className="form-minwidth" type="text" placeholder="Please enter additional synonyms..."
                value={rowState.corrnewsyns} onChange={this.handleChange} />
        );
    }
}

export default DelphiNewSynsCorrection;
