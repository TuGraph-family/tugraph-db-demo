MATCH p = (cc:主公 {name: '曹操'})-[*1..3]-(zgl:文臣 {name: '诸葛亮'}) RETURN p
