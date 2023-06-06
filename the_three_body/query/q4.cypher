MATCH (a:person {name: "叶文洁"})-[:person_person]->(n)<-[:person_person]-(b:person {name: "汪淼"})
RETURN n