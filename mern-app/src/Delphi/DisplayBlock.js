import React, { Component } from 'react';
import DelphiSelectCategory from './SelectCategory'
import DelphiGoBack from './GoBack';
import DelphiDisplayRow from './DisplayRow.js';
import { CATEGORY_FIRST, TABLE_CATEGORY, TABLE_NO_DIAGNOSES } from './Constants'

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
        var CatId = parseInt(this.props.CatId);
        const BCatCNodeIds = Object.keys(global.DM_LEVELCNODES)
            .filter(CNodeId => Math.floor(global.DM_LEVELCNODES[CNodeId].id / 10000) === CatId);

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
            <td colSpan="2">{categoryLabel(CatId)}</td>
            <td className="delphi-controls-paragraph" align="right">
                {CatId === CATEGORY_FIRST ?
                    <table><tbody><tr>
                        <td><DelphiSelectCategory AppObj={this.props.AppObj} /></td>
                        <td><DelphiGoBack AppObj={this.props.AppObj} /></td>
                    </tr></tbody></table>
                    : ''}
            </td>
        </tr>
        {BCatCNodeIds.map(CNodeId => 
            <DelphiDisplayRow key={CNodeId} AppObj={this.props.AppObj}
                CBlockId={Math.floor(CNodeId / 100)} CNodeId={CNodeId} />)}
    </tbody>

        )
    }
}
