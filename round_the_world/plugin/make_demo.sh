#!/bin/bash

TUGRAPH_PATH="${HOME}/tugraph-db"
TUGRAPH_INCLUDE_PATH=${TUGRAPH_PATH}/include
LIBLGRAPH=${TUGRAPH_PATH}/build/output/liblgraph.so

if [ "$#" -gt 0 ] ; then
  env=$1
  if [ "$env" == "runtime" ] ; then
    TUGRAPH_INCLUDE_PATH=/usr/local/include
    LIBLGRAPH=/usr/local/lib64/liblgraph.so
  fi
fi

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    g++ -fno-gnu-unique -fPIC -g --std=c++17 -I$TUGRAPH_INCLUDE_PATH -rdynamic -O3 -fopenmp -o demo.so demo.cpp $LIBLGRAPH -shared
elif [[ "$OSTYPE" == "darwin"* ]]; then
    clang++ -stdlib=libc++ -fPIC -g --std=c++17 -I$TUGRAPH_INCLUDE_PATH -rdynamic -O3 -Xpreprocessor -fopenmp -lomp -o demo.so demo.cpp cpp/$1_core.cpp $LIBLGRAPH -shared
fi
