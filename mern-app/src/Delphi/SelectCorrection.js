import React, { Component } from 'react';
import * as DC from './Constants.js'

export default class DelphiSelectCorrection extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const { blocks } = { ...this.props.AppObj.state };
        const newState = blocks;
        newState[this.props.CBlockId][this.props.CNodeId].correction = event.target.value;
        this.props.AppObj.setState({blocks: newState});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        const blockState = this.props.AppObj.state.blocks[this.props.CBlockId];
        var blockLocked = blockState.locked;
        const rowState = blockState[this.props.CNodeId];
        const CNode = global.DM_LEVELCNODES[this.props.CNodeId];
        const smallFont = {'backgroundColor': '#dddddd', 'fontSize': '8px'}
        return (

<select value={rowState.correction} onChange={this.handleChange} disabled={blockLocked || !!rowState.correct}>
    { (rowState.correction === DC.CORRECTION_NONE) ?
        <option value={DC.CORRECTION_NONE} key={0}>{DC.CORRECTION_NONE_TXT}</option>
        :
        <option style={{'color': 'red', 'fontWeight': 'bold'}}
            value={DC.CORRECTION_NONE} key={0}>{DC.CORRECTION_NONE_ALT}</option>
    }
    <option style={smallFont} value={DC.CORRECTION_FILL1} key={10} disabled>{DC.CORRECTION_FILLING_TXT}</option>
    <option value={DC.CORRECTION_NEWNAME} key={11}>{DC.CORRECTION_NEWNAME_TXT}</option>
    <option value={DC.CORRECTION_SPELLING} key={12}>{DC.CORRECTION_SPELLING_TXT}</option>
    <option style={smallFont} value={DC.CORRECTION_FILL2} key={20} disabled>{DC.CORRECTION_FILLING_TXT}</option>
    <option value={DC.CORRECTION_COMBINE} key={21}>{DC.CORRECTION_COMBINE_TXT}</option>
    <option value={DC.CORRECTION_MOVECAT} key={22}>{DC.CORRECTION_MOVECAT_TXT}</option>
    <option style={smallFont} value={DC.CORRECTION_FILL3} key={30} disabled>{DC.CORRECTION_FILLING_TXT}</option>
    { CNode.synonyms.length === 0 ?
        <option value={DC.CORRECTION_EDITSYNS} key={31} disabled>{DC.CORRECTION_EDITSYNS_TXT}</option>
        :
        <option value={DC.CORRECTION_EDITSYNS} key={31}>{DC.CORRECTION_EDITSYNS_TXT}</option>
    }
    <option value={DC.CORRECTION_NEWSYNS} key={32}>{DC.CORRECTION_NEWSYNS_TXT}</option>
    { CNode.modifiers.length === 0 ?
        <option value={DC.CORRECTION_EDITMODS} key={41} disabled>{DC.CORRECTION_EDITMODS_TXT}</option>
        :
        <option value={DC.CORRECTION_EDITMODS} key={41}>{DC.CORRECTION_EDITMODS_TXT}</option>
    }
    <option value={DC.CORRECTION_NEWMODS} key={42}>{DC.CORRECTION_NEWMODS_TXT}</option>
    <option style={smallFont} value={DC.CORRECTION_FILL5} key={50} disabled>{DC.CORRECTION_FILLING_TXT}</option>
    <option value={DC.CORRECTION_DELETE} key={80}>{DC.CORRECTION_DELETE_TXT}</option>
    { CNode.synonyms.length === 0 ?
        <option value={DC.CORRECTION_DELSYNS} key={81} disabled>{DC.CORRECTION_DELSYNS_TXT}</option>
        :
        <option value={DC.CORRECTION_DELSYNS} key={81}>{DC.CORRECTION_DELSYNS_TXT}</option>
    }
    { CNode.modifiers.length === 0 ?
        <option value={DC.CORRECTION_DELMODS} key={82} disabled>{DC.CORRECTION_DELMODS_TXT}</option>
        :
        <option value={DC.CORRECTION_DELMODS} key={82}>{DC.CORRECTION_DELMODS_TXT}</option>
    }
    { ((CNode.modifiers.length === 0) || (CNode.synonyms.length === 0)) ?
        <option value={DC.CORRECTION_DELBOTH} key={83} disabled>{DC.CORRECTION_DELBOTH_TXT}</option>
        :
        <option value={DC.CORRECTION_DELBOTH} key={83}>{DC.CORRECTION_DELBOTH_TXT}</option>
    }
    <option style={smallFont} value={DC.CORRECTION_FILL9} key={90} disabled>{DC.CORRECTION_FILLING_TXT}</option>
    <option value={DC.CORRECTION_OTHER} key={91}>{DC.CORRECTION_OTHER_TXT}</option>
</select>

        );
    }
}
