import React, { Component } from 'react';
import DelphiAllBlocks from './AllBlocks';
import DelphiSelectCategory from './SelectCategory';
import DelphiControlRow from './ControlRow';
import DelphiNewEntryRow from './NewEntry/Row';
import DelphiMarkBlockCorrect from './MarkBlockCorrect';
import DelphiUnlockBlock from './UnlockBlock'
import DelphiNextBlock from './NextBlock';
import DelphiGoBack from './GoBack';
import * as DC from './Constants';

const CurrentCategoryLabel = props => (
    <p>{DC.TABLE_CURRENT_CATEGORY} {global.DM_LEVELCBLOCKID2NAMES[props.CBlockId]}</p>
);

export default class DelphiBlock extends Component {
    constructor(props) {
        super(props);
        this.state = { };
        this.markBlockControlsAsCorrect = this.markBlockControlsAsCorrect.bind(this);
    }
    
    markBlockControlsAsCorrect() {

        // get blocks from AppObj, and blockId from Router match
        const { blocks } = { ...this.props.AppObj.state };
        const currentState = blocks;
        var blockId = this.props.match.params.CBlockId;

        // start by setting all correct
        currentState[blockId].allcorrect = true;
        this.props.AppObj.setState(state => ({
            blocks: currentState
        }));
    }

    render() {

        var CBlockId = this.props.AppObj.state.currentCBlockId;
        var blockState = this.props.AppObj.state.blocks[CBlockId];
        const LockOpenImage = <img src={process.env.PUBLIC_URL + DC.IMG_LOCK_UNLOCKED}
            width={DC.IMG_LOCK_SIZE} height={DC.IMG_LOCK_SIZE} alt={DC.IMG_LOCK_UNLOCKED_ALT} />;
        const LockClosedImage = <img src={process.env.PUBLIC_URL + DC.IMG_LOCK_LOCKED}
            width={DC.IMG_LOCK_SIZE} height={DC.IMG_LOCK_SIZE} alt={DC.IMG_LOCK_LOCKED_ALT} />;

        // special case for all blocks
        if (CBlockId === DC.BLOCKS_ALL) {
            return (
                <DelphiAllBlocks AppObj={this.props.AppObj} />
            );
        }

        return (

<table className="delphi-form-table" width="100%">
    <tbody>
        <tr className="delphi-control-bar">
            <td></td>
            <td colSpan="2">
                <CurrentCategoryLabel CBlockId={CBlockId} />
            </td>
            <td className="delphi-controls-paragraph" align="right">
                <DelphiSelectCategory AppObj={this.props.AppObj} />
            </td>
        </tr>

        <tr className="delphi-form-header-row">
            <td></td>
            <td className="delphi-form-header-cell">{DC.TABLE_HEADER_DIAGNOSIS}</td>
            <td className="delphi-form-header-cell" align="center">{DC.TABLE_HEADER_CORRECT}</td>
            <td className="delphi-form-header-cell">{DC.TABLE_HEADER_CORRECTION}</td>
        </tr>

        {global.DM_LEVELCBLOCKS[CBlockId].map(CNodeId => 
            <DelphiControlRow key={CNodeId} AppObj={this.props.AppObj}
                CBlockId={CBlockId} CNodeId={CNodeId} />)
        }

        <DelphiNewEntryRow AppObj={this.props.AppObj} />

        <tr className="delphi-form-header-row">
            <td className="delphi-form-control-cell" colSpan="3">
                <p className="delphi-controls-paragraph">
                    <DelphiMarkBlockCorrect AppObj={this.props.AppObj}
                        CBlockId={CBlockId} />
                </p>
            </td>
            <td className="delphi-form-control-cell" align="right"><table><tbody><tr>
                <td className="delphi-form-control-cell">
                    {blockState.locked ? LockClosedImage : LockOpenImage}
                </td>
                <td className="delphi-form-control-cell">
                    {blockState.locked ? 
                        <DelphiUnlockBlock AppObj={this.props.AppObj}
                            CBlockId={CBlockId} />
                        :
                        <font color="#737373"><i>{DC.BLOCK_UNLOCKED}</i></font>
                    }
                </td>
                <td className="delphi-form-control-cell">
                    <p className="delphi-controls-paragraph">
                        <DelphiNextBlock AppObj={this.props.AppObj}
                            CBlockId={CBlockId} history={this.props.history} />
                    </p>
                </td>
                <td className="delphi-form-control-cell">
                    <p className="delphi-controls-paragraph">
                        <DelphiGoBack AppObj={this.props.AppObj} />
                    </p>
                </td></tr></tbody></table>
            </td>
        </tr>
    </tbody>
</table>

        );
    }
}