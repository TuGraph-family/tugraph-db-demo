#!/bin/bash

#start_year=2019
#end_year=2022
#url_prefix="https://zenodo.org/record/7923702/files/"

download_single_file() {
  year=$1
  month=$2
  url_prefix="https://zenodo.org/record/7923702/files/"
  # Get the number of days in the current month
  num_days=$(cal "$month" "$year" | awk 'NF {DAYS = $NF}; END {print DAYS}')

  # Get the start and end day of the current month
  start_day=$(date -d "$year-$month-01" +"%Y%m%d")
  end_day=$(date -d "$year-$month-$num_days" +"%Y%m%d")

  if $year -eq 2021 && $month -eq 5;
  then
    end_day=30
  fi

  # Concatenate the start and end day with an underscore in between
  date_range="${start_day}_${end_day}"

  echo "Month: $month Year: $year"
  echo "Date Range: $date_range"
  file_name="flightlist_${date_range}.csv"

  wget "${url_prefix}${file_name}.gz?download=1" -O "${file_name}.gz"
  gunzip -c "${file_name}.gz" > "${file_name}"
  sed -i "1d" "${file_name}"
  echo
}

download_specific_month() {
  month=$1
  for year in {2019..2022}; do
    download_single_file "$year" "$month"
  done
}

export -f download_single_file
export -f download_specific_month

parallel -k download_specific_month ::: {1..12}