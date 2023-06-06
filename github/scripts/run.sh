# /bin/bash

mkdir repos
mkdir followers
mkdir following
mkdir data

node get_stargazers.js TuGraph-family tugraph-db
# add other repos
# node get_stargazers.js $other_owner $other_repo
# ...

python3 build_node.py
python3 build_edge.py
