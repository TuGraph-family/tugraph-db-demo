MATCH (p:person {name: "叶文洁"})
SET p.introduce = "清华大学教授、ETO精神领袖、首位和三体人交流的人"
RETURN p