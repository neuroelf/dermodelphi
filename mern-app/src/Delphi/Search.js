import React, { Component } from 'react'
import { TXT_SEARCH_NORESULTS, TXT_SEARCH_PROMPT, TXT_SEARCH_RESULTS } from './Constants'
import DelphiLinkSetState from './LinkSetState'
import '../index.css'

export default class DelphiSearch extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            query: '',
            results: [],
            message: ''
         };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.performSearch = this.performSearch.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    handleChange(event) {
        this.setState({ query: event.target.value }, this.performSearch);
    }
    
    performSearch() {
        const { query } = { ...this.state};
        if (query === '') {
            this.setState({ results: [] });
            return;
        }
        var pattern = new RegExp(query, 'i');
        var results = [];
        // look through the category and node names
        var nc, nname;
        const akeys = Object.keys(global.DM_LEVELANAMES);
        const bkeys = Object.keys(global.DM_LEVELBNAMES);
        const ckeys = Object.keys(global.DM_LEVELCNODES);
        for (nc = 0; nc < ckeys.length; nc++) {
            nname = global.DM_LEVELCNODES[ckeys[nc]].name;
            if (pattern.test(nname)) {
                results.push( { id: ckeys[nc], name: nname });
            }
        }
        for (nc = 0; nc < bkeys.length; nc++) {
            nname = global.DM_LEVELBNAMES[bkeys[nc]].name;
            if (pattern.test(nname)) {
                results.push( { id: bkeys[nc], name: nname });
            }
        }
        for (nc = 0; nc < akeys.length; nc++) {
            nname = global.DM_LEVELANAMES[akeys[nc]].name;
            if (pattern.test(nname)) {
                results.push( { id: akeys[nc], name: nname });
            }
        }
        if (results.length > 12) {
            results = results.slice(0, 12);
        }
        this.setState({ results: results });
    }

    renderResults() {
        const { results } = { ...this.state};
        if (results.length === 0) {
            if (this.state.query === '') {
                return (
<div className="delphi-results-container">
    <span className="delphi-search-result-none">{TXT_SEARCH_RESULTS}</span>
</div>
                );
            } else {
                return (
<div className="delphi-results-container">
    <span className="delphi-search-result-none">{TXT_SEARCH_NORESULTS}</span>
</div>
                );
            }
        }
        return (
<div className="delphi-results-container">
    {results.map((result) => {
        var id = result.id;
        while (id < 10000) {id = 100 * id + 1; }
        if (id > 999999) { id = Math.floor(id / 100); }
        return (
            <div key={"result" + result.id.toString()}><DelphiLinkSetState 
                AppObj={this.props.AppObj} stateValue={id} stateProp={'currentCBlockId'}
                className="delphi-search-result-item" linkText={result.name} /></div>
        );
    })}
</div>
        );
    }
    
    render() {
        const AppObj = this.props.AppObj;
        return (
<div className="delphi-search-container">
    <label className="delphi-search-label" htmlFor="search-input">
        <input type="text" className="delphi-search-input"
            placeholder={TXT_SEARCH_PROMPT} value={AppObj.state.query}
            onChange={this.handleChange} />
        <i className="delphi-search-icon" />
    </label>
    { this.renderResults() }
</div>
        );
    }
}
