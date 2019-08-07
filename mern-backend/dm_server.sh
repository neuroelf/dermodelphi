#!/bin/bash
DMPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DMPATH
nohup npm start >> dm_server.log 2>&1 &

