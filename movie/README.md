# Movie Demo

> 此文档主要介绍了在tugraph-db的movie demo使用方法。

## 1. 简介

TuGraph 是蚂蚁集团自主研发的大规模图计算系统，提供图数据库引擎和图分析引擎。其主要特点是大数据量存储和计算，高吞吐率，以及灵活的 API，同时支持高效的在线事务处理（OLTP）和在线分析处理（OLAP）。 LightGraph、GeaGraph 是 TuGraph 的曾用名。

Movie Demo是TuGraph的一个快手上手示例。


## 2. TuGraph安装

略。

## 3. 建模和数据导入

完成系统路径配置后，可以通过`run_import.sh`脚本完成Movie场景的建模和数据导入。

Movie 场景图：

<img src="https://tugraph-web-static.oss-cn-beijing.aliyuncs.com/%E6%96%87%E6%A1%A3/1.Guide/2.quick-start.png" alt="movie_schema" style="zoom: 25%;" />

| 标签        | 类型 | 说明                                                             |
| ----------- | ---- | ---------------------------------------------------------------- |
| movie       | 实体 | 表示某一部具体的影片，比如"阿甘正传"。                           |
| person      | 实体 | 表示个人，对影片来说可能是演员、导演，或编剧。                   |
| genre       | 实体 | 表示影片的类型，比如剧情片、恐怖片。                             |
| keyword     | 实体 | 表示与影片相关的一些关键字，比如"拯救世界"、"虚拟现实"、"地铁"。 |
| user        | 实体 | 表示观影的用户。                                                 |
| produce     | 关系 | 表示影片的出品人关系。                                           |
| acted_in    | 关系 | 表示演员出演了哪些影片。                                         |
| direct      | 关系 | 表示影片的导演是谁。                                             |
| write       | 关系 | 表示影片的编剧关系。                                             |
| has_genre   | 关系 | 表示影片的类型分类。                                             |
| has_keyword | 关系 | 表示影片的一些关键字，即更细分类的标签。                         |
| rate        | 关系 | 表示用户对影片的打分。                                           |

导入后，通过`run_server.sh`来启动TuGraph服务。

## 4. 查询示

查询实例的终端执行可以参考`run_query.sh`脚本。

#### 示例一

查询影片 'Forrest Gump' 的所有演员，返回影片和演员构成的子图。

```sql
MATCH (m:movie {title: 'Forrest Gump'})<-[:acted_in]-(a:person) RETURN a, m
```

#### 示例二

查询影片 'Forrest Gump' 的所有演员，列出演员在影片中扮演的角色。

```sql
MATCH (m:movie {title: 'Forrest Gump'})<-[r:acted_in]-(a:person) RETURN a.name,r.role
```

#### 示例三

查询 Michael 所有评分低于 3 分的影片。

```sql
MATCH (u:user {login: 'Michael'})-[r:rate]->(m:movie) WHERE r.stars < 3 RETURN m.title, r.stars
```

#### 示例四

查询和 Michael 有相同讨厌的影片的用户，讨厌标准为评分小于三分。

```sql
MATCH (u:user {login: 'Michael'})-[r:rate]->(m:movie)<-[s:rate]-(v) WHERE r.stars < 3 AND s.stars < 3 RETURN u, m, v
```

#### 示例五

给 Michael 推荐影片，方法为先找出和 Michael 讨厌同样影片的用户，再筛选出这部分用户喜欢的影片。

```sql
MATCH (u:user {login: 'Michael'})-[r:rate]->(m:movie)<-[s:rate]-(v)-[r2:rate]->(m2:movie) WHERE r.stars < 3 AND s.stars < 3 AND r2.stars > 3 RETURN u, m, v, m2
```

#### 示例六

查询 Michael 的好友们喜欢的影片。

```sql
MATCH (u:user {login: 'Michael'})-[:is_friend]->(v:user)-[r:rate]->(m:movie) WHERE r.stars > 3 RETURN u, v, m
```

#### 示例七

通过查询给'Forrest Gump'打高分的人也喜欢哪些影片，给喜欢'Forrest Gump'的用户推荐类似的影片。

```sql
MATCH (m:movie {title:'Forrest Gump'})<-[r:rate]-(u:user)-[r2:rate]->(m2:movie) WHERE r.stars>3 AND r2.stars>3 RETURN m, u,m2
```
