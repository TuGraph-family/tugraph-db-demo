# 关于

这是一个tugraph的Demo，背景是流浪地球的故事宇宙

**关键词**：tugraph demo、流浪地球

## Demo场景设计

Demo背景基于流浪地球1、流浪地球2的故事背景进行设计
- 基于剧情，设计了图结构，包含组织、角色、天体与设施3类点，事件、关系两类边
- 根据剧情准备了对应Schema的数据
- 准备了一些query，提出一些关于剧情的问题

## 目录结构

- rawdata: 原始剧情数据和schema定义文件
- case.cypher: 查询相关的Cypher语句
- control.sh: 控制TuGraph Server启动停止的脚本
- lgraph_standalone.json: TuGraph Server启动的配置文件

## 使用说明

前置条件：TuGraph已安装

### 数据导入

- 根据数据存放目录对应修改import.json里面的DATA_PATH
- 参考control.sh中的load函数，加载数据
- 参考control.sh中的start函数，启动TuGraph服务
- 启动TuGraph服务后，访问${HOST_IP}:7071，打开web页面，确认数据是否导入成功

### Cypher查询

参考TuGraph文档，在TuGraph的Web页面前端输入Cypher进行查询

## 使用展示

### 数据导入的展示

![data](./images/data.png)

### 查询展示

#### 查询木星危机的所有事件经过

![data](./images/cypher1.png)

#### 查询木星危机的所有事件经过

![data](./images/cypher2.png)
