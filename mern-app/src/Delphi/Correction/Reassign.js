import React, { Component } from 'react'
import { CORRECTION_MOVECAT_SELECT,
    CORRECTION_MOVECAT_OTHER, BLOCKS_ADDCAT } from '../Constants'

export default class DelphiCorrectionReassign extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        event.preventDefault();
        const { AppObj } = { ...this.props};
        const { blocks, currentCBlockId } = { ...AppObj.state };
        const newState = blocks;
        var corrmoveto = parseInt(event.target.value);
        if (corrmoveto === BLOCKS_ADDCAT) {
            const { historyCBlockId } = { ...AppObj.state};
            const newHistoryCBlockId = [ ...historyCBlockId];
            newHistoryCBlockId.push(currentCBlockId);
            var newHistState = {
                'currentCBlockId': BLOCKS_ADDCAT,
                'historyCBlockId': newHistoryCBlockId,
                'newCategoryGoBack': this.props.CNodeId,
            }
            AppObj.setState(newHistState);
            return;
        }
        newState[this.props.CBlockId][this.props.CNodeId].corrmoveto = corrmoveto;
        AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        const blockLocked = blockState.locked;
        var thisBNodeId = Math.floor(parseInt(this.props.CBlockId) / 100);
        const rowState = blockState[this.props.CNodeId];
        return (
            <select value={rowState.corrmoveto.toString()}
                disabled={!!blockLocked} onChange={this.handleChange}>
                <option value="0" key="0">{CORRECTION_MOVECAT_SELECT}</option>
                <option value={BLOCKS_ADDCAT} key={BLOCKS_ADDCAT}>{CORRECTION_MOVECAT_OTHER}</option>
                {Object.keys(global.DM_LEVELBFULLNAMES)
                    .filter(BNodeId => BNodeId !== thisBNodeId)
                    .map(BNodeId =>
                    <option value={BNodeId} key={BNodeId}>{global.DM_LEVELBFULLNAMES[BNodeId]}</option>)}
            </select>
        );
    }
}
