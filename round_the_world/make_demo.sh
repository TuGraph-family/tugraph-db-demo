#!/bin/bash

TUGRAPH_PATH="${HOME}/tugraph-db"

INCLUDE_DIR="${TUGRAPH_PATH}/include"
LIBLGRAPH="${TUGRAPH_PATH}/build/output/liblgraph.so"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    g++ -fno-gnu-unique -fPIC -g --std=c++17 -I$INCLUDE_DIR -rdynamic -O3 -fopenmp -o demo.so demo.cpp $LIBLGRAPH -shared
elif [[ "$OSTYPE" == "darwin"* ]]; then
    clang++ -stdlib=libc++ -fPIC -g --std=c++17 -I$INCLUDE_DIR -rdynamic -O3 -Xpreprocessor -fopenmp -lomp -o demo.so demo.cpp cpp/$1_core.cpp $LIBLGRAPH -shared
fi
