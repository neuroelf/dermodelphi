#!/bin/bash
DBPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
mongod --dbpath ${DBPATH}/mongodb
