import React, { Component } from 'react';

class DelphiSelectCategory extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        var nextCBlockId = event.target.value;
        this.props.AppObj.setState({currentCBlockId: nextCBlockId});
        const { history } = this.props;
        history.push('/block/' + nextCBlockId.toString());
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        return (
            <select onChange={this.handleChange} value={this.props.CBlockId}>
                {Object.keys(global.DM_LEVELCBLOCKS).map(blockId => 
                 <option value={blockId} key={blockId}>{global.DM_LEVELCBLOCKID2NAMES[blockId]}</option>)}
            </select>
        );
    }
}

export default DelphiSelectCategory;
