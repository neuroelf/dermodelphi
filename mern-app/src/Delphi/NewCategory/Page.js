import React, { Component } from 'react';
import DelphiLinkSetState from '../LinkSetState';
import DelphiNewCategoryASelect from './ASelect';
import DelphiNewCategoryAName from './AName';
import DelphiNewCategoryBName from './BName';
import DelphiNewCategoryConfirm from './Confirm';
import DelphiNewCategoryCancel from './Cancel';
import * as DC from '../Constants'

export default class DelphiNewCategoryPage extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {
        const { newCategory, nextAId } = { ...this.props.AppObj.state};
        return (

<table className="delphi-form-table" width="100%"><tbody><tr className="delphi-form-row">
    <td width="24"></td>
    <td className="delphi-form-name-cell" colSpan="3"><table><tbody>
        <tr className="delphi-form-header-row">
            <td className="delphi-form-header-cell">{DC.TABLE_HEADER_NEWSUPERCAT}</td>
            <td className="delphi-form-header-cell" width="480">
                {DC.TABLE_HEADER_NEWCAT}
                 - <DelphiLinkSetState AppObj={this.props.AppObj}
                    stateProp="currentCBlockId" stateValue={DC.BLOCKS_ALL}
                    linkText="compare with full list" />
            </td>
            <td></td>
        </tr>

        <tr>
            <td>
                { ( newCategory.acat < nextAId) ?
                    <DelphiNewCategoryASelect AppObj={this.props.AppObj} /> :
                    <DelphiNewCategoryAName AppObj={this.props.AppObj} />
                }
            </td>
            <td>
                <DelphiNewCategoryBName AppObj={this.props.AppObj} />
            </td>
            <td><table><tbody><tr><td>
                <DelphiNewCategoryConfirm AppObj={this.props.AppObj} />
            </td>
            <td width="8"></td>
            <td>
                <DelphiNewCategoryCancel AppObj={this.props.AppObj} />
            </td></tr></tbody></table></td>
        </tr>
    </tbody></table></td>
</tr></tbody></table>

        );
    }
}
