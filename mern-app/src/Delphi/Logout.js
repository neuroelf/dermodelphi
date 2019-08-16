import React, { Component } from 'react'
import { BLOCK_LOGOUT, BLOCKS_LOGOUT } from './Constants'

export default class DelphiLogout extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.logOut = this.logOut.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    
    logOut(event) {
        event.preventDefault();
        const { AppObj } = { ...this.props};
        var currentCBlockId = AppObj.state.currentCBlockId;
        if (currentCBlockId > 100) {
            AppObj.saveSession();
            AppObj.saveSessionBlock(null, currentCBlockId);
        }
        AppObj.setState({
            sessionOk: false,
            tokenId: '',
            tokenValid: false,
            currentCBlockId: BLOCKS_LOGOUT,
            historyCBlockId: []
        });
    }
 
    // this component contains the (rendering) logic as to whether
    // or not a user can continue with the next block
    render() {
        const sessionOk = this.props.AppObj.state.sessionOk;

        return (
            <button onClick={this.logOut} disabled={!sessionOk}>{BLOCK_LOGOUT}</button>
        );
    }
}
