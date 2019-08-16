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
    <h2>Welcome to the {DC.TITLE_TXT_FULL} ({DC.TITLE_TXT_MINI})</h2>

    <p className="delphi-general-text-paragraph">
        Our aim is to label each of
        the <a href={"https://isic-archive.com/"} target={"_blank"}>ISIC
        Archive</a> images with the <b>{DC.TITLE_TXT_DIAG + " "}
        ({DC.TITLE_TXT_MINI})</b> that most <u>accurately and
        reproducibly</u> represents the histopathological diagnosis.
    </p>
    <p className="delphi-general-text-paragraph">
        We all know that at present, the same lesion may be given variable
        names, depending on the clinician or pathologist diagnosing the
        lesion. However, for the ISIC Archive to be a useful database, we
        need to converge on agreed-upon diagnostic labels (i.e., a unique
        {" " + DC.TITLE_TXT_MINI}) for each type of lesion.
    </p>
    <p className="delphi-general-text-paragraph">
        We need your help to reach an agreement on
        the {DC.TITLE_TXT_MINI} working list!
    </p>
    <p className="delphi-general-text-paragraph">
        Our overarching hope is that in generating this consensus list of
        diagnoses, we can contribute to the greater dermatology
        community – by creating accepted diagnostic standards.
    </p>
    <p className="delphi-general-text-paragraph">
        As part of this survey, you will see a list of {DC.TITLE_TXT_MINI + " "}
        terms, which are grouped under categories (e.g., type of
        proliferation) and under super-categories (e.g., "Benign" and
        "Malignant"). The {DC.TITLE_TXT_MINI} terms will be presented as
        blocks / clusters to simplify viewing and editing of the terms.
    </p>

    <h3>User and session information:</h3>

    <p className="delphi-general-text-paragraph">
        Please enter below your email address <b>AND</b> the session
        identifier (sent to you via email):
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
