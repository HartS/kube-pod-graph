#!/bin/bash

# Takes path to snapshots generated by monitor_kubectl_pods from kubectl-get-pods-monitoring.sh
# Outputs a jsonp file which can be loaded by chart web app
set -e

snapshot_dir=$1

jsonp="export const kubePodData=$(
  for table_file in $(ls -1 ${snapshot_dir} | grep -v new.log); do
    ./scripts/transform_table.sh ${snapshot_dir}/${table_file} | ./scripts/table_to_json.awk
  done | jq -rsc .
)"

echo "${jsonp}"
