# /bin/bash

# /bin/bash

set -x

TUGRAPH_PATH=${HOME}/project/tugraph-db/build/output
TUGRAPH_WEB=${TUGRAPH_PATH}/resource

function start {
    ${TUGRAPH_PATH}/lgraph_server -c ./lgraph_standalone.json --web ${TUGRAPH_WEB} -d start
}

function download_data() {
  cd data
  wget https://lvshan-public.oss-cn-hangzhou-zmf.aliyuncs.com/yongchao.ly/wangjun/zy/github-demo/gitdemo_data.tar.gz
  tar -xzvf gitdemo_data.tar.gz
  cd ..
}

function scripts() {
  cd scripts
  bash run.sh
  cp -f data/* ../data
  cd ..
}

function stop {
    ${TUGRAPH_PATH}/lgraph_server -c ./lgraph_standalone.json -d stop
}

function load {
    ${TUGRAPH_PATH}/lgraph_import -c ./rawdata/import.json -d lgraph_db --overwrite true --graph default --verbose 2
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

# download_data or scripts before load
$1