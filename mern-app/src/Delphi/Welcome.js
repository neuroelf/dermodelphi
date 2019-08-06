import React, { Component } from 'react';
import DelphiSessionEmail from './SessionEmail'
import DelphiSessionId from './SessionId'
import DelphiSessionBegin from './SessionBegin'
import * as DC from './Constants';

export default class DelphiWelcome extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
    }
    
    render() {
        return (
<table border="0"><tbody><tr><td width="50%"></td><td width="800"><div>
    <h2>Welcome to the {DC.TITLE_TXT_FULL}</h2>

    <p className="delphi-general-text-paragraph">
        Our mission is to help the dermatology community by creating an
        accepted standard for how diagnoses--especially those associated
        with dermoscopy images uploaded to
        the <a href={"https://isic-archive.com/"} target={"_blank"}>ISIC
        Archive</a>--are entered.
    </p>
    <p className="delphi-general-text-paragraph">
        As part of this survey, you will see a list of diagnoses (names)
        which are grouped within specific categories (and the present
        super-categories "Benign" and "Malignant"). Within several of
        the categories, we have further grouped diagnoses into logical
        blocks or clusters of names, which we believe will simplify the
        editing experience using this survey.
    </p>

    <h3>User and session information:</h3>

    <p className="delphi-general-text-paragraph">
        Please enter either your email address or the session identifier
        you received via email below:
    </p>

    <table><tbody><tr>
        <td><b>{DC.SESS_LABEL}</b></td>
        <td><DelphiSessionEmail AppObj={this.props.AppObj} /></td>
        <td><DelphiSessionId AppObj={this.props.AppObj} /></td>
        <td><DelphiSessionBegin AppObj={this.props.AppObj} /></td>
    </tr></tbody></table>
</div></td><td width="50%"></td></tr></tbody></table>
        );
    }
}
