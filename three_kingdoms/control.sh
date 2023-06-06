#!/bin/bash
set -x
TUGRAPH_PATH=${HOME}/project/tugraph-db/build/output
TUGRAPH_WEB=${TUGRAPH_PATH}/resource
function start {
    "${TUGRAPH_PATH}"/lgraph_server -c ./lgraph_standalone.json --web "${TUGRAPH_WEB}" -d start
}
function stop {
    "${TUGRAPH_PATH}"/lgraph_server -c ./lgraph_standalone.json -d stop
}
function load {
    "${TUGRAPH_PATH}"/lgraph_import -c ./rawdata/import.json -d lgraph_db --overwrite true --graph default --verbose 2
}
function remove {
    rm -rf lgraph_db .import_tmp
}
function restart {
    stop
    start
}
function reload {
    remove
    load
}
function reboot {
    stop
    reload && sleep 2 && start
}
# load or reload
$1
