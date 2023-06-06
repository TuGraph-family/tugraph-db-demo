MATCH ({uri:'brick_Floor'})<-[:rdf_type]-(floor)-[:bf_hasPart*..]->(room)-[:rdf_type]->({uri:'brick_Room'})
     ,({uri:'brick_HVAC_Zone'})<-[:rdf_type]-(zone)-[:bf_hasPart*..]->(room)
RETURN DISTINCT floor.uri,room.uri,zone.uri
