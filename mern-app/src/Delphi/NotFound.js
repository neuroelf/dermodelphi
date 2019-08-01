import React, { Component } from 'react';
import DelphiLinkSetState from './LinkSetState';
import { BLOCKS_FIRST } from './Constants'

export default class DelphiNotFound extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {
        return (
<div>
    <h2>This page/component wasn't found.</h2>
    <br />
    { (this.props.ErrTxt + "" !== "") ? this.props.ErrTxt : "" }
    <br />
    <DelphiLinkSetState AppObj={this.props.AppObj}
        stateProp="currentCBlockId" stateValue={BLOCKS_FIRST}
        linkText="Please return to the first block." />
</div>
        );
    }
}
