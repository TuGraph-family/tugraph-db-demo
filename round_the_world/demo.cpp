//
// Created by clk on 2023/7/27.
//

#include "lgraph/olap_on_db.h"
#include "lgraph/lgraph_utils.h"
#include "tools/json.hpp"
#include <ctime>
#include <boost/sort/sort.hpp>

using namespace lgraph_api;
using namespace lgraph_api::olap;
using json = nlohmann::json;

const int TOLERANT_TIME = 7200; // seconds
const int RESULT_LIMIT = 10;

int calculateTimeDifference(const std::string& startStr, const std::string& endStr) {
    // Parse the datetime strings into std::tm structures
    std::tm startTm = {};
    std::tm endTm = {};

    strptime(startStr.c_str(), "%Y-%m-%d %H:%M:%S", &startTm);
    strptime(endStr.c_str(), "%Y-%m-%d %H:%M:%S", &endTm);

    // Convert std::tm structures to time_t objects
    time_t start = mktime(&startTm);
    time_t end = mktime(&endTm);

    // Calculate the time difference in seconds
    double diffSeconds = difftime(end, start);

    return int(diffSeconds);
}

int date_to_seconds(std::string& date_string) {
    std::tm tm = {};
    strptime(date_string.c_str(), "%Y-%m-%d", &tm);
    std::time_t time = std::mktime(&tm);
    std::chrono::system_clock::time_point datePoint = std::chrono::system_clock::from_time_t(time);
    std::chrono::seconds seconds = std::chrono::duration_cast<std::chrono::seconds>(
        datePoint.time_since_epoch());
    int secondsCount = seconds.count();

    return secondsCount;
}

struct Flight {
    std::string origin_;
    std::string destination_;
    int start_time_seconds_;
    int end_time_seconds_;
    int time_cost_;
    int money_cost_;
    std::string origin_airport_;
    std::string destination_airport_;
    std::string flight_number_;
    std::string flight_type_;
    std::string start_time_;
    std::string end_time_;

    Flight() {}

    Flight(std::string origin, std::string destination,
           int start_time_seconds, int end_time_seconds,
           int time_cost, int money_cost,
           std::string origin_airport, std::string destination_airport,
           std::string flight_number, std::string flight_type,
           std::string start_time, std::string end_time) :
        origin_(origin), destination_(destination),
        start_time_seconds_(start_time_seconds), end_time_seconds_(end_time_seconds),
        time_cost_(time_cost), money_cost_(money_cost),
        origin_airport_(origin_airport), destination_airport_(destination_airport),
        flight_number_(flight_number), flight_type_(flight_type),
        start_time_(start_time), end_time_(end_time) {}

    json ToJson() {
        json j;
        j["origin"] = origin_;
        j["origin_airport"] = origin_airport_;
        j["destination"] = destination_;
        j["destination_airport"] = destination_airport_;
        j["time"] = time_cost_;
        j["cost"] = money_cost_;
        j["flight_number"] = flight_number_;
        j["flight_type"] = flight_type_;
        j["start_time"] = start_time_;
        j["end_time"] = end_time_;
        return j;
    }
};

struct Path {
    int id_;
    int time_cost_;
    int money_cost_;
    std::vector<Flight*> flight_ptrs_;
    std::set<std::string> cities_;

    Path() : id_(0), time_cost_(0), money_cost_(0) {}

    void update() {
        time_cost_ = 0;
        money_cost_ = 0;
        if (flight_ptrs_.empty()) {
            return;
        }
        for (auto ptr : flight_ptrs_) {
            time_cost_ += ptr->time_cost_;
            money_cost_ += ptr->money_cost_;
        }
//        time_cost_ = flight_ptrs_.back()->end_time_seconds_ -
//            flight_ptrs_[0]->start_time_seconds_;
    }

    json ToJson() {
        update();

        json j;
        j["id"] = id_;
        j["cost"] = money_cost_;
        j["time"] = time_cost_;
        std::vector<json> flights_json;
        for (auto ptr : flight_ptrs_) {
            flights_json.push_back(ptr->ToJson());
        }
        j["paths"] = flights_json;
        return j;
    }

