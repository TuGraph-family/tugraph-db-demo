
import json
import sys
import argparse
import csv
import random
from math import sin, cos, sqrt, atan2, radians
from datetime import datetime

def calculate_distance(lat1, lon1, alt1, lat2, lon2, alt2):
    # approximate radius of the earth in km
    R = 6371.0

    # convert latitude and longitude from degrees to radians
    lat1_rad = radians(float(lat1))
    lon1_rad = radians(float(lon1))
    lat2_rad = radians(float(lat2))
    lon2_rad = radians(float(lon2))

    # calculate the differences in latitude, longitude, and altitude
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    float_alt1 = 0.
    float_alt2 = 0.
    try:
        if alt1 != "":
            float_alt1 = float(alt1)
        if alt2 != "":
            float_alt2 = float(alt2)
    except ValueError:
        print("alt1 = ", alt1, ", alt2 = ", alt2)
        sys.exit()

    dalt = float_alt2 - float_alt1

    # apply Haversine formula to calculate the distance
    a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c

    # calculate the straight-line distance including altitude in km
    straight_distance = sqrt(distance**2 + dalt**2)

    return straight_distance

# calculate time difference in seconds
def calculate_time_diff(end_timestamp, start_timestamp):
    start_time = datetime.strptime(start_timestamp, "%Y-%m-%d %H:%M:%S")
    end_time = datetime.strptime(end_timestamp, "%Y-%m-%d %H:%M:%S")
    time_diff = (end_time - start_time).total_seconds()
    return int(time_diff)

'''
airport file has 14 columns, example:
3387,
"Ningbo Lishe International Airport",
"Ninbo",
"China",
"NGB",
"ZSNB",
29.82670021057129,
121.46199798583984,
13,
8,
"U",
"Asia/Shanghai",
"airport",
"OurAirports"
'''
def load_airports(airport_file='airports-extended.dat'):
    with open(airport_file, "r") as file:
        reader = csv.reader(file)
        num_airports = 0
        airport_list = []
        airport_city_list = []
        airport_country_list = []
        airport_code_list = []
        airport_latitude_list = []
        airport_longitude_list = []
        for row in reader:
            if len(row) != 14:
                # print(row)
                continue
            airport_name = row[1]
            city_name = row[2]
            if airport_name == "" or city_name == "":
                # print("empty city name or airport name: ", row)
                continue
            # if city_name in city_list:
            airport_name = row[1].replace(',', ' ').rstrip().lstrip()
            city_name = row[2].replace(',', ' ').rstrip().lstrip()
            country_name = row[3].replace(',', ' ').rstrip().lstrip()
            airport_code = row[5]

            airport_list.append(airport_name)
            airport_city_list.append(city_name)
            airport_country_list.append(country_name)
            airport_code_list.append(airport_code)
            airport_latitude_list.append(row[6])
            airport_longitude_list.append(row[7])
            num_airports += 1
        print("num_airports = ", num_airports)

        airport_info = [airport_list, airport_city_list, airport_country_list, airport_code_list,
                        airport_latitude_list, airport_longitude_list]
        return airport_info

