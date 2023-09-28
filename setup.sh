#!/bin/bash
cd /var/lib/lgraph/data/upload_files/admin/movie/ && lgraph_import -d /var/lib/lgraph/data -g Movie --overwrite 1 --continue_on_error 1 -c ./import.json

cd /var/lib/lgraph/data/upload_files/admin/the_three_body/ && lgraph_import -d /var/lib/lgraph/data -g TheThreeBody --overwrite 1 --continue_on_error 1 -c ./rawdata/import.json

cd /var/lib/lgraph/data/upload_files/admin/three_kingdoms/ && lgraph_import -d /var/lib/lgraph/data -g ThreeKingdoms --overwrite 1 --continue_on_error 1 -c ./raw_data/import.json

cd /var/lib/lgraph/data/upload_files/admin/wandering_earth/ && lgraph_import -d /var/lib/lgraph/data -g WanderingEarth --overwrite 1 --continue_on_error 1 -c ./rawdata/import.json

lgraph_server -c /usr/local/etc/lgraph.json -d start && cd /var/lib/web/tugraph-db-browser/ && yarn run start
