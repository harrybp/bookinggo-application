#!/bin/bash
echo "---------------------------------------------------"
echo ">   Running CLI tests..                           <"
echo "---------------------------------------------------"
echo ">>  For valid coords, passenger capacity of 1:   <<"
echo ">>> Test 1"
node cli.js 1.002,-1.847 2.098,-2.039 1
echo ">>> Test 2"
node cli.js 1.002,-1.847 2.098,-2.039 1
echo ">>> Test 3"
node cli.js 1.002,-1.847 2.098,-2.039 1
echo "---------------------------------------------------"
echo ">>  For valid coords, passenger capacity of 12:  <<"
echo ">>> Test 1"
node cli.js 1.002,-1.847 2.098,-2.039 12
echo ">>> Test 2"
node cli.js 1.002,-1.847 2.098,-2.039 12
echo ">>> Test 3"
node cli.js 1.002,-1.847 2.098,-2.039 12
echo ">>> Test 4"
node cli.js 1.002,-1.847 2.098,-2.039 12
echo "---------------------------------------------------"
echo ">>  For out of range coords:                     <<"
node cli.js 1000,2000 200,1 1
echo "---------------------------------------------------"
echo ">>  For invalid coords:                          <<"
node cli.js a,d d,s 1
echo "---------------------------------------------------"
echo ">>  For invalid passenger count:                 <<"
node cli.js 1,1 1,1 sss
echo "---------------------------------------------------"
echo ">>  For only 2 args given:                       <<"
node cli.js 1,1 2,2
echo "---------------------------------------------------"
echo ">>  For only 1 args given:                       <<"
node cli.js 1,1
