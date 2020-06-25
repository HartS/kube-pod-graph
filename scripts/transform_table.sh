#!/bin/bash

# This script takes a file which contains the output from 'kubectl get pods --all-namespaces', and is named after the timestamp at which it was generated.
# It inserts the timestamp as the last field in the table, removes table formatting whitepace and outputs the headers separated by single spaces, followed by all data also separated by single spaces

# As an example, it would take a file named '1593075378' containing

# NAMESPACE     NAME                                                              READY   STATUS             RESTARTS   AGE
# cf-operator   cf-operator-668b985c46-hvl2v                                      1/1     Running            0          18m
# cf-operator   cf-operator-quarks-job-6dffc7bc88-fbw82                           1/1     Running            0          18m
# kube-system   cilium-8lfqs                                                      1/1     Running            0          34h
# kube-system   cilium-d9x9r                                                      1/1     Running            0          34h

# and generate

# namespace name ready status timestamp
# cf-operator cf-operator-668b985c46-hvl2v 1/1 Running 1593075378
# cf-operator cf-operator-quarks-job-6dffc7bc88-fbw82 1/1 Running 1593075378
# kube-system cilium-8lfqs 1/1 Running 1593075378
# kube-system cilium-d9x9r 1/1 Running 1593075378

# This table converted to json by passing it to table_to_json.awk

awk '
NR == 1 {
  print tolower($1 " " $2 " " $3 " " $4 " timestamp")
  next
}
{
  print $1 " " $2 " " $3 " " $4 " '$(basename $1)'" 
}' $1
