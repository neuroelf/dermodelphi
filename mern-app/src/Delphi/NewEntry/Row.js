import React, { Component } from 'react';
import DelphiNewEntryCreate from './Create';
import DelphiNewEntryName from './Name';
import DelphiNewEntryCategory from './Category';
import DelphiNewEntryConfirm from './Confirm';
import { NEWENTRY_PLACEIN } from '../Constants'

export default class DelphiNewEntryRow extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {
        const { currentCBlockId, newEntry } = { ...this.props.AppObj.state};
        return (

<tr className="delphi-form-row">
    <td width="24"></td>
    <td className="delphi-form-name-cell">
        { (newEntry.pressed !== currentCBlockId) ?
            <DelphiNewEntryCreate AppObj={this.props.AppObj} /> :
            <DelphiNewEntryName AppObj={this.props.AppObj} />
        }
    </td>
    <td align="center">{
        ((newEntry.pressed === currentCBlockId) && (newEntry.name === '')) ?
            <font color="#737373">{NEWENTRY_PLACEIN}</font>
        : (newEntry.pressed === currentCBlockId) ?
            NEWENTRY_PLACEIN
        : ''
    }</td>
    <td><table><tbody><tr>
        <td>
            { (newEntry.pressed === currentCBlockId) ?
                <DelphiNewEntryCategory AppObj={this.props.AppObj} /> : ''
            }
        </td>
        <td>
            { (newEntry.pressed === currentCBlockId) ?
                <DelphiNewEntryConfirm AppObj={this.props.AppObj} /> : ''
            }
        </td>
    </tr></tbody></table></td>
</tr>

        );
    }
}
