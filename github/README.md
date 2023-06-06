# README

## 关于

这是一个tugraph的Demo，背景是github上仓库(repo)和用户(user)的关系，包含follow、star，commit，contribute 4种关系。

**关键词**：tugraph demo、github

## 目录结构
- data: github数据，需要通过control.sh下载，包含repo、user、star、commit、contributor等数据
- scripts: 从github api获取数据的脚本
- case.cypher: 查询相关的Cypher语句
- control.sh: 控制TuGraph Server启动停止、下载与更新github数据的脚本
- lgraph.json: TuGraph Server启动的配置文件

## 使用说明

前置条件：TuGraph已安装

### 数据说明
爬取了截止到2023年3月23日，Graphscope / NebulaGraph / Neo4j / tugraph-db / G6 / graphin / G6VP 7个仓库和仓库的用户和用户的followers和following数据。

| label      | count     |
|------------|-----------|
| repo       | 7         |
| user       | 1,036,974 |
| star       | 33,686    |
| commit     | 78,594    |
| contribute | 537       |
| follow     | 3,157,363 |


### 数据导入

- 根据数据存放目录对应修改import.json里面的DATA_PATH
- 参考control.sh中的load函数，加载数据
- 参考control.sh中的start函数，启动TuGraph服务
- 启动TuGraph服务后，访问${HOST_IP}:7071，打开web页面，确认数据是否导入成功

### Cypher查询

参考TuGraph文档，在TuGraph的Web页面前端输入Cypher进行查询

## 使用展示
### 查询展示

#### 查询某个repo用户
```cypher
 MATCH (n:user)-[e:star]->(m:repo{name:"tugraph-db"}) RETURN n,m LIMIT 10
```
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/23856528/1682594946399-24c359cb-0611-49cc-a781-039d76f8f417.png#clientId=uca252128-b54f-4&from=paste&height=493&id=u8fbeccc9&originHeight=1084&originWidth=3438&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=251890&status=done&style=none&taskId=u3290f4b2-39a6-4707-b28c-f920155b1b5&title=&width=1562.727238856072)
#### 查询两个repo共同的用户
```cypher
MATCH (n)-[]->(r1:repo{name:"tugraph-db"}), (n)-[]->(r2:repo{name:"neo4j"})
RETURN n,r1,r2 LIMIT 10
```
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/23856528/1682595442702-ad21e72a-72da-4ffa-89ac-bf0e070150b0.png#clientId=uca252128-b54f-4&from=paste&height=476&id=u46d7926e&originHeight=1048&originWidth=3398&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=259799&status=done&style=none&taskId=u1d6841fd-0d8f-422e-8b59-8300a06344d&title=&width=1544.5454210683342)
#### 查询谁是卷王
```cypher
 MATCH (n)-[e:commit]-(:repo{name:"tugraph-db"})
 WITH n, COUNT(e) AS cnt
 RETURN n.login, cnt ORDER by cnt DESC
```
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/23856528/1683356146462-975baa08-1fb5-487a-af6b-0e0b778546c3.png#clientId=u80999017-6e38-4&from=paste&height=509&id=ua40eb160&originHeight=1120&originWidth=3462&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=171990&status=done&style=none&taskId=uc8944e0a-c905-4316-a1a0-5356256454b&title=&width=1573.6363295287147)
#### 查询粉丝数最多的用户：
```cypher
 MATCH ()-[e:follow]->(n)
 WITH n, COUNT(e) AS cnt
 RETURN n.login, cnt ORDER BY cnt DESC LIMIT 20
```
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/23856528/1683356215761-56d3387c-6596-4265-b93b-1ca2cd4e0094.png#clientId=u80999017-6e38-4&from=paste&height=509&id=u87ccddc3&originHeight=1120&originWidth=3454&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=185194&status=done&style=none&taskId=u5f84b7cb-8d40-4f38-bdca-d7ff7ab2583&title=&width=1569.9999659711673)
#### 查询star数最多的用户：
```cypher
 MATCH (n)-[e:star]->(:repo)
 with n, COUNT(e) AS cnt
 RETURN n.login, cnt ORDER BY cnt DESC LIMIT 20
```
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/23856528/1683356752875-4fd464a1-e67f-414a-955b-cc14e9eba4b8.png#clientId=uf668ee42-5193-4&from=paste&height=517&id=u7919d0a6&originHeight=1138&originWidth=3458&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=172947&status=done&style=none&taskId=u78551c5e-1a0d-49f3-bd0e-1a1728258b2&title=&width=1571.8181477499409)
#### 查询某个repo的contributors的地理位置分布：
```cypher
 MATCH (n)-[e:contribute]-(:repo{name:"tugraph-db"})
 RETURN n.login, n.location ORDER BY n.location DESC
```
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/23856528/1683357135508-617b4cbf-61bf-4da5-a695-0c94e2d4bfca.png#clientId=uf668ee42-5193-4&from=paste&height=491&id=u659f2bde&originHeight=1080&originWidth=3366&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=178257&status=done&style=none&taskId=u01a034b9-e31c-40c5-acc4-9a41fc489be&title=&width=1529.9999668381438)
可以看出tugraph-db的贡献者在北京的最多。
