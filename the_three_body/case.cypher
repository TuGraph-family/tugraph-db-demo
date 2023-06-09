# 1、人物关系查询
# 三体一剧情中，一开始全世界各地发生了大量科学家自杀事件，引起了警方重视，查案过程根据人物关系线索一步步排查，就如上面的图所示，随着线索越来越多，背后的真相逐步浮出水面。史强和汪淼发现大多数人都和叶文洁有着直接或者间接的联系，并派汪淼卧底，最终发现叶文洁的最终统帅身份。叶文洁节点周围有很多边关系（一度或二度邻居很多）。
MATCH (n)-[e:person_person]-(m) RETURN e

# 2、设置/更改属性
# 随着剧情推进，我们逐步了解了"叶文洁"身上的多个标签，那么我们也可以将这些标签更新至“叶文洁”节点上：
MATCH (p:person {name: "叶文洁"})
SET p.introduce = "清华大学教授、ETO精神领袖、首位和三体人交流的人"
RETURN p

# 3、增加/删除节点
# 后续我们了解到了罗辑、程心等等人物和PIA、星环集团等组织，希望把这些作为节点添加至图中：
CREATE (a:person {introduce: "物理学教授", name: "bbb"})
RETURN a


# 4、图分析：查询a节点和b节点的共同邻居

# 我们往往希望知道两个人物之间的共同关联的人物都有谁，这样就能很快的掌握这两个人物之间的关系，在大数据量的情况下，使用cypher进行图关系分析就很方便！
MATCH (a:person {name: "叶文洁"})-[:person_person]->(n)<-[:person_person]-(b:person {name: "汪淼"})
RETURN n

# 5、邻域节点分析：
# 三体中的各种计划比较多，有的时候可能会被绕晕，这时候我们可以通过图的邻居节点查询来查看该计划的相关人物和组织等。如"面壁计划"中,我们可以看到有四位人物与之相关，这四位也是被世人所寄予厚望的“面壁者”
MATCH (:plan {name: "面壁计划"})--(neighbor:person)
RETURN neighbor
