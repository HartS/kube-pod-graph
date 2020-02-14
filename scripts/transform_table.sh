#!/bin/bash

# This script takes a file, because it uses the filename to create the timestamp column


awk '
NR == 1 {
  print tolower($1 " " $2 " " $3 " " $4 " timestamp")
  next
}
{
  print $1 " " $2 " " $3 " " $4 " '$(basename $1)'" 
}' $1
