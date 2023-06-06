#!/bin/bash
cd raw_data_rice &&
lgraph_import --dir /var/lib/lgraph/iot_data/ --verbose 2 -c import.config -s schema.config --dry_run 0 --continue_on_error 1 --overwrite 1 --online false
