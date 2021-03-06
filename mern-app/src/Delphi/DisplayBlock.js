import React, { Component } from 'react';
import DelphiSelectCategory from './SelectCategory'
import DelphiGoBack from './GoBack';
import DelphiSubmit from './Submit';
import DelphiDisplayRow from './DisplayRow.js';
import { CATEGORY_FIRST, TABLE_NO_DIAGNOSES } from './Constants'

function categoryLabel(CatId) {
    return <span>{global.DM_LEVELBFULLNAMES[CatId]}</span>
};

export default class DelphiDisplayBlock extends Component {

    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        // get all nodes in that category
        var CatId = parseInt(this.props.CatId);
        var SuperCatId = Math.floor(CatId / 100);
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
        <tr className={
            (SuperCatId === 1) ? "delphi-control-bar-benign" :
            (SuperCatId === 2) ? "delphi-control-bar-malignant" : "delphi-control-bar"} height="48">
            <td></td>
            <td colSpan="2">{categoryLabel(CatId)}</td>
            <td className="delphi-controls-paragraph" align="right">
                {CatId === CATEGORY_FIRST ?
                    <table><tbody><tr>
                        <td><DelphiSelectCategory AppObj={this.props.AppObj} /></td>
                        <td><DelphiGoBack AppObj={this.props.AppObj} /></td>
                        <td><DelphiSubmit AppObj={this.props.AppObj} /></td>
                    </tr></tbody></table>
                    : ''}
            </td>
        </tr>
        {BCatCNodeIds.map(CNodeId => 
            <DelphiDisplayRow key={"node" + (CNodeId).toString()} AppObj={this.props.AppObj}
                CBlockId={Math.floor(CNodeId / 100)} CNodeId={CNodeId} />)}
    </tbody>

        )
    }
}
