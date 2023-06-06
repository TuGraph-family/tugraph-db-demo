#!/bin/bash

CYPHER="lgraph_cypher -u admin -P admin123456 -p 7090 -f "

cat e1.cypher
$CYPHER e1.cypher
echo

cat e2.cypher
$CYPHER e2.cypher
echo

cat e3.cypher
$CYPHER e3.cypher
echo

cat e4.cypher
$CYPHER e4.cypher
echo
