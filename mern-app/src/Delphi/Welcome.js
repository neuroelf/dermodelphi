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

    <p className="general-text-paragraph">
        Our mission is to help the dermatology community by creating an accepted
        standard for how diagnoses--especially those associated with dermoscopy
        images uploaded to
        the <a href={"https://isic-archive.com/"} target={"_blank"}>ISIC Archive</a>--are
        entered.
    </p>
    <p className="general-text-paragraph">
        Once you begin, you will see a list of diagnoses (names) which are grouped
        within specific categories (and the present super-categories "Benign" and
        "Malignant"). Within several of the categories, we have further grouped
        diagnoses into logical blocks of names (clusters) which we believe will
        simplify the editing experience.
    </p>
    <p className="general-text-paragraph">
        For each diagnosis name, you can choose to either accept the current
        configuration, which includes potential synonyms and modifiers (i.e.
        a list of terms from which one can be optionally chosen to further
        clarify a diagnosis). If you <b>do not</b> agree with our initial
        suggestion for a diagnosis, you can use a dropdown to configure several
        possible corrections. If you...
    </p>
    <ul>
        <li>generally agree with the term, but believe we made a spelling
            mistake, please select <b>{DC.CORRECTION_SPELLING_TXT}</b>
        </li>
        <li>believe that the name we chose doesn't correctly capture the
            diagnosis, please select <b>{DC.CORRECTION_NEWNAME_TXT}</b>
        </li>
        <li>
            would like to add one or several additional synonyms, please
            select <b>{DC.CORRECTION_NEWSYNS_TXT}</b>
        </li>
        <li>
            think this particular diagnosis ought to be combined with another
            one, please select <b>{DC.CORRECTION_COMBINE_TXT}</b>
        </li>
    </ul>
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
