import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DelphiWelcome extends Component {
    //constructor(props) {
    //    super(props);
    //}
    
    render() {
        return (
<div>
    <h2>Welcome to the Dermatology Diagnosis Mapper - Consensus Survey website.</h2>

    <p className="general-text-paragraph">
        Our mission is to help the dermatology community by creating an accepted
        standard for how diagnoses--especially those associated with dermoscopy
        images uploaded to
        the <a href={"https://isic-archive.com/"} target={"_blank"}>ISIC Archive</a>--are
        entered.
    </p>
    <p className="general-text-paragraph">
        Please <Link to="/block/10101">start with the first block.</Link>
    </p>
</div>
        );
    }
}

export default DelphiWelcome;
