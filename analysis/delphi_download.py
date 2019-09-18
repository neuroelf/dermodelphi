#!/usr/bin/env python

# imports
import csv
import os
import warnings

import bs4
import getpass
import json
import netrc
import pandas
import requests


# backend URL
DELPHI_BACKEND = 'https://delphi.diagnosismapper.com/'

# location to JSON file
THIS_DIR = os.path.dirname(os.path.abspath(__file__))
PACKAGE_DIR = THIS_DIR.rpartition(os.sep)[0]
print(PACKAGE_DIR)
JSON_FILE = os.path.join(PACKAGE_DIR, 'mern-app', 'src', 'json', 'dm_diagnoses.json')
if not os.path.exists(JSON_FILE):
    raise RuntimeError('Necessary JSON file not found.')
with open(JSON_FILE, 'r') as json_file:
    DM_BASIS = json.loads(json_file.read())

# get list of all children (cnodes) in original basis
original_anodes = dict()
original_bnodes = dict()
original_bfull = dict()
original_cnodes = dict()
for a in DM_BASIS['children']:
    original_anodes[a['id']] = a['name']
    for b in a['children']:
        original_bnodes[b['id']] = b['name']
        original_bfull[b['id']] = a['name'] + ' - ' + b['name']
        for c in b['children']:
            c['levelA'] = a['name']
            c['levelB'] = b['name']
            c['levelC'] = c['name']
            original_cnodes[c['id']] = c
original_cnodes_list = sorted(list(original_cnodes.keys()))
original_cnodes_set = set(original_cnodes_list)

# requests
def endpoint(e, p=None):
    try:
        r = requests.get(DELPHI_BACKEND + e, params=p)
    except:
        raise
    try:
        return r.json()
    except:
        pass
    try:
        return bs4.BeautifulSoup(r.text, features='lxml').get_text().strip()
    except:
        return r.text

def check_user(u, s):
    return endpoint('checkEmail/' + u + '/' + s)
def get_sessions(u, t):
    return endpoint('admin/' + u + '/token/' + t + '/sessions')
def get_session_blocks(s):
    return endpoint('session/' + s + '/blocks')

# append row to rows
# csv_rows = [['sessionId', 'levelCNodeId', 'levelA', 'levelB', 'levelC',
#     'correct', 'corrected', 'newName', 'correctSpelling', 'combineWith',
#     'reassignCategory', 'editMods', 'newMods', 'editSyns', 'newSyns',
#     'deleteTerm', 'deleteMods', 'deleteSyns', 'otherCorrection']]
def append_row(rows, n, s, sid):
    is_correct = 'TRUE' if s['correct'] else 'FALSE'
    if s['correction'] == 'CORRECTION_NONE':
        correction = ''
    else:
        correction = s['correction'].replace('CORRECTION_', '')
    if s['corrcombine'] == 0:
        combine = ''
    elif s['corrcombine'] in original_cnodes_set:
        combine = original_cnodes[s['corrcombine']]['name']
    else:
        combine = str(s['corrcombine'])
    if s['corrmoveto'] == 0:
        moveto = ''
    elif s['corrmoveto'] in original_bfull:
        moveto = original_bfull[s['corrmoveto']]
    else:
        moveto = str(s['corrmoveto'])
    if correction == 'DELETE':
        delete_term = 'TRUE'
    else:
        delete_term = 'FALSE'
    if correction in ['DELBOTH', 'DELMODS']:
        delete_mods = 'TRUE'
    else:
        delete_mods = 'FALSE'
    if correction in ['DELBOTH', 'DELSYNS']:
        delete_syns = 'TRUE'
    else:
        delete_syns = 'FALSE'
    rows.append([sid, n['id'], n['levelA'], n['levelB'], n['levelC'], is_correct,
        correction, s['corrnewname'], s['corrspelling'], combine, moveto,
        s['correditmods'], s['corrnewmods'], s['correditsyns'], s['corrnewsyns'],
        delete_term, delete_mods, delete_syns, s['corrother']])


