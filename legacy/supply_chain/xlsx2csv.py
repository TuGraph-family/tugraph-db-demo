#!/usr/bin/python3
# -*- coding:utf-8 -*-
import xlrd
import csv

def remove_space(vals):
    for i in range(len(vals)):
        if isinstance(vals[i], str):
            vals[i] = vals[i].replace(' ','')

with xlrd.open_workbook('abc.xlsx') as wb:
    names = wb.sheet_names()
    schema={}
    fconfig = open('import.config', 'w')
    for name in names:
        # Get Schema
        if '图模型' == name:
            sh = wb.sheet_by_name(name)
            for row in range(sh.nrows):
                vals = sh.row_values(row)
                if vals[0] == '顶点':
                    schema[vals[1]] = list(filter(None,vals[2:]))
                if vals[0] == '边':
                    schema[vals[1]] = list(filter(None,vals[2:]))
            continue
        if '产品' in name:
            # CSV
            sh = wb.sheet_by_name(name)
            with open("output/" + name + ".csv", 'w', newline="") as fout:
                col = csv.writer(fout)
                for row in range(sh.nrows):
                    vals = sh.row_values(row)
                    remove_space(vals)
                    col.writerow(vals)
            # Vertex
            fconfig.write('[' + name + '.csv]\n');
            fconfig.write('LABEL=' + name + ',HEADER=1\n')
            ss = ''
            for v in schema[name]:
                if 'ID' in v:
                    ss += v + ':ID'
                else:
                    ss += ','
                    ss += v + ':OPTIONAL'
            fconfig.write(ss + '\n\n')
            continue
        if '交易' in name:
            # CSV
            sh = wb.sheet_by_name(name)
            with open("output/" + name + ".csv", 'w', newline="") as fout:
                col = csv.writer(fout)
                for row in range(sh.nrows):
                    vals = sh.row_values(row)
                    remove_space(vals)
                    col.writerow(vals)
            # Vertex
            fconfig.write('[' + name + '.csv]\n');
            fconfig.write('LABEL=供应商,HEADER=1\n')
            header = ['SKIP'] * 17
            header[1] = schema['供应商'][0] + ':ID'
            fconfig.write(','.join(header) + '\n\n')
            # Vertex
            fconfig.write('[' + name + '.csv]\n');
            fconfig.write('LABEL=采购商,HEADER=1\n')
            header = ['SKIP'] * 17
            header[2] = schema['采购商'][0] + ':ID'
            fconfig.write(','.join(header) + '\n\n')
            # Vertex
            fconfig.write('[' + name + '.csv]\n');
            fconfig.write('LABEL=项目,HEADER=1\n')
            header = ['SKIP'] * 17
            header[3] = schema['项目'][0] + ':ID'
            fconfig.write(','.join(header) + '\n\n')
            # Vertex
            fconfig.write('[' + name + '.csv]\n');
            fconfig.write('LABEL=交易,HEADER=1\n')
            header = ['SKIP'] * 5
            header[0] = schema['交易'][0] + ':ID'
            header += [v + ':OPTIONAL' for v in schema['交易'][1:]]
            fconfig.write(','.join(header) + '\n\n')
            # Edge
            fconfig.write('[' + name + '.csv]\n');
            fconfig.write('LABEL=生产,SRC_ID=交易:交易ID,DST_ID=供应商:ID,HEADER=1\n')
            header = ['SKIP'] * 17
            header[0] = '交易ID:STRING:SRC_ID'
            header[1] = 'ID:STRING:DST_ID'
            fconfig.write(','.join(header) + '\n\n')
            # Edge
            fconfig.write('[' + name + '.csv]\n');
            fconfig.write('LABEL=采购,SRC_ID=交易:交易ID,DST_ID=采购商:ID,HEADER=1\n')
            header = ['SKIP'] * 17
            header[0] = '交易ID:STRING:SRC_ID'
            header[2] = 'ID:STRING:DST_ID'
            fconfig.write(','.join(header) + '\n\n')
            # Edge
            fconfig.write('[' + name + '.csv]\n');
            fconfig.write('LABEL=属于,SRC_ID=交易:交易ID,DST_ID=项目:ID,HEADER=1\n')
            header = ['SKIP'] * 17
            header[0] = '交易ID:STRING:SRC_ID'
            header[3] = 'ID:STRING:DST_ID'
            fconfig.write(','.join(header) + '\n\n')
            # Edge
            fconfig.write('[' + name + '.csv]\n');
            suffix = '_' + name.split('_')[1]
            fconfig.write('LABEL=使用' + suffix + ',SRC_ID=交易:交易ID,DST_ID=产品' + suffix + ':产品ID,HEADER=1\n')
            header = ['SKIP'] * 17
            header[0] = '交易ID:STRING:SRC_ID'
            header[4] = '产品ID:STRING:DST_ID'
            fconfig.write(','.join(header) + '\n\n')
            continue
    fconfig.close();
