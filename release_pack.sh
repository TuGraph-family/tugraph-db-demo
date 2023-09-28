#!/bin/bash

cd .. && tar cvfz tugraph-demo.tar.gz \
    --exclude=tugraph-demo/github \
    --exclude=tugraph-demo/legacy \
    --exclude=tugraph-demo/LEGAL.md \
    --exclude=tugraph-demo/README.md \
    --exclude=tugraph-demo/.git \
    tugraph-demo
