#!/bin/bash

set -e

snapshot_dir=$1

jsonp="export const kubePodData=$(
  for table_file in $(ls -1 ${snapshot_dir} | grep -v new.log); do
    ./transform_table.sh ${snapshot_dir}/${table_file} | ./table_to_json.awk
  done | jq -rsc .
)"

echo "$jsonp"
