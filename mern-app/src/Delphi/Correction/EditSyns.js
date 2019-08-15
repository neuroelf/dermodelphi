import React, { Component } from 'react';
import { CORRECTION_EDITSYNS_EMPTY } from '../Constants'

export default class DelphiCorrectionEditSyns extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentWillMount() {
        const { AppObj, CBlockId, CNodeId } = { ...this.props};
        const { blocks } = { ...AppObj.state};
        if (blocks[CBlockId][CNodeId].correditsyns === '') {
            var newState = blocks;
            const synonyms = global.DM_LEVELCNODES[CNodeId].synonyms;
            var synonymsText = '';
            if (synonyms.length > 0) {
                synonymsText = synonyms.join(';');
            }
            newState[CBlockId][CNodeId].correditsyns = synonymsText;
            AppObj.setState({ 'blocks': newState });
        }
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        newState[this.props.CBlockId][this.props.CNodeId].correditsyns = event.target.value;
        this.props.AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        const blockLocked = blockState.locked;
        const rowState = blockState[this.props.CNodeId];
        return (
            <input className="delphi-form-minwidth" disabled={!!blockLocked}
                type="text" placeholder={CORRECTION_EDITSYNS_EMPTY}
                value={rowState.correditsyns} onChange={this.handleChange} />
        );
    }
}
