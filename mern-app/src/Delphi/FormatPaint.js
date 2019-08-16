import React, { Component } from 'react';
import { IMG_FORMATPAINT, IMG_FORMATPAINT_ALT, IMG_FORMATPAINT_SIZE,
    CORRECTION_NEWMODS, CORRECTION_MOVECAT, CORRECTION_OTHER } from './Constants'

export default class DelphiFormatPaint extends Component {
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
        var blockCorr = thisBlock[CNodeId].correction;
        if ((blockCorr !== CORRECTION_NEWMODS) &&
            (blockCorr !== CORRECTION_MOVECAT) &&
            (blockCorr !== CORRECTION_OTHER)) {
            return;
        }
        var prop;
        if (blockCorr === CORRECTION_NEWMODS) {
            prop = 'corrnewmods';
        } else {
            if (blockCorr === CORRECTION_MOVECAT) {
                prop = 'corrmoveto';
            } else {
                prop = 'corrother';
            }
        }
        var value = thisBlock[CNodeId][prop];
        const blockKeys = Object.keys(thisBlock);
        for (var nc = 0; nc < blockKeys.length; nc++) {
            if (blockKeys[nc] === 'locked') {
                continue;
            }
            if (!!thisBlock[blockKeys[nc]].correct) {
                continue;
            }
            thisBlock[blockKeys[nc]].correction = blockCorr;
            thisBlock[blockKeys[nc]][prop] = value;
        }
        newBlocks[currentCBlockId] = thisBlock;
        const newState = { blocks: newBlocks };
        AppObj.setState(newState);
    }

    render() {
        return (
            <button className="delphi-button-as-link"
                    onClick={this.handleClick}>
                <img src={process.env.PUBLIC_URL + IMG_FORMATPAINT}
                    alt={IMG_FORMATPAINT_ALT}
                    width={IMG_FORMATPAINT_SIZE}
                    height={IMG_FORMATPAINT_SIZE} />
            </button>
        );
    }
}
