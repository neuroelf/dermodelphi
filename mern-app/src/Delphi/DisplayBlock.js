import React, { Component } from 'react';
import DelphiDisplayRow from './DisplayRow.js';
import { TABLE_CATEGORY, TABLE_NO_DIAGNOSES } from './Constants'

function categoryLabel(CatId) {
    return <p>{TABLE_CATEGORY} {global.DM_LEVELBFULLNAMES[CatId]}</p>
};

export default class DelphiDisplayBlock extends Component {

    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        // get all nodes in that category
        const BCatCNodeIds = Object.keys(global.DM_LEVELCNODES).filter(CNodeId => Math.floor(global.DM_LEVELCNODES[CNodeId].blockid / 100) === parseInt(this.props.CatId));

        // handle 0 elements
        if (BCatCNodeIds.length === 0) {
            return (
    <tbody><tr className="delphi-control-bar">
            <td></td>
            <td colSpan="3"><b>{TABLE_NO_DIAGNOSES}</b></td>
    </tr></tbody>
            );
        }

        // otherwise
        return (

    <tbody>
        <tr className="delphi-control-bar">
            <td></td>
            <td colSpan="3">{categoryLabel(parseInt(this.props.CatId))}</td>
        </tr>
        {BCatCNodeIds.map(CNodeId => 
            <DelphiDisplayRow key={CNodeId} AppObj={this.props.AppObj}
                CBlockId={Math.floor(CNodeId / 100)} CNodeId={CNodeId} />)}
    </tbody>

        )
    }
}
