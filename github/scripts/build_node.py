import sys
import os
import pandas as pd
import numpy as np
import json

def baidu2csv():
    f = open('location/BaiduMap_cityCenter.txt')
    baidu_city = json.load(f)
    f.close()
    city_g = pd.DataFrame()
    for municipality in baidu_city["municipalities"]:
        municipality = pd.DataFrame([municipality])
        city_g = pd.concat([city_g, municipality], ignore_index=True)
    for province in baidu_city["provinces"]:
        pro = {'n': province['n'], 'g': province['g']}
        pro = pd.DataFrame([pro])
        city_g = pd.concat([city_g, pro], ignore_index=True)
        for city in province['cities']:
            city = pd.DataFrame([city])
            city_g = pd.concat([city_g, city], ignore_index=True)
    for municipality in baidu_city["other"]:
        municipality = pd.DataFrame([municipality])
        city_g = pd.concat([city_g, municipality], ignore_index=True)
    city_g.to_csv('location/city_g.csv')


def pinyin2name():
    city_data = pd.read_csv('location/ok_data_level3.csv')
    pinyin_name = pd.DataFrame(city_data, columns=["name", "pinyin"])
    pinyin_name.drop_duplicates(inplace=True)
    pinyin_name.to_csv("location/pinyin_name.csv")


skip_words = [' ', 'city', 'province', 'china', '.']


def add_user_local(user_file):
    pinyin_name = pd.read_csv("location/pinyin_name.csv")
    pinyin_name = dict(zip(pinyin_name["pinyin"].values.tolist(), pinyin_name["name"].values.tolist()))
    city_g = pd.read_csv('location/city_g.csv')
    city_g = dict(zip(city_g["n"].values.tolist(), city_g["g"].values.tolist()))
    users = pd.read_csv(user_file)
    user_g = []
    match_num = 0
    null_num = 0
    not_match_num = 0
    for idx, user in users.iterrows():
        city = str(user['location'])
        city = city.split(',')[0].lower()
        for skip_word in skip_words:
            city = city.replace(skip_word, '')
        if city == "nan" or city == "":
            user_g.append("")
            null_num += 1
            continue
        if city in pinyin_name.keys():
            city_name = pinyin_name[city]
            g = city_g[city_name]
            user_g.append(g)
            match_num += 1
        elif u'\u4e00' <= city[0] <= u'\u9fa5' and city in city_g.keys():
            g = city_g[city]
            user_g.append(g)
            match_num += 1
        else:
            user_g.append("")
            not_match_num += 1
    users['d'] = pd.DataFrame(user_g, columns=['d'])
    print("match_num:", match_num, "not_match_num:", not_match_num, "null_num:", null_num)
    users.to_csv(user_file + "with_g")


def first():
    nodes = {'login': [], 'id': [], 'node_id': [], 'avatar_url': [], 'url': []}
    start_edges = {"user_name": [], "repo": []}
    follow_edges = {"following": [], "followed": []}
    repos = []
    list_dir = os.listdir("./")
    for f in list_dir:
        if f.count("-users.csv") != 0:
            repo_name = f[0:f.find("-users.csv")]
        elif f.count("-contributors.csv") != 0:
            repo_name = f[0:f.find("-contributors.csv")]
        else:
            continue
        print(f)
        repos.append(repo_name)
        df = pd.read_csv(f)
        user_names = list(df["login"])
        start_edges["user_name"].extend(user_names)
        start_edges["repo"].extend([repo_name] * len(user_names))
        for raw_name in nodes.keys():
            if raw_name in df.keys():
                nodes[raw_name].extend(df[raw_name])

    df_node = pd.DataFrame(nodes)
    df_node.drop_duplicates(subset=['node_id', 'id'], inplace=True)

    list_dir = ["./following/" + i for i in os.listdir("./following")]
    for f in list_dir:
        if os.stat(f).st_size == 0:
            continue
        df = pd.read_csv(f)
        user_name = f.split('/')[-1].split('.')[0]
        follow_edges["followed"].extend(df["login"])
        follow_edges["following"].extend([user_name] * len(df["login"]))
        for raw_name in nodes.keys():
            if raw_name in df.keys():
                nodes[raw_name].extend(df[raw_name])
    list_dir = ["./followers/" + i for i in os.listdir("./followers")]
    for f in list_dir:
        if os.stat(f).st_size == 0:
            continue
        df = pd.read_csv(f)
        user_name = f.split('/')[-1].split('.')[0]
        follow_edges["following"].extend(df["login"])
        follow_edges["followed"].extend([user_name] * len(df["login"]))
        for raw_name in nodes.keys():
            if raw_name in df.keys():
                nodes[raw_name].extend(df[raw_name])
    df = pd.DataFrame(nodes)
    df.drop_duplicates(subset=['node_id', 'id'], inplace=True)
    df.to_csv('user-small.csv')
    df = pd.DataFrame(start_edges)
    df.drop_duplicates(inplace=True)
    df.to_csv('./data/start-detailed.csv')
    df = pd.DataFrame(follow_edges)
    df.drop_duplicates(inplace=True)
    df.to_csv('./data/follow-detailed.csv')

    list_dir = os.listdir("repos/")
    repos = pd.DataFrame()
    repo = pd.DataFrame()
    for f in list_dir:
        repo = pd.read_csv("repos/" + f)
        ts = repo["created_at"].tolist()
        repo["created_at"] = [t.replace('T', ' ').replace('Z', '') for t in ts]
        repos = pd.concat([repos, repo])
    repos.to_csv("./data/repos-detailed.csv")


def merge():
    list_dir = [i for i in os.listdir("./") if i.count("with_g") > 0]
    print(list_dir)
    small_file = pd.read_csv("./user-small.csv", index_col=0)
    full_files = pd.DataFrame()
    for file in list_dir:
        full_file = pd.read_csv(file, index_col=0)
        full_files = pd.concat([full_files, full_file])
        print(len(full_files))
    for val in full_files.keys():
        if val in small_file.keys():
            continue
        small_file[val] = np.nan
    res = pd.concat([small_file, full_files])
    res.drop_duplicates(subset=['node_id', 'id'], inplace=True, keep='last')

    ts = res["created_at"].tolist()
    n_ts = []
    for i in ts:
        if type(i) == float:
            n_ts.append(i)
        else:
            n_ts.append(i.replace('T', ' ').replace('Z', ''))
    res["created_at"] = n_ts
    lng_lats = res["d"].tolist()
    n_lng = []
    n_lat = []
    for i in lng_lats:
        if type(i) == float:
            n_lng.append(i)
            n_lat.append(i)
        else:
            n_lng.append(i.split(',')[0])
            n_lat.append(i.split(',')[1].split('|')[0])
    res["lng"] = n_lng
    res["lat"] = n_lat
    res.to_csv("data/users.csv")


if __name__ == "__main__":
    first()
    for file in [_ for _ in os.listdir('./') if _.count("-users-detailed.csv") > 0]:
        add_user_local(file)
    merge()
