# /bin/bash

$func_name="start_all"
if [ "$#" -eq 0 ]; then
  echo "default: run all processes"
else
  func_name=$1
  echo "run process ${func_name}"
fi

set -x

TUGRAPH_PATH=${HOME}/tugraph-db/build/output

function download {
  cd download
  bash download.sh
}

function convert {
  cd raw_data
  python3 convert.py
}

function import {
  ${TUGRAPH_PATH}/build/output/lgraph_import -c ./raw_data/import.json -d ./lgraph_db --overwrite true --v3 0
}

function start_tugraph {
  ${TUGRAPH_PATH}/build/output/lgraph_server -c ./lgraph_standalone.json -d start --unlimited_token 1
}

function stop_tugraph {
  ${TUGRAPH_PATH}/build/output/lgraph_server -c ./lgraph_standalone.json -d stop
}

function load_algorithm {
  bash make_demo.sh
  python3 reload.sh
}

function start_demo_server {
  cd server
  npm install
  npm start
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