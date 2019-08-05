import React, { Component } from 'react';
import DelphiLinkSetState from './LinkSetState'
import * as DC from './Constants';

export default class DelphiWelcome extends Component {
    //constructor(props) {
    //    super(props);
    //}
    
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
    <h3>Instructions</h3>
    <h4>IMPORTANT: <font color="red"><u>Please do <i>not</i> use your
        Browser's Back / history buttons to navigate!!</u></font></h4>
    <p className="delphi-general-text-paragraph">
        For each <font color="red"><b>Diagnosis (name)</b></font>, you
        can choose to accept the current configuration by checking the
        box in the <font color="red"><b>Correct?</b></font> column. This
        configuration includes the potential synonyms and modifiers
        (i.e. a list of terms from which one can be optionally chosen to
        further clarify a diagnosis).
    </p>
    <p className="delphi-general-text-paragraph">
        If you <b>do not</b> agree with our initial suggestion for a
        diagnosis configuration, you can use an initial dropdown to
        select among several possible corrections. If you...
    </p>
    <ul>
        <li>generally agree with the term, but believe we made a spelling
            mistake, please select
            <font color="red"><b> {DC.CORRECTION_SPELLING_TXT}</b></font>
        </li>
        <li>believe that the name we chose doesn't correctly capture the
            diagnosis, please select
            <font color="red"><b> {DC.CORRECTION_NEWNAME_TXT}</b></font>
        </li>
        <li>
            would like to add one or several additional synonyms, please
            select
            <font color="red"><b> {DC.CORRECTION_NEWSYNS_TXT}</b></font>
        </li>
        <li>
            think this particular diagnosis ought to be combined with
            another one, please select
            <font color="red"><b> {DC.CORRECTION_COMBINE_TXT}</b></font>
        </li>
        <li>
            believe that a diagnosis needs to be assigned to a different
            category, you can select
            <font color="red"><b> {DC.CORRECTION_MOVECAT_TXT}</b></font>
        </li>
        <li>
            wish to change the modifiers, you can choose either
            <font color="red"><b> {DC.CORRECTION_NEWMODS_TXT}</b></font>,
            <font color="red"><b> {DC.CORRECTION_DELMODS_TXT}</b></font>, or
            <font color="red"><b> {DC.CORRECTION_EDITMODS_TXT}</b></font>
        </li>
        <li>
            think that a diagnosis should not be included in the taxonomy
            catologue, select
            <font color="red"><b> {DC.CORRECTION_DELETE_TXT}</b></font>
        </li>
        <li>
            wish to suggest any other kind of correction, please choose
            <font color="red"><b> {DC.CORRECTION_OTHER_TXT}</b></font>,
            and then let us know
        </li>
    </ul>
    <h3>Getting started</h3>
    <p className="delphi-general-text-paragraph">
        If you would like to get an overview of our proposed taxonomy, please
        take a moment to look
        over <DelphiLinkSetState AppObj={this.props.AppObj}
            stateProp="currentCBlockId" stateValue={DC.BLOCKS_ALL}
            linkText="the list of categories and diagnoses" />.
        Or if you want to get started right away, simply head over to 
        to <DelphiLinkSetState AppObj={this.props.AppObj}
            stateProp="currentCBlockId" stateValue={DC.BLOCKS_FIRST}
            linkText='the first block' />.
    </p>
</div></td><td width="50%"></td></tr></tbody></table>
        );
    }
}
