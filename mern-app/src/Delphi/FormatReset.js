import React, { Component } from 'react';
import { IMG_FORMATRESET, IMG_FORMATRESET_ALT, IMG_FORMATRESET_SIZE,
    CORRECTION_NONE } from './Constants'

export default class DelphiFormatReset extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    
    handleClick(event) {
        event.preventDefault();
        const { AppObj, CNodeId } = { ...this.props};
        const { currentCBlockId, blocks } = { ...AppObj.state};
        if (!(currentCBlockId in blocks)) {
            return;
        }
        var newBlocks = Object.assign({}, blocks);
        var thisBlock = newBlocks[currentCBlockId];
        if (thisBlock['locked']) {
            return;
        }
        if (!(CNodeId in thisBlock)) {
            return;
        }
        if ((!!thisBlock[CNodeId].correct) ||
            (thisBlock[CNodeId].correction === CORRECTION_NONE)) {
            return;
        }
        var byUser = thisBlock[CNodeId]['byuser'];
        thisBlock[CNodeId] = {
            correct: false,
            correction: CORRECTION_NONE,
            corrcombine: 0,
            correditmods: '',
            correditsyns: '',
            corrmoveto: 0,
            corrnewmods: '',
            corrnewname: '',
            corrnewsyns: '',
            corrother: '',
            corrspelling: '',
            byuser: byUser
        }
        newBlocks[currentCBlockId] = thisBlock;
        const newState = { blocks: newBlocks };
        AppObj.setState(newState);
    }

    render() {
        return (
            <button className="delphi-button-as-link"
                    onClick={this.handleClick}>
                <img src={process.env.PUBLIC_URL + IMG_FORMATRESET}
                    alt={IMG_FORMATRESET_ALT}
                    width={IMG_FORMATRESET_SIZE}
                    height={IMG_FORMATRESET_SIZE} />
            </button>
        );
    }
}
