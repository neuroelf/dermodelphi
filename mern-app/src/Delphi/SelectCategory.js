import React, { Component } from 'react';
import { BLOCKS_ALL, BLOCKS_ALL_TXT } from './Constants'

export default class DelphiSelectCategory extends Component {
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
                <option value={BLOCKS_ALL} key={BLOCKS_ALL}>{BLOCKS_ALL_TXT}</option>
                {Object.keys(global.DM_LEVELCBLOCKS).map(blockId => 
                    <option value={blockId} key={blockId}>{global.DM_LEVELCBLOCKID2NAMES[blockId]}</option>)}
            </select>
        );
    }
}
