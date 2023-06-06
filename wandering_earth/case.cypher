// 人物关系回顾
MATCH (n)-[e:关系]-(m) RETURN e

// 太空电梯危机
MATCH (n)-[e]-(m) where e.title="太空电梯危机" RETURN e

// 月球危机
MATCH (n)-[e]-(m) where e.title="月球危机" RETURN e

// 木星危机
MATCH (n)-[e]-(m) where e.title="木星危机" RETURN e

// 至少涉及到2次危机
MATCH (n)-[e1]-(m)-[e2]-(p)
where e1.title REGEXP ".*危机" and e2.title REGEXP ".*危机" and e1.title <> e2.title
RETURN e1, e2