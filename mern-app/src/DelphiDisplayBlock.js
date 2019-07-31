import React, { Component } from 'react';
import DelphiDisplayRowC from './DelphiDisplayRowC.js';

function categoryLabel(BCatId) {
    return <p>Category: {global.DM_LEVELBFULLNAMES[BCatId]}</p>
};

export default class DelphiDisplayBlock extends Component {

    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {

        // get all nodes in that category
        const BCatCNodeIds = Object.keys(global.DM_LEVELCNODES).filter(CNodeId => Math.floor(global.DM_LEVELCNODES[CNodeId].blockid / 100) === parseInt(this.props.BCatId));

        // handle 0 elements
        if (BCatCNodeIds.length === 0) {
            return (
    <tbody>
        <tr className="control-bar">
            <td></td>
            <td colSpan="3">
                <b>No nodes in this category.</b>
            </td>
        </tr>
    </tbody>
            );
        }

        // otherwise
        return (

    <tbody>
        <tr className="control-bar">
            <td></td>
            <td colSpan="3">
                {categoryLabel(parseInt(this.props.BCatId))}
            </td>
        </tr>

        {BCatCNodeIds.map(CNodeId => 
            <DelphiDisplayRowC key={CNodeId} AppObj={this.props.AppObj}
                CBlockId={Math.floor(CNodeId / 100)} CNodeId={CNodeId} />)
        }

    </tbody>

        )
    }
}