    bool Append(Flight* flight, int interval_seconds = 0) {
        if (flight_ptrs_.size() == 0) {
            cities_.insert(flight->origin_);
            cities_.insert(flight->destination_);
            flight_ptrs_.push_back(flight);
            return true;
        } else {
            if (cities_.find(flight->destination_) == cities_.end()) {
                cities_.insert(flight->destination_);
                flight_ptrs_.push_back(flight);
                return true;
            } else {
                return false;
            }
        }
    }

    void Copy(Path& path) {
        id_ = path.id_;
        time_cost_ = path.time_cost_;
        money_cost_ = path.money_cost_;
        flight_ptrs_ = path.flight_ptrs_;
        cities_ = path.cities_;
    }
};

struct Result {
    std::vector<Path> paths;

    void Append(Path& path) {
        paths.push_back(path);
    }
};

bool compare_flight(const Flight& a, const Flight& b) {
    return calculateTimeDifference(a.start_time_, b.start_time_) > 0;
}

int binarySearch(const std::vector<Flight>& sortedFlights, const Flight* flight, int interval,
                 int left, int right) {
    int check_time = flight->end_time_seconds_ + interval;
    int mid = left;
    while (left <= right) {
        mid = left + (right - left) / 2;
        if (mid == 0 || mid == sortedFlights.size() - 1) {
            return mid;
        }

        if (sortedFlights[mid].start_time_seconds_ < check_time) {
            left = mid + 1;
        } else if (sortedFlights[mid - 1].start_time_seconds_ > check_time) {
            right = mid - 1;
        } else {
            return mid;
        }
    }
    return mid;
}

void print_degree(GraphDB&& db) {
    auto txn = db.CreateReadTxn();
    auto num_vertices = txn.GetNumVertices();
    auto vit = txn.GetVertexIterator();
    std::vector<std::pair<size_t, std::string>> vertex_degree;
    for (size_t vid = 0; vid < num_vertices; vid++) {
        vit.Goto(vid);
        std::string name = vit.GetField("name").AsString();
        auto degree = vit.GetNumOutEdges();
        vertex_degree.push_back(std::make_pair(degree, name));
    }
    std::sort(vertex_degree.rbegin(), vertex_degree.rend());
    for (auto ele : vertex_degree) {
        std::cout << ele.second << ", " << ele.first << std::endl;
    }
}

void check_sorted(GraphDB&& db) {
    auto txn = db.CreateReadTxn();
    auto num_vertices= txn.GetNumVertices();
    auto vit = txn.GetVertexIterator();
    for (size_t vid = 0; vid < num_vertices; vid++) {
        vit.Goto(vid);
        size_t prev = 0;
        if (vid < 100)
            std::cout << "==== vid = " << vid << " ====" << std::endl;
        for (auto eit = vit.GetOutEdgeIterator();eit.IsValid(); eit.Next()) {
            auto start_time_seconds = eit.GetField("start_time_seconds").AsInt64();
            if (start_time_seconds >= prev) {
                prev = start_time_seconds;
            } else {
                std::cout << "vid = " << vid << ", prev = " << prev
                          << ", start_time_seconds = " << start_time_seconds << std::endl;
            }
            if (vid < 100) {
                std::cout << "start_time_seconds = " << start_time_seconds << std::endl;
            }
        }
    }
}

