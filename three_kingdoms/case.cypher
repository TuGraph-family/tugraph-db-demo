// 诸葛亮为什么选择刘备不选择曹操
MATCH p = (cc:主公 {name: '曹操'})-[*1..3]-(zgl:文臣 {name: '诸葛亮'}) RETURN p

// 曹操为什么成就比刘备高
MATCH (cc:主公{name:"曹操"})<-[r:隶属]-(wj:武将) WHERE wj.name REGEXP "曹.*" OR wj.name REGEXP "夏侯.*" return cc,wj

// 三国中最强大的魏国为何最先灭亡
MATCH (cc:主公)<-[r:隶属]-(wc) WHERE cc.name REGEXP "曹.*" AND (label(wc) = "文臣" OR label(wc) = "主公") return cc,wc

// 三国各自的实力究竟如何
MATCH (p) WHERE (label(p)="主公" OR label(p)="文臣" OR label(p)="武将") AND p.hometown IN ["幽州","冀州","青州","并州","凉州","司州","豫州","兖州","徐州"] WITH COUNT(p) AS w
MATCH (p) WHERE (label(p)="主公" OR label(p)="文臣" OR label(p)="武将") AND p.hometown IN ["益州"] WITH COUNT(p) AS s,w
MATCH (p) WHERE (label(p)="主公" OR label(p)="文臣" OR label(p)="武将") AND p.hometown IN ["扬州","荆州","交州"] RETURN "魏",w,"蜀",s,"吴",count(p)

// 曹操的军事能力如何评价
MATCH (cc:主公{name:"曹操"})-[]-(zy:战役) RETURN cc,zy