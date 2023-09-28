# /bin/bash

func_name="start_all"
env="compile"

if [ "$#" -eq 0 ]; then
  echo "default: run all processes on compile env"
else
  func_name=$1
  if [ "$#" -gt 1 ] ; then
    env=$2
    if [ "$env" == "compile" ] || [ "$env" == "runtime" ] ; then
      echo "run process ${func_name} on ${env} env"
    else
      echo "Error: env should be compile or runtime"
      exit 1
    fi
  else
    echo "run process ${func_name} on compile env"
  fi
fi

TUGRAPH_BIN_PATH=${HOME}/tugraph-db/build/output
if [ "$env" == "runtime" ] ; then
  TUGRAPH_BIN_PATH=/usr/local/bin
fi

set -x

function download {
  cd download
  bash download.sh
  cd ..
}

function convert {
  cd raw_data
  python3 convert.py
  cd ..
}

function import {
  ${TUGRAPH_BIN_PATH}/lgraph_import -c ./raw_data/import.json -d ./lgraph_db --overwrite true --v3 0
}

function start_tugraph {
  ${TUGRAPH_BIN_PATH}/lgraph_server -c ./raw_data/lgraph_standalone.json -d start --unlimited_token 1
}

function stop_tugraph {
  ${TUGRAPH_BIN_PATH}/lgraph_server -c ./raw_data/lgraph_standalone.json -d stop
}

function load_algorithm {
  cd plugin
  bash make_demo.sh "$env"
  bash reload.sh
  cd ..
}

function start_demo_server {
  cd server
  npm install
  npm start
  cd ..
}

function start_all {
  download
  convert
  import
  start_tugraph
  load_algorithm
  start_demo_server
}

$func_name