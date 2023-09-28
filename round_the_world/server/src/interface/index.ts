import { LineLayerProps, TextLayerProps } from '@antv/larkmap';

export type PointData = {
  cityname_en: string;
  cityname_zh: string;
  countryname_en: string;
  countryname_zh: string;
  lat: number;
  lon: number;
  scenics: { desc: string; name_en: string; name_zh: string }[];
};
export type PathData = {
  origin: string;
  destination: string;
  time: string;
  cost: string;
  origin_airport: string;
  destination_airport: string;
  flight_number: string;
  flight_type: string;
  start_time: string;
  end_time: string;
};
export type FlightData = {
  id?: number;
  cost?: number;
  time?: number;
  paths: PathData[];
};
export type FlightMapData = {
  line_id: number;
  line_name: string;
  lnglat: [[number, number], [number, number]];
};
export type ListItem = {
  progress: number; // 进度
  price: number; // 航班价格
  duration: string | number; // 航班时长
  start: string; // 起点
  end: string; // 终点
  selected: boolean; // 选中状态
  optimal: boolean; // 最优状态
  longestTime?: number;
  key?: number | string;
  id?: any;
} & FlightData &
  PathData;

export type ConfigType = {
  flightViewVisible: boolean;
  flightDetailsVisible: boolean;
  mapMaskVisible: boolean;
  loadedImages: boolean;
  flightInfoVisible: boolean;
  pointData: PointData[];
  lineLayerOptions: Omit<LineLayerProps, 'source'>;
  planeLayerOptions: Omit<LineLayerProps, 'source'>;
  dashLineLayerOptions: Omit<LineLayerProps, 'source'>;
  textLayerOption: Omit<TextLayerProps, 'source'>;
  selectPoint: PointData[];
  source?: any;
  selectSource?: any;
  queryList: any[];
  selectFlight: any;
  currentStep: number;
  citySource: any;
  selectedCitySource: any;
  loading: boolean;
  calculationDetailsVisible: boolean;
  sortType: string;
  token: string;
  isStart: boolean;
  isClose: boolean;
  needRenderText: number;
};

export type TreeProp = {
  selectedCity: PointData[];
  onSelect: (val: PointData) => void;
  list: ListItem[];
  getFlightList?: () => void;
  onSelectPath: (item: ListItem) => void;
  onStart: (val: PointData) => void;
  flightViewVisible: boolean;
  setConfigType: (value: Partial<ConfigType>) => void;
  selectFlight?: any;
  sortType: string;
};

export type TreeConfigType = {
  visible: boolean;
  cityList: PointData[];
  activeCity?: PointData;
  activeKey: string;
  mapList: ListItem[];
  index: number;
  type: number;
};
export type ZH = {
  zh: string;
  en: string;
};
export type StationInfo = {
  time: string;
  address: string;
  date: string;
};
export type FlightInfoType = {
  set: (values: Partial<ConfigType>) => void;
  title?: string;
  subTitleTop?: string;
  subTitleBottom?: string;
  start: ZH;
  end: ZH;
  information?: string;
  startStationInfo: StationInfo;
  endStationInfo: StationInfo;
  currentStep: number;
  length: number;
  usedTime: {
    h: number;
    m: number;
  };
  usedPrice: {
    price: number;
  };
  onNext: () => void;
  onPrev: () => void;
};
export type FlightChartItem = {
  ready: number;
  unReady: number;
  h: number;
  m: number;
  price: string;
};
export type FlightChartType = {
  list: any[];
  sizeList?: number[];
};

export type FlightStepsType = {
  labels: any[];
  progress: number;
};

export type FlightViewProps = {
  onChangeType: (value: string) => void;
  list: ListItem[];
  offsets: number[];
  listItemClick: (item: ListItem) => void;
  onBack: () => void;
  selectFlight: any;
  sortType: string;
};

export type FlightList = {
  list: ListItem[];
  listItemClick: (item: ListItem) => void;
  selectFlight: any;
  type: any;
};
export type FlightListItem = {
  flightInfo: ListItem;
  listItemClick: (item: ListItem) => void;
  selectFlight: any;
  type: any;
};

export type TypeItem = {
  selected: boolean;
  title: string;
  key?: string;
  color?: string;
};
export type FlightType = {
  onChange: (value: any) => void;
  sortType: string;
};

export type CalculationDetailsType = {
  loading: boolean;
  onClose: () => void;
  visible: boolean;
  details?: {
    point: number | string;
    side: number | string;
    path: number | string;
    timePriority: number | string;
    economicPriority: number | string;
    useTime: number | string;
  };
};

export type CalculationDetailsLocalDataType = {
  num_flights: number | string;
  num_paths: number | string;
  total_time: number | string;
};
