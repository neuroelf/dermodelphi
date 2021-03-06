import React, { Component } from 'react'
import DelphiAllBlocks from './AllBlocks'
import DelphiLinkSetState from './LinkSetState'
import DelphiSelectCategory from './SelectCategory'
import DelphiControlRow from './ControlRow'
import DelphiNewEntryRow from './NewEntry/Row'
import DelphiMarkBlockCorrect from './MarkBlockCorrect'
import DelphiSearch from './Search'
import DelphiUnlockBlock from './UnlockBlock'
import DelphiNextBlock from './NextBlock'
import DelphiGoBack from './GoBack'
import DiagnosisDone from './func/DiagnosisDone';
import * as DC from './Constants'

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
        this.props.AppObj.setState({ blocks: currentState });
    }

    render() {

        // special case for all blocks
        const { AppObj } = { ...this.props};
        var CBlockId = AppObj.state.currentCBlockId;
        if (CBlockId === DC.BLOCKS_ALL) {
            return (
                <DelphiAllBlocks AppObj={AppObj} />
            );
        }

        // needed elements
        var blockState = AppObj.state.blocks[CBlockId];
        const LockOpenImage = <img src={process.env.PUBLIC_URL + DC.IMG_LOCK_UNLOCKED}
            width={DC.IMG_LOCK_SIZE} height={DC.IMG_LOCK_SIZE} alt={DC.IMG_LOCK_UNLOCKED_ALT} />;
        const LockClosedImage = <img src={process.env.PUBLIC_URL + DC.IMG_LOCK_LOCKED}
            width={DC.IMG_LOCK_SIZE} height={DC.IMG_LOCK_SIZE} alt={DC.IMG_LOCK_LOCKED_ALT} />;
        
        // iterating over all nodes (rows)
        var CNodes = Object.keys(blockState);
        var numCNodes = CNodes.length;
        var cc;
        var disabled = false;
        for (cc = 0; cc < numCNodes; cc++) {

            // skipping the "locked" entry, as well as hidden/locked nodes
            if (CNodes[cc] === 'locked') { continue; }
            if (global.DM_LEVELCNODES[CNodes[cc]].status !== 'visible') { continue; }

            // if a control is not marked as correct and no selection made
            if (!DiagnosisDone(blockState[CNodes[cc]])) {
                disabled = true;
                break;
            }
        }
        var controlClass;
        if (disabled) {
            controlClass = 'delphi-form-incomplete-control-cell';
        } else {
            controlClass = 'delphi-form-control-cell';
        }
        var saveClass;
        if (AppObj.state.isSaving) {
            saveClass = 'delphi-form-incomplete-control-cell';
        } else {
            saveClass = 'delphi-form-control-cell';
        }
        
        return (

<table className="delphi-form-table" width="100%">
    <tbody>
        <tr className="delphi-control-bar">
            <td></td>
            <td>
                <CurrentCategoryLabel CBlockId={CBlockId} />
            </td>
            <td align="center">
                <font style={{fontSize: "12px"}}><DelphiLinkSetState AppObj={this.props.AppObj}
                    stateProp="currentCBlockId" stateValue={DC.BLOCKS_ADDCAT}
                    linkText={DC.TABLE_CATEGORY_ADD} /></font>
            </td>
            <td className="delphi-controls-paragraph" align="right">
                <DelphiSelectCategory AppObj={this.props.AppObj} />
            </td>
        </tr>

        <tr className="delphi-form-header-row">
            <td></td>
            <td><table><tbody><tr>
                <td className="delphi-form-header-cell">{DC.TABLE_HEADER_DIAGNOSIS}</td>
                <td><DelphiSearch AppObj={this.props.AppObj} CBlockId={CBlockId} /></td>
            </tr></tbody></table></td>
            <td className="delphi-form-header-cell" align="center">{DC.TABLE_HEADER_CORRECT}</td>
            <td className="delphi-form-header-cell">{DC.TABLE_HEADER_CORRECTION}</td>
        </tr>

        {global.DM_LEVELCBLOCKS[CBlockId].map(CNodeId =>
            (global.DM_LEVELCNODES[CNodeId].status === 'hidden') ? null :
            <DelphiControlRow key={CNodeId} AppObj={this.props.AppObj}
                CBlockId={CBlockId} CNodeId={CNodeId} /> )
        }

        <DelphiNewEntryRow AppObj={this.props.AppObj} />

        <tr className="delphi-form-header-row">
            <td className="delphi-form-control-cell" colSpan="3"><table><tbody><tr>
                <td className="delphi-form-control-cell">
                    <DelphiMarkBlockCorrect AppObj={this.props.AppObj}
                        CBlockId={CBlockId} />
                </td>
            </tr></tbody></table></td>
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
                <td className={saveClass}>
                    <p className="delphi-controls-paragraph">
                        <DelphiNextBlock AppObj={this.props.AppObj}
                            CBlockId={CBlockId} continue="no" />
                    </p>
                </td>
                <td className={controlClass}>
                    <p className="delphi-controls-paragraph">
                        <DelphiNextBlock AppObj={this.props.AppObj}
                            CBlockId={CBlockId} continue="yes" />
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
