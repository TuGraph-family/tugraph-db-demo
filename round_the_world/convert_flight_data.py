import csv
import sys

# Check if the correct number of command line arguments is provided
if len(sys.argv) != 2:
    print("Usage: python script.py filename.csv")
    sys.exit(1)

# Get the filename from the command line argument
filename = sys.argv[1]

# Open the CSV file
try:
    with open(filename, 'r') as file:
        # Create a CSV reader object
        reader = csv.reader(file)

        # Iterate over each row in the CSV file
        for row in reader:
            # Access the values in each column
            column1 = row[0]
            column2 = row[1]
            # Print the values or perform any desired operations
            print(column1, column2)
except FileNotFoundError:
    print("File not found: ", filename)
    sys.exit(1)

import csv
import sys

if len(sys.argv) != 3:
    print("Usage: python convert_flight_data.py input.csv output_edges")
    sys.exit(1)

file_path = 'path/to/your/file.txt'

with open(file_path, 'r') as file:
    lines = file.readlines()

print("Lines read from the file:")
for line in lines:
    print(line.strip())

input_csv_path = sys.argv[1]
output_file_path = sys.argv[2]

def read_cities(cities_file="./cities"):
    with open(cities_file, "r") as file:
        lines = file.readlines()
        return lines

'''
csv columns:
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
'''
def read_flights(flight_file="./flights"):
    with open(flight_file, "r") as file:
        reader = csv.reader(file)
        for row in reader:
            origin = row[]

'''
csv columns:
0. registration
1. typecode
2. origin
3. destination
4. firstseen
5. lastseen
6. day
7. latitude_1
8. longitude_1
9. altitude_1
10. latitude_2
11. longitude_2
12. altitude_2
'''

try:
    with open(filename, "r") as file:
        reader = csv.reader(file)
        for row in reader:
            pass


from geopy.distance import geodesic

# Define the latitude and longitude coordinates of the two points
point1 = (latitude1, longitude1)
point2 = (latitude2, longitude2)

# Calculate the distance between the two points
distance = geodesic(point1, point2).kilometers

# Print the distance
print("The distance is", distance, "kilometers.")

from math import sin, cos, sqrt, atan2, radians

def calculate_distance(lat1, lon1, alt1, lat2, lon2, alt2):
    # approximate radius of the earth in km
    R = 6371.0

    # convert latitude and longitude from degrees to radians
    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    # calculate the differences in latitude, longitude, and altitude
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    dalt = alt2 - alt1

    # apply Haversine formula to calculate the distance
    a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c

    # calculate the straight-line distance including altitude
    straight_distance = sqrt(distance**2 + dalt**2)

    return straight_distance

# test the function
lat1 = 52.5200
lon1 = 13.4050
alt1 = 34
lat2 = 48.8566
lon2 = 2.3522
alt2 = 67

distance = calculate_distance(lat1, lon1, alt1, lat2, lon2, alt2)
print(f"The distance between the two points is {distance:.2f} km.")

from datetime import datetime

timestamp = '2019-07-01 00:13:28+00:00'

# Remove the colon from the offset
timestamp_without_colon = timestamp[:-3] + timestamp[-2:]

# Parse the timestamp without the colon
datetime_obj = datetime.strptime(timestamp_without_colon, '%Y-%m-%d %H:%M:%S%z')

print(datetime_obj)

start_time = datetime.strptime(start_timestamp, '%Y-%m-%d %H:%M:%S')
end_time = datetime.strptime(end_timestamp, '%Y-%m-%d %H:%M:%S')

# Calculate time difference
time_difference = end_time - start_time

# Print the time difference
print('Time cost:', time_difference)

'''
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

Sydney,
Amsterdam,
Sydney Kingsford Smith International Airport,
Amsterdam Airport Schiphol,
Australia,
Netherlands,
16660.63212398358,
-97247.0,
CES771,
MU771,
781602,
,
,
YSSY,
EHAM,
2019-06-30 01:09:12,
2019-07-01 04:09:59,
2019-07-01,
-33.956314086914055,
151.1786013233418,
0.0,
52.31605911254883,
4.741401672363281,

'''

if __name__ == '__main__':
    '''
    Examples:
    $ python lgraph_plugin.py -c Load -n "scanx" -p "./scan_graph.so" -r 1 -d "get the number of vertice and edges" -a "0.0.0.0:7076"
    INFO:root:LoadPlugin: code=200, text=

    $ python lgraph_plugin.py -c List -a "0.0.0.0:7076"
    INFO:root:ListPlugin: code=200, text={"plugins":[{"description":"get the number of vertice and edges","name":"scanx","read_only":true}]}

    $ python lgraph_plugin.py -c Remove -n "scanx" -a "0.0.0.0:7076"
    INFO:root:DelPlugin: code=200, text=

    # call plugin
    $ curl -XPOST http://{ip}:{port}/db/cpp_plugin/scanx -H 'Accept:application/json' -H 'Content-Type:application/json' \
            -d '{"data":"{\"scan_edges\":true,\"times\":1}"}'
    '''
    # parse arguments
    ap = argparse.ArgumentParser(description='TuGraph CPP Plugin Manager',
                                 formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    ap.add_argument('-c', dest='command', action='store', default='Load',
                    choices=['Load', 'Remove', 'List'], help='command type')
    ap.add_argument('-n', dest='name', action='store', help='plugin name')
    ap.add_argument('-p', dest='path', action='store', default='', help='the url of plugin file')
    ap.add_argument('-r', dest='read_only', action='store', type=int, default=1,
                    choices=[0, 1], help='1 if plugin is read only, 0 otherwise')
    ap.add_argument('-d', dest='description', action='store', default='', help='plugin description')
    ap.add_argument('-a', dest='address', action='store', default=default_addr, help='server address')
    args = ap.parse_args()
    command = args.command
    name = args.name
    path = args.path
    description = args.description
    address = args.address
    if args.read_only == 0:
        read_only = False
    else:
        read_only = True
    # login
    Login(address)
    if command == 'Load':
        LoadPlugin(name, path, read_only, description, True, address)
    elif command == 'Remove':
        DelPlugin(name, True, address)
    elif command == 'List':
        ListPlugin(True, address)