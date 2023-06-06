// 查询某个repo信息
MATCH (n:repo) RETURN n

// 查询某个repo用户
MATCH (n:user)-[e:star]->(m:repo{name:"tugraph-db"}) RETURN n,m LIMIT 10

// 查询两个repo共同的用户
MATCH (n)-[]->(r1:repo{name:"tugraph-db"}), (n)-[]->(r2:repo{name:"neo4j"})
RETURN n,r1,r2 LIMIT 10

// 查询谁是卷王
MATCH (n)-[e:commit]-(:repo{name:"tugraph-db"})
WITH n, COUNT(e) AS cnt
RETURN n.login, cnt ORDER BY cnt DESC

// 查询粉丝数最多的用户
MATCH ()-[e:follow]->(n)
WITH n, COUNT(e) AS cnt
RETURN n.login, cnt ORDER by cnt DESC LIMIT 20

// 查询star数最多的用户
MATCH (n)-[e:star]->(:repo)
with n, COUNT(e) AS cnt
RETURN n.login, cnt ORDER BY cnt DESC LIMIT 20

// 查询某个repo的contributors的地理位置分布
MATCH (n)-[e:contribute]-(:repo{name:"tugraph-db"})
RETURN n.login, n.location ORDER BY n.location DESC