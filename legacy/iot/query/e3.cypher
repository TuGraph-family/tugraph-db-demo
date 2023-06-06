MATCH ({uri:'brick_AHU'})<-[:rdf_type]-(ahu)-[:bf_feeds*..]->(x)
RETURN DISTINCT x.uri;
