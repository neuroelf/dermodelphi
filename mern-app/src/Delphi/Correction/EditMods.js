import React, { Component } from 'react';
import { CORRECTION_EDITMODS_EMPTY } from '../Constants'

export default class DelphiCorrectionEditMods extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const { AppObj, CBlockId, CNodeId } = { ...this.props};
        const { blocks } = { ...AppObj.state};
        if (blocks[CBlockId][CNodeId].correditmods === '') {
            var newState = blocks;
            const modifiers = global.DM_LEVELCNODES[CNodeId].modifiers;
            var modifiersText = '';
            if (modifiers.length === 1) {
                modifiersText = modifiers[0].join(';');
            }
            if (modifiers.length === 2) {
                modifiersText = modifiers[0].join(';') +
                    ';' + modifiers[1].join(';');
            }
            newState[CBlockId][CNodeId].correditmods = modifiersText;
            AppObj.setState({ 'blocks': newState });
        }
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        var newState = blocks;
        newState[this.props.CBlockId][this.props.CNodeId].correditmods = event.target.value;
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
                type="text" placeholder={CORRECTION_EDITMODS_EMPTY}
                value={rowState.correditmods} onChange={this.handleChange} />
        );
    }
}
