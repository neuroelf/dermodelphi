import React, { Component } from 'react';
import DelphiDisplayBlock from './DisplayBlock';

export default class DelphiAllBlocks extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {
        return (
<table className="delphi-form-table">
    {Object.keys(global.DM_LEVELBFULLNAMES).map(
        CatId => <DelphiDisplayBlock AppObj={this.props.AppObj} CatId={CatId} />)}
</table>
        );
    }
}
