import React, { Component } from 'react';
import DelphiAllBlocks from './DelphiAllBlocks';
import DelphiSelectCategory from './DelphiSelectCategory';
import DelphiControlRowC from './DelphiControlRowC.js';
import DelphiMarkBlockCorrectButton from './DelphiMarkBlockCorrectButton';
import DelphiUnlockBlockButton from './DelphiUnlockBlockButton'
import DelphiNextBlockButton from './DelphiNextBlockButton';

const CurrentCategoryLabel = props => (
    <p>Current Category: {global.DM_LEVELCBLOCKID2NAMES[props.CBlockId]}</p>
);

const CategoryHeaderRow = () => (
    <tr className="form-header-row">
        <td className="form-pad-cell"></td>
        <td className="form-header-cell">Diagnosis (name)</td>
        <td className="form-header-cell" align="center">Correct?</td>
        <td className="form-header-cell">Correction (configure as needed)</td>
    </tr>
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

        const { params } = this.props.match;
        var CBlockId = parseInt(params.CBlockId);
        var blockState = this.props.AppObj.state.blocks[CBlockId];
        const LockOpenImage = <img src={process.env.PUBLIC_URL + '/img/unlocked.png'} width="24" height="24" alt="Page unlocked" />;
        const LockClosedImage = <img src={process.env.PUBLIC_URL + '/img/locked.png'} width="24" height="24" alt="Page unlocked" />;

        // special case for all blocks
        if (CBlockId === 99) {
            return (
                <DelphiAllBlocks AppObj={this.props.AppObj} />
            );
        }

        return (

<table className="form-table" width="100%">
    <tbody>
        <tr className="control-bar">
            <td></td>
            <td colSpan="2">
                <CurrentCategoryLabel CBlockId={params.CBlockId} />
            </td>
            <td className="form-control-cell">
                <div className="form-row controls-paragraph" align="right">
                    <DelphiSelectCategory AppObj={this.props.AppObj} history={this.props.history} CBlockId={params.CBlockId} />
                </div>
            </td>
        </tr>

        <CategoryHeaderRow />

        {global.DM_LEVELCBLOCKS[params.CBlockId].map(CNodeId => 
            <DelphiControlRowC key={CNodeId} AppObj={this.props.AppObj}
                CBlockId={params.CBlockId} CNodeId={CNodeId} />)
        }

        <tr className="form-header-row">
            <td className="form-control-cell" colSpan="3">
                <p className="controls-paragraph">
                    <DelphiMarkBlockCorrectButton AppObj={this.props.AppObj}
                        CBlockId={params.CBlockId} />
                </p>
            </td>
            <td className="form-control-cell">
                <div align="right"><table><tbody><tr>
                    <td className="form-control-cell">
                        {blockState.locked ? LockClosedImage : LockOpenImage}
                    </td>
                    <td className="form-control-cell">
                        {blockState.locked ? 
                            <DelphiUnlockBlockButton AppObj={this.props.AppObj}
                                CBlockId={params.CBlockId} />
                            :
                            <font color="#737373"><i>This page is already unlocked</i></font>
                        }
                    </td>
                    <td className="form-control-cell">
                        <p className="controls-paragraph">
                            <DelphiNextBlockButton AppObj={this.props.AppObj}
                                CBlockId={params.CBlockId} history={this.props.history} />
                        </p>
                    </td>
                </tr></tbody></table></div>
            </td>
        </tr>
    </tbody>
</table>

        );
    }
}
