MATCH (p) WHERE (label(p)="主公" OR label(p)="文臣" OR label(p)="武将") AND p.hometown IN ["幽州","冀州","青州","并州","凉州","司州","豫州","兖州","徐州"] WITH COUNT(p) AS w
MATCH (p) WHERE (label(p)="主公" OR label(p)="文臣" OR label(p)="武将") AND p.hometown IN ["益州"] WITH COUNT(p) AS s,w
MATCH (p) WHERE (label(p)="主公" OR label(p)="文臣" OR label(p)="武将") AND p.hometown IN ["扬州","荆州","交州"] RETURN "魏",w,"蜀",s,"吴",count(p)