void check_edges(GraphDB& db) {
    auto txn = db.CreateReadTxn();
    auto num_vertices = txn.GetNumVertices();
    auto vit = txn.GetVertexIterator();
    for (size_t vid = 0; vid < num_vertices; vid++) {
        vit.Goto(vid);
        auto src_name = vit.GetField("name").AsString();
        if (src_name == "") {
            std::cout << "Error: src_name is empty" << std::endl;
        }
        for (auto eit = vit.GetOutEdgeIterator(); eit.IsValid(); eit.Next()) {
            auto dst = eit.GetDst();
            auto src_airport_name = eit.GetField("src_airport_name").AsString();
            if (src_airport_name == "") {
                std::cout << "Error: src_airport is empty" << std::endl;
            }

            auto dst_airport_name = eit.GetField("dst_airport_name").AsString();
            if (dst_airport_name == "") {
                std::cout << "Error: dst_airprot is empty" << std::endl;
            }
            if (src_airport_name == dst_airport_name) {
                std::cout << "src and dst airport is equal: " << src_airport_name << ", " << dst_airport_name << std::endl;
            }

            auto src_country_name = eit.GetField("src_country_name").AsString();
            if (src_country_name == "") {
                std::cout << "src_country_name is empty" << std::endl;
            }

            auto dst_country_name = eit.GetField("dst_country_name").AsString();
            if (dst_country_name == "") {
                std::cout << "dst_country_name is empty" << std::endl;
            }

            auto start_time_seconds = eit.GetField("start_time_seconds").AsInt64();
            if (start_time_seconds == 0) {
                std::cout << "start_time_seconds is 0" << std::endl;
            }

            auto end_time_seconds = eit.GetField("end_time_seconds").AsInt64();
            if (end_time_seconds == 0) {
                std::cout << "end_time seconds is 0" << std::endl;
            }
            if (end_time_seconds <= start_time_seconds) {
                std::cout << "start_time_seconds is larger than end_time_seconds: " << start_time_seconds
                          << ", " << end_time_seconds << std::endl;
            }

            auto money_cost = eit.GetField("money_cost").AsDouble();
            if (money_cost == 0.) {
                std::cout << "money_cost is 0" << std::endl;
            }

            auto time_cost = eit.GetField("time_cost").AsInt64();
            if (time_cost == 0) {
                std::cout << "time_cost is 0" << std::endl;
            }

            auto callsign = eit.GetField("callsign").AsString();
            if (callsign == "") {
                std::cout << "callsign is empty" << std::endl;
            }

            auto typecode = eit.GetField("typecode").AsString();
            if (typecode == "") {
                std::cout << "typecode is empty" << std::endl;
            }

            auto src_airport_code = eit.GetField("src_airport_code").AsString();
            auto dst_airport_code = eit.GetField("dst_airport_code").AsString();
            auto firstseen = eit.GetField("firstseen").ToString();
            if (firstseen == "") {
                std::cout << "firstseen is empty" << std::endl;
            }

            auto lastseen = eit.GetField("lastseen").ToString();
            if (lastseen == "") {
                std::cout << "lastseen is empty" << std::endl;
            }
        }
    }
}

