import React, { Component } from 'react';
import DelphiDisplayBlock from './DelphiDisplayBlock.js';

export default class DelphiAllBlocks extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {
        return (
<table className="form-table" width="100%">
    {Object.keys(global.DM_LEVELBFULLNAMES).map(BCatId => <DelphiDisplayBlock AppObj={this.props.AppObj} BCatId={BCatId} />)}
</table>
        );
    }
}
