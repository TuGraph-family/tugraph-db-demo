#!/bin/bash
python3 xlsx2csv.py
cp import.config ./output
cd output
lgraph_import --dir ./sc_data --verbose 2 -c import.config --dry_run 0 --continue_on_error 1 --overwrite 1 --online false
