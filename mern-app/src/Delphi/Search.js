import React, { Component } from 'react'
import * as DC from './Constants'
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
        var queryparts = query.split(' ');
        queryparts = queryparts.filter(part => part.length > 0);
        var pc, patterns = [], patternmatch;
        try {
            for (pc = 0; pc < queryparts.length; pc++) {
                patterns[pc] = new RegExp(queryparts[pc], 'i');
            }
        } catch {
            return;
        }
        var results = [];
        var cresults = []
        // look through the category and node names
        var nc, cnode, nname, nodename, blockId, rowState;
        var akeys = Object.keys(global.DM_LEVELANAMES);
        var bkeys = Object.keys(global.DM_LEVELBNAMES);
        var ckeys = Object.keys(global.DM_LEVELCNODES);
        for (nc = 0; nc < akeys.length; nc++) {
            nname = global.DM_LEVELANAMES[akeys[nc]];
            patternmatch = true;
            for (pc = 0; pc < patterns.length; pc++) {
                if (!patterns[pc].test(nname)) {
                    patternmatch = false;
                    break;
                }
            }
            if (patternmatch) {
                results.push({
                    id: akeys[nc],
                    name: DC.TXT_SEARCH_RESULTS_A + nname
                });
            }
        }
        for (nc = 0; nc < bkeys.length; nc++) {
            nname = global.DM_LEVELBNAMES[bkeys[nc]];
            patternmatch = true;
            for (pc = 0; pc < patterns.length; pc++) {
                if (!patterns[pc].test(nname)) {
                    patternmatch = false;
                    break;
                }
            }
            if (patternmatch) {
                results.push({
                    id: bkeys[nc],
                    name: DC.TXT_SEARCH_RESULTS_B +
                        global.DM_LEVELBFULLNAMES[bkeys[nc]]
                });
            }
        }
        for (nc = 0; nc < ckeys.length; nc++) {
            cnode = global.DM_LEVELCNODES[ckeys[nc]];
            nname = cnode.name;
            nodename = nname;
            patternmatch = true;
            for (pc = 0; pc < patterns.length; pc++) {
                if (!patterns[pc].test(nname)) {
                    patternmatch = false;
                    break;
                }
            }
            if (patternmatch) {
                cresults.push({
                    id: ckeys[nc],
                    name: nname
                });
                continue;
            }
            if (cnode.synonyms.length > 0) {
                nname = cnode.synonyms.join(', ');
                patternmatch = true;
                for (pc = 0; pc < patterns.length; pc++) {
                    if (!patterns[pc].test(nname)) {
                        patternmatch = false;
                        break;
                    }
                }
                if (patternmatch) {
                    cresults.push({
                        id: ckeys[nc],
                        name: nodename + ' (' + DC.TXT_AKA + nname + ')'
                    });
                    continue;
                }
            }
            blockId = Math.floor(ckeys[nc] / 100);
            rowState = blocks[blockId][ckeys[nc]];
            if (rowState.correct) {
                continue;
            }
            nname = rowState.corrnewname;
            if (nname !== '') {
                nodename = nodename + " " + DC.TXT_RENAMED_TO + " " + nname;
                patternmatch = true;
                for (pc = 0; pc < patterns.length; pc++) {
                    if (!patterns[pc].test(nname)) {
                        patternmatch = false;
                        break;
                    }
                }
                if (patternmatch) {
                    cresults.push({
                        id: ckeys[nc], 
                        name: nodename
                    });
                    continue;
                }
            }
            nname = rowState.corrspelling;
            if (nname !== '' && rowState.corrnewname === '') {
                patternmatch = true;
                for (pc = 0; pc < patterns.length; pc++) {
                    if (!patterns[pc].test(nname)) {
                        patternmatch = false;
                        break;
                    }
                }
                if (patternmatch) {
                    cresults.push({
                        id: ckeys[nc],
                        name: nodename + " " + DC.TXT_CORRECTED_TO + " " + nname
                    });
                    continue;
                }
            }
            nname = rowState.corrnewsyns;
            if (nname !== '') {
                patternmatch = true;
                for (pc = 0; pc < patterns.length; pc++) {
                    if (!patterns[pc].test(nname)) {
                        patternmatch = false;
                        break;
                    }
                }
                if (patternmatch) {
                    cresults.push({
                        id: ckeys[nc],
                        name: nodename + ' (' + DC.TXT_AKA + nname + ')'
                    });
                    continue;
                }
            }
        }
        if (cresults.length > 0) {
            cresults = cresults.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0 );
            results.push.apply(results, cresults);
        }
        if (results.length > DC.SEARCH_MAX_RESULTS) {
            results = results.slice(0, DC.SEARCH_MAX_RESULTS);
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
    <span className="delphi-search-result-none">{DC.TXT_SEARCH_RESULTS}</span>
</div>
                );
            } else {
                return (
<div className="delphi-results-container">
    <span className="delphi-search-result-none">{DC.TXT_SEARCH_NORESULTS}</span>
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
            placeholder={DC.TXT_SEARCH_PROMPT} value={AppObj.state.query}
            onChange={this.handleChange} />
        <i className="delphi-search-icon" />
    </label>
    { (AppObj.state.query.length > 0) ? this.renderResults() : '' }
</div>
        );
    }
}