'''
flight file has 16 columns:
0. callsign,
1. number,
2. icao24,
3. registration,
4. typecode,
5. origin,
6. destination,
7. firstseen,
8. lastseen,
9. day,
10. latitude_1,
11. longitude_1,
12. altitude_1,
13. latitude_2,
14. longitude_2,
15. altitude_2

flight info needed:
{
    "origin": "英文城市名称",
    "destination": "英文城市名称",
    "time":"耗时",
    "cost":"花费",
    "origin_airport":"起点机场",
    "destination_airport":"终点点机场",
    "flight_number": "航班号",
    "flight_type": "飞机机型",
    "start_time": "起飞时刻",
    "end_time": "落地时刻"
}

return: [(src_city_name, dst_city_name,
          src_airport_name, dst_airport_name,
          src_country_name, dst_country_name,
          distance, time_cost
          original flight info in flight file)]
'''
def grep_flights(airport_info, flight_file='flightlist.csv', edge_file='./edge_list'):
    airport_list = airport_info[0]
    airport_city_list = airport_info[1]
    airport_country_list = airport_info[2]
    airport_code_list = airport_info[3]
    airport_latitude_list = airport_info[4]
    airport_longitude_list = airport_info[5]
    flight_info_list = []
    with open(flight_file, "r") as file:
        with open(edge_file, "w+") as edge_file:
            reader = csv.reader(file)
            num_flights = 0
            for row in reader:
                if len(row) != 16:
                    print(row)
                    continue
                if row[0] == "" or row[4] == "":
                    continue
                if row[5] == "" or row[6] == "" or row[7] == "" or row[8] == ""\
                        or row[10] == "" or row[11] == "" or row[13] == "" or row[14] == "":
                    # print(row)
                    continue

                src_airport_code = row[5]
                dst_airport_code = row[6]
                if src_airport_code == dst_airport_code:
                    continue
                if src_airport_code in airport_code_list and dst_airport_code in airport_code_list:
                    src_airport_index = airport_code_list.index(src_airport_code)
                    dst_airport_index = airport_code_list.index(dst_airport_code)
                    if airport_city_list[src_airport_index] == airport_city_list[dst_airport_index]:
                        continue

                    if row[12] == "":
                        row[12] = "0."
                    if row[15] == "":
                        row[15] = "0."
                    distance = calculate_distance(row[10], row[11], row[12], row[13], row[14], row[15])
                    cost = distance * random.uniform(0.5, 1.5)
                    formatted_cost = int(cost)

                    row[7] = row[7][:-6]
                    row[8] = row[8][:-6]
                    row[9] = row[9][:10]

                    start_time = datetime.strptime(row[7], "%Y-%m-%d %H:%M:%S").timestamp()
                    start_time = int(start_time)
                    end_time = datetime.strptime(row[8], "%Y-%m-%d %H:%M:%S").timestamp()
                    end_time = int(end_time)
                    time_diff = end_time - start_time

                    if float(formatted_cost) == 0.:
                        print("cost is zero, formatted_cost = ", formatted_cost)
                        continue
                    if time_diff == 0.:
                        print("time_diff = ", time_diff)

                    flight_info = [airport_city_list[src_airport_index], airport_city_list[dst_airport_index],
                                   airport_list[src_airport_index], airport_list[dst_airport_index],
                                   airport_country_list[src_airport_index], airport_country_list[dst_airport_index],
                                   str(start_time), str(end_time),
                                   str(formatted_cost), str(time_diff)]
                    flight_info += row
                    if len(flight_info) != 26:
                        continue
                    edge_file.write(','.join(flight_info))
                    edge_file.write('\n')
                    num_flights += 1
                    if num_flights % 1000000 == 0:
                        print("processed num_flights = ", num_flights)

def dump_vertex(airport_info, vertex_file):
    city_list = airport_info[1]
    city_set = set(city_list)
    # print("city_list.size = ", len(city_list))
    # print("city_set.size = ", len(city_set))
    with open(vertex_file, "w+") as file:
        for vertex in city_set:
            file.write(vertex + "\n")

def dump_edge(edge_list, edge_file):
    with open(edge_file, "w+") as file:
        for edge in edge_list:
            file.write(','.join(edge))
            file.write("\n")

if __name__ == '__main__':
    # parse arguments
    ap = argparse.ArgumentParser(description='flight demo convert manager',
                                 formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    ap.add_argument('-a', dest='airport_file', action='store', help='airport file path',
                    default='airports-extended.dat')
    ap.add_argument('-f', dest='flight_file', action='store', help='flight file path',
                    default='flightlist.csv')
    ap.add_argument('-v', dest='vertex_file', action='store', help='output vertex file',
                    default='./vertex_list')
    ap.add_argument('-e', dest='edge_file', action='store', help='output edge file',
                    default='./edge_list')
    args = ap.parse_args()

    airport_info = load_airports(args.airport_file)
    dump_vertex(airport_info, args.vertex_file)
    grep_flights(airport_info, args.flight_file, args.edge_file)
