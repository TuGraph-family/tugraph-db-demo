MATCH (cc:主公)<-[r:隶属]-(wc) WHERE cc.name REGEXP "曹.*" AND (label(wc) = "文臣" OR label(wc) = "主公") return cc,wc
