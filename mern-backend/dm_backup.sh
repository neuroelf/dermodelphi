#!/bin/bash
for collection in dmsessionids dmsessions dmsessionblocks ; do
    /usr/local/lib/mongodb/bin/mongoexport -d diagnosis_mapper -c $collection --jsonArray -o dm_$collection.json
  done
