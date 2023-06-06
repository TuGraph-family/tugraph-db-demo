MATCH (sensor)-[:rdf_type]->()-[:rdfs_subClassOf*0..]->({uri:'brick_Zone_Temperature_Sensor'})
RETURN DISTINCT sensor.uri;
