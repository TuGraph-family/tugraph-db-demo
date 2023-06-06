import sys
import os
import pandas as pd
import numpy as np
import json


def build_commit():
    list_dir = [i for i in os.listdir("./") if i.count("-commits.csv") > 0]
    for file in list_dir:
        repo_name = file.replace("-commits.csv", '')
        df = pd.read_csv(file)
        df['date'] = df['date'].str.replace('T', ' ')
        df['date'] = df['date'].str.replace('Z', '')
        df['repo'] = repo_name
        df.to_json(repo_name + "-commits.json", orient='records', lines=True)


def build_start():
    list_dir = [i for i in os.listdir("./") if i.count("-starred_at.csv") > 0]
    for file in list_dir:
        repo_name = file.replace("-starred_at.csv", '')
        df = pd.read_csv(file)
        df['starred_at'] = df['starred_at'].str.replace('T', ' ')
        df['starred_at'] = df['starred_at'].str.replace('Z', '')
        df['repo'] = repo_name
        df.to_json(repo_name + "-starred_at.json", orient='records', lines=True)


def build_contribute():
    list_dir = [i for i in os.listdir("./") if i.count("-contributors.csv") > 0]
    for file in list_dir:
        repo_name = file.replace("-contributors.csv", '')
        df = pd.read_csv(file)
        df['repo'] = repo_name
        df.to_json(repo_name + "-contributors.json", orient='records', lines=True)


def merge_file(name):
    files = [i for i in os.listdir("./") if i.count(name + ".json") > 0]
    for file in files:
        f = open(file).readlines()
        s = ""
        for line in f:
            line = json.loads(line)
            line = list(line.values())
            line = json.dumps(line)
            s += line + '\n'
        jsonline_file = open("data/" + name + ".json", 'a+')
        jsonline_file.write(s)
        print('merge：' + file)


if __name__ == "__main__":
    build_commit()
    build_contribute()
    build_start()
    for name in ["commit", "contribute", "start"]:
        merge_file(name)
