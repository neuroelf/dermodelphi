import React, { Component } from 'react';

class DelphiUnlockBlockButton extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.unlockBlock = this.unlockBlock.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    
    unlockBlock(event) {
        const { blocks } = { ...this.props.AppObj.state };
        var currentCBlockId = parseInt(this.props.CBlockId);
        const newState = blocks;
        newState[currentCBlockId].locked = false;
        this.props.AppObj.setState({blocks: newState});
    }

    render() {
        return (
            <button onClick={this.unlockBlock}>Unlock block</button>
        );
    }
}

export default DelphiUnlockBlockButton;