extern "C" bool Process(GraphDB& db, const std::string& request, std::string& response) {
    auto start_time = get_time();

    std::vector<std::string> cities;
    int interval = 6;
    std::string start_day = "2019-01-01";
    std::string end_day = "2022-12-31";
    try {
        json input = json::parse(request);
        parse_from_json(cities, "cities", input);
        parse_from_json(interval, "interval", input);
        parse_from_json(start_day, "start_day", input);
        parse_from_json(end_day, "end_day", input);
    } catch (std::exception& e) {
        response = "request = " + request + "\njson parse error: " + std::string(e.what());
        std::cout << response << std::endl;
        return false;
    }

//    print_degree(db);
//    check_sorted(db);
//    check_edges(db);

    int start_seconds = date_to_seconds(start_day);
    int end_seconds = date_to_seconds(end_day) + 3600 * 24;

    auto txn = db.CreateReadTxn();

    std::vector<size_t> city_vids;
    std::unordered_map<size_t, int > vid_to_index;
    std::unordered_map<std::string, int> city_to_index;

    for (int index = 0; index < cities.size(); index++) {
        auto city = cities[index];
        auto vid = txn.GetVertexByUniqueIndex("city", "name", city).GetId();
        city_vids.push_back(vid);
        vid_to_index.insert(std::make_pair(vid, index));
        city_to_index.insert(std::make_pair(city, index));
    }

    auto vit = txn.GetVertexIterator();
    std::vector<std::vector<Flight>> all_flights(city_vids.size());

//    OlapBase<Empty> graph;
//    graph.ProcessVertexInRange<int>(
//        [&] (size_t v) {
//            auto thread_txn = db.ForkTxn(txn);
//            auto vit = txn.GetVertexIterator();
//            auto city_index = v;
        for (auto city_index = 0; city_index < city_vids.size(); city_index++) {
            auto vid = city_vids[city_index];
            vit.Goto(vid);
            for (auto eit = vit.GetOutEdgeIterator(); eit.IsValid(); eit.Next()) {
                size_t dst = eit.GetDst();
                if (dst == vid) continue;
                auto start_time_seconds = eit.GetField("start_time_seconds").AsInt64();
                if (start_time_seconds < start_seconds) {
                    continue;
                } else if (start_time_seconds > end_seconds) {
                    break;
                }
                if (std::find(city_vids.begin(), city_vids.end(), dst) == city_vids.end()) {
                    continue;
                }
                auto dst_index = vid_to_index[dst];
                Flight flight;
                flight.origin_ = cities[city_index];
                flight.destination_ = cities[dst_index];
                flight.start_time_seconds_ = eit.GetField("start_time_seconds").AsInt64();
                flight.end_time_seconds_ = eit.GetField("end_time_seconds").AsInt64();
                flight.time_cost_ = eit.GetField("time_cost").AsInt64();
                flight.money_cost_ = eit.GetField("money_cost").AsInt64();
                flight.origin_airport_ = eit.GetField("src_airport_name").string();
                flight.destination_airport_ = eit.GetField("dst_airport_name").string();
                flight.flight_number_ = eit.GetField("callsign").AsString();
                flight.flight_type_ = eit.GetField("typecode").AsString();
                flight.start_time_ = eit.GetField("firstseen").ToString();
                flight.end_time_ = eit.GetField("lastseen").ToString();

                all_flights[city_index].push_back(flight);
            }
//            std::sort(all_flights[city_index].begin(), all_flights[city_index].end(), compare_flight);
            std::cout << "city_name = " << cities[city_index] << ", flight_num = " << all_flights[city_index].size() << std::endl;
        }
//            return 0;
//        },
//        0, city_vids.size()
//        );

    auto grep_time = get_time();
    std::cout << "grep_graph_time = " << grep_time - start_time << "(s)" << std::endl;

    double min_interval_seconds = interval * 3600;
    double max_interval_seconds = min_interval_seconds + TOLERANT_TIME;

    std::vector<Path> paths;
    for (auto& vid_flights : all_flights) {
        for (auto& flight : vid_flights) {
            Path path;
            path.Append(&flight);
            paths.push_back(path);
        }
    }

    std::vector<Path> result;
    while (!paths.empty()) {
        auto path = paths.back();
        paths.pop_back();
        if (path.flight_ptrs_.size() == cities.size() - 1) {
            result.push_back(path);
            continue;
        }
        if (path.flight_ptrs_.size() < cities.size() - 1) {
            auto last_flight = path.flight_ptrs_.back();
            auto src = last_flight->destination_;
            auto index = city_to_index[src];

            // find first element whose start_time is larger than last_flight's end_time;
            int start_index = binarySearch(all_flights[index], last_flight, min_interval_seconds,
                                           0, all_flights[index].size() - 1);
            int end_index = binarySearch(all_flights[index], last_flight, max_interval_seconds,
                                         start_index, all_flights[index].size() - 1);

            for (int i = start_index; i < end_index; i++) {
                Flight* flight = &(all_flights[index][i]);
                Path new_path = path;
                if (new_path.Append(flight, interval)) {
                    if (new_path.flight_ptrs_.size() == cities.size() - 1) {
                        result.push_back(new_path);
                    } else {
                        paths.push_back(new_path);
                    }
                }
            }
        }
    }
    std::cout << "result.size = " << result.size() << std::endl;

    std::vector<int> cost_first_index(result.size());
    std::vector<int> time_first_index(result.size());
    for (int i =0; i < result.size(); i++) {
        cost_first_index[i] = i;
        time_first_index[i] = i;
        result[i].update();
    }

    std::sort(cost_first_index.begin(), cost_first_index.end(), [&] (const int& left, const int& right) {
        return result[left].money_cost_ < result[right].money_cost_;
    });
    std::sort(time_first_index.begin(), time_first_index.end(), [&] (const int& left, const int& right) {
        return result[left].time_cost_ < result[right].time_cost_;
    });

    if (result.size() > RESULT_LIMIT) {
        cost_first_index.resize(RESULT_LIMIT);
        time_first_index.resize(RESULT_LIMIT);
    }

    std::vector<json> cost_first_data;
    for (int i = 0; i < cost_first_index.size(); i++) {
        int index = cost_first_index[i];
        result[index].id_ = i;
        cost_first_data.push_back(result[index].ToJson());
    }
    std::vector<json> time_first_data;
    for (int i = 0; i < time_first_index.size(); i++) {
        int index = time_first_index[i];
        result[index].id_ = i;
        time_first_data.push_back(result[index].ToJson());
    }

    double total_cost = get_time() - start_time;

    json output;
    output["cost_first_data"] = cost_first_data;
    output["time_first_data"] = time_first_data;
    output["num_flights"] = 32819145;
    output["num_paths"] = result.size();
    output["total_time"] = total_cost;

    response = output.dump();

    return true;
}