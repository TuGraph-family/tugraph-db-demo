# example 1
MATCH (vav)-[:rdf_type]->({uri:'brick_VAV'}) RETURN DISTINCT vav.uri

# example 2
MATCH (sensor)-[:rdf_type]->()-[:rdfs_subClassOf*0..]->({uri:'brick_Zone_Temperature_Sensor'}) RETURN DISTINCT sensor.uri

# example 3
MATCH ({uri:'brick_AHU'})<-[:rdf_type]-(ahu)-[:bf_feeds*..]->(x) RETURN DISTINCT x.uri

# example 4
MATCH ({uri:'brick_Floor'})<-[:rdf_type]-(floor)-[:bf_hasPart*..]->(room)-[:rdf_type]->({uri:'brick_Room'}),({uri:'brick_HVAC_Zone'})<-[:rdf_type]-(zone)-[:bf_hasPart*..]->(room) RETURN DISTINCT floor.uri,room.uri,zone.uri
