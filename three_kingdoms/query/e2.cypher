MATCH (cc:主公{name:"曹操"})<-[r:隶属]-(wj:武将) WHERE wj.name REGEXP "曹.*" OR wj.name REGEXP "夏侯.*" return cc,wj
