import React, { Component } from 'react'
import { SEARCH_MAX_RESULTS, TXT_SEARCH_RESULTS_A, TXT_SEARCH_RESULTS_B,
    TXT_SEARCH_NORESULTS, TXT_SEARCH_PROMPT, TXT_SEARCH_RESULTS, TXT_AKA } from './Constants'
import DelphiLinkSetState from './LinkSetState'
import '../index.css'

export default class DelphiSearch extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.performSearch = this.performSearch.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    handleChange(event) {
        this.props.AppObj.setState({ query: event.target.value }, this.performSearch);
    }
    
    performSearch() {
        const { AppObj } = { ...this.props};
        const { blocks, query } = { ...AppObj.state};
        if (query === '') {
            AppObj.setState({ results: [] });
            return;
        }
        try {
            var pattern = new RegExp(query, 'i');
        } catch {
            return;
        }
        var results = [];
        var cresults = []
        // look through the category and node names
        var nc, cnode, nname, blockId, rowState;
        var akeys = Object.keys(global.DM_LEVELANAMES);
        var bkeys = Object.keys(global.DM_LEVELBNAMES);
        var ckeys = Object.keys(global.DM_LEVELCNODES);
        for (nc = 0; nc < akeys.length; nc++) {
            nname = global.DM_LEVELANAMES[akeys[nc]];
            if (pattern.test(nname)) {
                results.push( { id: akeys[nc], name: TXT_SEARCH_RESULTS_A + nname });
            }
        }
        for (nc = 0; nc < bkeys.length; nc++) {
            nname = global.DM_LEVELBNAMES[bkeys[nc]];
            if (pattern.test(nname)) {
                results.push( { id: bkeys[nc], name: TXT_SEARCH_RESULTS_B + nname });
            }
        }
        for (nc = 0; nc < ckeys.length; nc++) {
            cnode = global.DM_LEVELCNODES[ckeys[nc]];
            nname = cnode.name;
            if (pattern.test(nname)) {
                cresults.push( { id: ckeys[nc], name: nname });
                continue;
            }
            if (cnode.synonyms.length > 0) {
                nname = cnode.synonyms.join(', ');
                if (pattern.test(nname)) {
                    cresults.push( { id: ckeys[nc], name: cnode.name + ' (' + TXT_AKA + nname + ')'});
                    continue;
                }
            }
            blockId = Math.floor(ckeys[nc] / 100);
            rowState = blocks[blockId][ckeys[nc]];
            nname = rowState.corrnewname;
            if (nname !== '') {
                if (pattern.test(nname)) {
                    cresults.push( { id: ckeys[nc], name: nname });
                    continue;
                }
            }
            nname = rowState.corrspelling;
            if (nname !== '' && rowState.corrnewname === '') {
                if (pattern.test(nname)) {
                    cresults.push( { id: ckeys[nc], name: nname });
                    continue;
                }
            }
        }
        if (cresults.length > 0) {
            cresults = cresults.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0 );
            results.push.apply(results, cresults);
        }
        if (results.length > SEARCH_MAX_RESULTS) {
            results = results.slice(0, SEARCH_MAX_RESULTS);
        }
        AppObj.setState({ results: results });
    }

    renderResults() {
        const { AppObj } = { ...this.props};
        var { results } = { ...AppObj.state};
        if (results.length === 0) {
            if (AppObj.state.query === '') {
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
                AppObj={this.props.AppObj}
                stateProp={{ currentCBlockId: id, query: '', results: [] }}
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
    { (AppObj.state.query.length > 0) ? this.renderResults() : '' }
</div>
        );
    }
}
