import React, { Component } from 'react';
import DelphiLinkSetState from './LinkSetState'
import * as DC from './Constants';

export default class DelphiInstructions extends Component {
    //constructor(props) {
    //    super(props);
    //}
    
    render() {
        const { historyCBlockId } = { ...this.props.AppObj.state};
        return (
<table border="0"><tbody><tr><td width="50%"></td><td width="800"><div>
    <h2>Instructions</h2>
    <h4><font color="#064785"><u>Please do <i>not</i> use your
        Browser's Back / history buttons to navigate</u><br />
        <small>This survey was optimized for use on a desktop computer,
        and requires a persistent network connection</small></font></h4>
    <p className="delphi-general-text-paragraph">
        For each <font color="red"><b>{DC.TITLE_TXT_DIAG} ({DC.TITLE_TXT_MINI})</b></font>,
        you can simply choose to accept the current term and configuration
        by checking the box in the "<font color="red"><b>Correct?</b></font>"
        column.
    </p>
    <p className="delphi-general-text-paragraph">
        Some of the {DC.TITLE_TXT_MINI} terms are supplemented by:
        </p>
    <ul>
        <li>Synonymous names: additional commonly used names (e.g.,
            eponyms) that imply the same diagnosis</li>
        <li>
            Modifiers: descriptors that may add useful information about
            the diagnosis</li>
    </ul>
    <p className="delphi-general-text-paragraph">
        If you <b>do not</b> agree with the suggested
        {" " + DC.TITLE_TXT_MINI} term, its synonyms or modifiers, you can
        use the dropdown menu to select among several possible corrections:
    </p>
    <ul>
        <li><font color="red"><b>{DC.CORRECTION_NEWNAME_TXT}</b></font>:
            if the current name doesn't correctly / optimally capture the diagnosis
        </li>
        <li><font color="red"><b>{DC.CORRECTION_SPELLING_TXT}</b></font>:
            if you agree with the term, but not with the spelling we used
        </li>
        <li><font color="red"><b>{DC.CORRECTION_COMBINE_TXT}</b></font>:
            if this particular diagnosis is redundant and should to be
            combined with another one
        </li>
        <li><font color="red"><b>{DC.CORRECTION_MOVECAT_TXT}</b></font>:
            if the diagnosis ought to be assigned under a different category
            (e.g. it belongs to a different category of proliferation)
        </li>
        <li><font color="red"><b>{DC.CORRECTION_EDITSYNS_TXT}</b></font>,
            <font color="red"><b> {DC.CORRECTION_NEWSYNS_TXT}</b></font>, or
            <font color="red"><b> {DC.CORRECTION_DELSYNS_TXT}</b></font>:
            if you wish to change the synonyms of
            the {DC.TITLE_TXT_MINI} term
        </li>
        <li><font color="red"><b>{DC.CORRECTION_EDITMODS_TXT}</b></font>,
            <font color="red"><b> {DC.CORRECTION_NEWMODS_TXT}</b></font>, or
            <font color="red"><b> {DC.CORRECTION_DELMODS_TXT}</b></font>:
            if you wish to change the modifiers of
            the {DC.TITLE_TXT_MINI} term
        </li>
        <li><font color="red"><b> {DC.CORRECTION_DELBOTH_TXT}</b></font>:
            if there are modifiers and synonyms, and you wish to delete both
        </li>
        <li><font color="red"><b>{DC.CORRECTION_DELETE_TXT}</b></font>:
            the {DC.TITLE_TXT_MINI} term should not be included in the
            taxonomy catalogue
        </li>
        <li><font color="red"><b>{DC.CORRECTION_OTHER_TXT}</b></font>:
            if you wish to suggest any other kind of correction - please
            let us know the details of your suggestion
        </li>
    </ul>
    <h3>Getting started</h3>
    <p className="delphi-general-text-paragraph">
        If you would like to get an overview of our proposed taxonomy, please
        take a moment to look
        over <DelphiLinkSetState AppObj={this.props.AppObj}
            stateProp="currentCBlockId" stateValue={DC.BLOCKS_ALL}
            linkText={"the list of categories, " + DC.TITLE_TXT_MINI +
                " terms, their synonyms and modifiers"} />.
    </p>
    { (historyCBlockId.length === 0) ?
        <p className="delphi-general-text-paragraph">
            Or if you want to get started right away, simply go 
            to <DelphiLinkSetState AppObj={this.props.AppObj}
                stateProp="currentCBlockId" stateValue={DC.BLOCKS_FIRST}
                linkText="the first block of terms" />.
        </p>
    :
        <p className="delphi-general-text-paragraph">
        Or if you want to continue, simply go 
        to <DelphiLinkSetState AppObj={this.props.AppObj}
            stateProp="currentCBlockId" stateValue={historyCBlockId[historyCBlockId.length-1]}
            linkText="where you left things off" />.
        </p>
    }
</div></td><td width="50%"></td></tr></tbody></table>
        );
    }
}