# main function
def main():

    # username in netrc?
    netrc_o = netrc.netrc()
    hostname = DELPHI_BACKEND[8:-1]
    netrc_tokens = netrc_o.authenticators(hostname)
    if not netrc_tokens is None:
        username = netrc_tokens[0]
        session_id = netrc_tokens[2]
    else:
        username = input('Username for ' + DELPHI_BACKEND + ': ')
        session_id = getpass.getpass('Session ID for ' + username + ': ')
    try:
        check = check_user(username, session_id)
        if not '_id' in check:
            raise RuntimeError('Invalid username or Session ID.')
    except Exception as e:
        warnings.warn(str(e))
        return
    
    # check admin token, and get sessions
    token = getpass.getpass('Admin token for ' + username + ': ')
    sessions = dict()
    new_as = dict()
    new_bs = dict()
    new_cs = dict()
    try:
        s = get_sessions(session_id, token)
        if not isinstance(s, list):
            raise RuntimeError('Invalid admin token for ' + username + '.')
        for so in s:
            sid = so['sessionId']
            new_as[sid] = dict()
            new_bs[sid] = dict()
            new_cs[sid] = dict()
            sessions[sid] = so
            for a in so['newAs']:
                new_as[sid][a['id']] = a['name']
            for b in so['newBs']:
                new_bs[sid][b['id']] = b['name']
            for c in so['newCs']:
                new_cs[sid][c['id']] = c['name']

    except Exception as e:
        warnings.warn(str(e))
        return
    
    # header
    csv_rows = [['sessionId', 'levelCNodeId', 'levelA', 'levelB', 'levelC',
        'correct', 'corrSelection', 'newName', 'correctSpelling', 'combineWith',
        'reassignCategory', 'editMods', 'newMods', 'editSyns', 'newSyns',
        'deleteTerm', 'deleteMods', 'deleteSyns', 'otherCorrection']]

    # grab all blocks for all sessions
    session_blocks = dict()
    cnodes = dict()
    new_cnodes = dict()
    for s in sessions.keys():
        blocks = get_session_blocks(s)
        session_blocks[s] = blocks
        cnodes[s] = dict()
        new_cnodes[s] = dict()
        for b in blocks:
            block = b['block']
            for (cid, state) in block.items():
                if isinstance(cid, str) and cid == 'locked':
                    continue
                cid = int(cid)
                cnodes[s][cid] = state
                if not cid in original_cnodes_set:
                    bid = cid // 10000
                    aid = bid // 100
                    if aid in original_anodes:
                        aname = original_anodes[aid]
                    else:
                        aname = new_as[s][aid]
                    if bid in original_bnodes:
                        bname = original_bnodes[bid]
                    else:
                        bname = new_bs[s][bid]
                    cname = new_cs[s][cid]
                    new_cnodes[s][cid] = {
                        'id': cid,
                        'levelA': aname,
                        'levelB': bname,
                        'levelC': cname,
                    }
        for c in original_cnodes_list:
            if c in cnodes[s]:
                state = cnodes[s][c]
            else:
                state = {
                    'correct': False,
                    'correction': 'CORRECTION_NONE',
                    'corrcombine': 0,
                    'correditmods': '',
                    'correditsyns': '',
                    'corrmoveto': 0,
                    'corrnewmods': '',
                    'corrnewname': '',
                    'corrnewsyns': '',
                    'corrother': '',
                    'corrspelling': '',
                    'byuser': False,
                }
            cnode = original_cnodes[c]
            append_row(csv_rows, cnode, state, s)
        for (c, cnode) in new_cnodes[s].items():
            append_row(csv_rows, cnode, cnodes[s][c], s)
    with open(THIS_DIR + os.sep + "analysis.csv", 'w', newline='') as csv_file:
        cw = csv.writer(csv_file, delimiter=',')
        for row in csv_rows:
            cw.writerow(row)


if __name__ == '__main__':
    main()
