import { Scene } from '@antv/l7';
import '@/utils/adapter';
import {
  LarkMap,
  LarkMapProps,
  LineLayer,
  LineLayerProps,
  PointLayer,
  PointLayerProps,
  ZoomControl,
  CustomControl,
  TextLayer,
  TextLayerProps,
  LayerPopup,
} from '@antv/larkmap';
import { message } from 'antd';
import moment from 'moment';
import { useState, useRef, useEffect } from 'react';
import CityTree from '@/components/city-tree';
import ImgIcon from '@/components/img-icon';
import FlightInfo from '@/components/flight-info';
import MapMask from '@/components/map-mask';
import cityList from '@/data/city_new.json';
import {
  arrayFull,
  getArrayKeysFlatMap,
  getTime,
  getZhName,
  selectKeysFromObjectAsArray,
  getPxToRem,
  getCookie,
  localStorage,
  setCookie,
  snakeShapedConnectionFlat,
} from '@/utils';

import {
  FlightData,
  FlightMapData,
  PointData,
  ConfigType,
  FlightInfoType,
} from '@/interface';
import { IMG } from '@/constant';
import { getCity, login } from '@/services';

import styles from './index.less';
import MapLoading from '@/components/map-loading';
import CalculationDetails from '@/components/calculation-details';

const larkMapConfig: LarkMapProps = {
  mapType: 'Gaode',
  mapOptions: {
    style: 'dark',
    zoom: 3,
    maxZoom: 6,
    minZoom: 3,
    center: [116.368652, 39.93866],
  },
  logoVisible: false,
};

const pointLayerOptions: Omit<PointLayerProps, 'source'> = {
  autoFit: false,
  shape: 'coordinateIcon',
  visible: true,
  size: 25,
  offsets: [12.5, 12.5],
  style: {
    opacity: 0.8,
  },
  animate: {
    enable: true,
    speed: 0.1,
    rings: 3,
  },
};

const lineLayerOptions: Omit<LineLayerProps, 'source'> = {
  autoFit: false,
  shape: 'greatcircle' as const,
  size: 6,
  style: {
    opacity: 0.8,
    lineType: 'dash' as const,
    dashArray: [10, 0],
    sourceColor: '#2073ff',
    targetColor: '#64ffff',
  },
  animate: {
    duration: 7,
    interval: 0,
    trailLength: 1,
  },
};

const dashLineLayerOptions: Omit<LineLayerProps, 'source'> = {
  autoFit: false,
  shape: 'greatcircle' as const,
  size: 2,
  color: {
    field: 'line_name',
    value: (val) => {
      return ['#000'];
    },
  },
  style: {
    opacity: 1,
    lineType: 'dash' as const,
    dashArray: [2, 2],
  },
};

const planeLayerOptions: Omit<LineLayerProps, 'source'> = {
  blend: 'normal',
  autoFit: true,
  shape: 'arc' as const,
  size: 100,
  color: {
    value: '#ff6b34',
  },
  style: {
    textureBlend: 'replace',
    lineTexture: true, // 开启线的贴图功能
    iconStep: 10, // 设置贴图纹理的间距
  },
  texture: 'plane',
  animate: {
    duration: 1,
    interval: 0.2,
    trailLength: 0.05,
  },
};

const animatePointLayerOptions: Omit<PointLayerProps, 'source'> = {
  autoFit: false,
  shape: 'circle',
  visible: true,
  size: 60,
  color: {
    field: 'isSelect',
    value: (isSelect: any) => {
      return '#fff';
    },
  },
  style: {
    opacity: 0.6,
    offsets: [0, -12],
  },
  state: {
    select: { color: 'red' },
  },
  animate: {
    enable: true,
    speed: 0.3,
    rings: 3,
  },
};

const textLayerOption: Omit<TextLayerProps, 'source'> = {
  autoFit: false,
  field: 'cityname_zh',
  style: {
    fill: {
      field: 'cityname_zh',
      value: ['#fff'],
    },
    opacity: 1,
    fontSize: 20,
    textOffset: [45, 45],
    stroke: '',
    strokeWidth: 2,
    textAllowOverlap: false,
    padding: [20, 20] as [number, number],
  },
};

const RenderAnimatePointData = ({ pointData = [] }: { pointData: any[] }) => {
  return (
    <>
      {pointData?.map((item: any, index) => {
        return (
          <PointLayer
            key={index}
            id={(item?.id || index) + Math.random()}
            {...animatePointLayerOptions}
            source={{
              data: [item],
              parser: { type: 'json', x: 'lon', y: 'lat' },
            }}
          />
        );
      })}
    </>
  );
};

const RenderLineData = ({
  selectSource,
  isPrice,
}: {
  selectSource: any;
  isPrice: boolean;
}) => {
  return (
    <LineLayer
      id="lineLayer"
      name="lineLayer"
      {...{
        ...lineLayerOptions,
        style: {
          opacity: 0.9,
          lineType: 'dash' as const,
          dashArray: [10, 0],
          sourceColor: isPrice ? '#ff8603' : '#2073ff',
          targetColor: '#64ffff',
        },
      }}
      source={selectSource}
    />
  );
};

const RenderPointData = ({
  selectSource = [],
  pointData = [],
}: {
  selectSource: any[];
  pointData: any[];
}) => {
  const site = arrayFull(selectSource)
    ? snakeShapedConnectionFlat(
        selectSource?.map((item: any) =>
          selectKeysFromObjectAsArray(['origin', 'destination'], item)
        )
      )
    : false;

  if (!site || pointData.length === 0 || selectSource.length === 0) return null;

  return (
    <>
      {pointData?.map((item: any, index) => {
        let shape: string | any =
          'point' +
            site?.findIndex((_site: any) => _site === item?.cityname_en) || 0;

        if (`${shape}`.includes('-')) {
          shape = `${shape}`.replace(/[\-]/, '');
        }
        return (
          <PointLayer
            key={item?.cityname_en}
            id={`${item?.cityname_en}`}
            name={`${item?.cityname_en}`}
            {...{
              ...pointLayerOptions,
              shape,
            }}
            source={{
              data: [item],
              parser: { type: 'json', x: 'lon', y: 'lat' },
            }}
          />
        );
      })}
    </>
  );
};

export default () => {
  const mapRef = useRef<any>(null);
  const [config, setConfig] = useState<ConfigType>({
    flightViewVisible: false,
    flightInfoVisible: false,
    flightDetailsVisible: false,
    loadedImages: false,
    mapMaskVisible: true,
    pointData: [],
    lineLayerOptions,
    planeLayerOptions,
    dashLineLayerOptions,
    textLayerOption,
    selectPoint: [],
    selectFlight: undefined,
    sortType: 'price',
    queryList: [],
    loading: false,
    calculationDetailsVisible: false,
    token: '',
    isStart: false,
    needRenderText: 0,
    source: {
      data: [],
      parser: { type: 'json', coordinates: 'lnglat' },
    },
    currentStep: 0,
    selectSource: {
      data: [],
      parser: { type: 'json', coordinates: 'lnglat' },
    },
    citySource: {
      data: [],
      parser: { type: 'json', coordinates: 'lnglat' },
    },
    selectedCitySource: {
      data: [],
      parser: { type: 'json', coordinates: 'lnglat' },
    },
    isClose: false,
  });
  const isPrice = config.sortType === 'price';
  const stepData = config?.selectFlight?.paths[config?.currentStep || 0];
  const length = config?.selectFlight?.paths?.length - 1 || 0;

  const set = (value: Partial<ConfigType>) => {
    setConfig((pre: ConfigType) => {
      return { ...pre, ...value };
    });
  };

  const onSceneLoaded = (scene: Scene) => {
    Promise.all(IMG.map(({ id, image }) => scene?.addImage(id, image))).then(
      () => {
        set({ loadedImages: true });
      }
    );
  };
  useEffect(() => {
    login().then((data: any) => {
      set({
        token: data?.jwt,
      });
    });
  }, []);
  const runningSearchCity = () => {
    if (config?.selectPoint.length === 0) return message.error('请选择城市');
    if (config?.selectPoint.length < 2)
      return message.error('请选择两个及以上城市');
    const time = {
      start_day: '2019-01-01',
      end_day: '2019-07-31',
    };
    const interval = 3;

    set({ loading: true, currentStep: 0, isStart: true });
    getCity({
      graph: 'default',
      script: `call db.plugin.callPlugin(\'CPP\',\'demo\',\'{"cities":${JSON.stringify(
        config?.selectPoint.map((item: any) => item?.cityname_en)
      )},\"interval\":${interval},\"start_day\":"${
        time?.start_day
      }",\"end_day\":"${time?.end_day}"}\',5000.0,true)`,
      tabValue: '1690969764038',
      token: config?.token,
    })
      .then((item: any) => {
        const {
          time_first_data,
          cost_first_data,
          num_flights = 0,
          num_paths = 0,
          total_time = 0.0,
        } = JSON.parse(item?.result[0][0]);
        const data: any = {
          time: time_first_data,
          price: cost_first_data,
        };
        localStorage.setStorage('queryData', JSON.stringify(data));
        setCookie(
          'calculationDetails',
          JSON.stringify({ num_flights, num_paths, total_time }),
          360
        );

        const queryData = data[config?.sortKey || 'time'];
        if (!queryData?.length) {
          set({
            flightViewVisible: false,
            loading: false,
            selectFlight: null,
            flightDetailsVisible: false,
            calculationDetailsVisible: false,
            source: {
              data: [],
              parser: { type: 'json', coordinates: 'lnglat' },
            },
            selectSource: {
              data: [],
              parser: { type: 'json', coordinates: 'lnglat' },
            },
            pointData: [],
            selectPoint: [],
          });
          return message.error('航班信息为空');
        }
        const flightList = getArrayKeysFlatMap('paths', queryData);

        set({
          flightViewVisible: true,
          calculationDetailsVisible: true && !config.isClose,
          flightDetailsVisible: true,
          loading: false,
          queryList: [...queryData],
          selectFlight: queryData[0],
          selectSource: {
            ...config.selectSource,
            data: transformLine([...queryData[0]?.paths]),
          },
        });

        drawPlaneLine([...config?.selectPoint], flightList);
      })
      .catch((err) => {
        message.error('服务器正在开小差');
        set({
          loading: false,
          flightViewVisible: false,
          flightDetailsVisible: false,
          calculationDetailsVisible: false,
          selectFlight: null,
          source: {
            data: [],
            parser: { type: 'json', coordinates: 'lnglat' },
          },
          selectSource: {
            data: [],
            parser: { type: 'json', coordinates: 'lnglat' },
          },
          pointData: [],
          selectPoint: [],
        });
      });
  };

  const onStart = () => {
    runningSearchCity();
  };
  const drawPlaneLine = (pointList: any[], flightList: FlightData[]) => {
    const isActive = false;
    set({
      source: { ...config.source, data: transformLine(flightList) },
      pointData: config?.selectPoint?.map((item: PointData) => {
        const isSelectThisPoint = pointList.some(
          (_item: any) => _item?.cityname_en === item?.cityname_en
        );

        return {
          ...item,
          isSelect: isActive ? 'animation' : isSelectThisPoint ? 'click' : '',
        };
      }),
    });
  };

  const transformLine = (flightList: any[]): FlightMapData[] => {
    const currentFlightList: FlightMapData[] = [];
    if (arrayFull(flightList)) {
      flightList.forEach((item) => {
        let originCity: any = null;
        let destinationCity: any = null;
        arrayFull(cityList) &&
          cityList?.forEach((_item: any) => {
            if (_item.cityname_en === item?.origin) originCity = _item;
            if (_item.cityname_en === item?.destination)
              destinationCity = _item;
          });
        currentFlightList.push({
          ...item,
          line_id: item.parentId,
          line_name: `${item.parentId}`,
          lnglat: [
            [originCity?.lon, originCity?.lat],
            [destinationCity?.lon, destinationCity?.lat],
          ],
        });
      });
    }

    return currentFlightList;
  };

  const handlePoint = (val: any) => {
    const hasPoint = config?.selectPoint.some((item: any) =>
      [val?.feature?.cityname_en, val?.cityname_en].includes(item?.cityname_en)
    );
    if (config?.selectPoint.length === 8 && !hasPoint) {
      return message.error('查询城市数量超过8个');
    }
    set({
      selectPoint: hasPoint
        ? config?.selectPoint.filter((item: any) => {
            return ![val?.feature?.cityname_en, val?.cityname_en].includes(
              item?.cityname_en
            );
          })
        : [...config?.selectPoint, val?.feature || val],
      pointData: [
        ...config.pointData.map((item: any) => {
          if (
            [val?.feature?.cityname_en, val?.cityname_en].includes(
              item?.cityname_en
            )
          ) {
            if (hasPoint) {
              return { ...item, isSelect: 'false' };
            } else {
              const isActive = [...config?.selectFlight?.paths].some(
                (active: any) =>
                  selectKeysFromObjectAsArray(
                    ['destination', 'origin'],
                    active
                  ).includes(item?.cityname_en)
              );
              return {
                ...item,
                isSelect: isActive ? 'animation' : 'click',
              };
            }
          }
          return item;
        }),
      ],
    });
  };

  return (
    <>
      <LarkMap
        {...larkMapConfig}
        style={{ height: '100vh' }}
        onSceneLoaded={onSceneLoaded}
        id="map"
        ref={mapRef}
      >
        <ZoomControl
          className={styles.zoomControl}
          zoomInText={
            <ImgIcon
              url="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*ZpNLQ7S--Q4AAAAAAAAAAAAADgOBAQ/original"
              size={getPxToRem(30)}
            />
          }
          zoomOutText={
            <ImgIcon
              url="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*MIERRKCN3BIAAAAAAAAAAAAADgOBAQ/original"
              size={getPxToRem(30)}
            />
          }
        />
        <CustomControl position="bottomright" className={styles.zoomAutoFit}>
          <ImgIcon
            url="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*M2rdR7IlEC0AAAAAAAAAAAAADgOBAQ/original"
            size={getPxToRem(30)}
            onClick={() => {
              const scene = mapRef?.current?.getScene('map');
              scene?.setZoomAndCenter(0, 0);
            }}
          />
        </CustomControl>
        {config.isStart && config.isClose ? (
          <CustomControl position="bottomright" className={styles.zoomAutoFit}>
            <ImgIcon
              url="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*1TCgR5XbUpgAAAAAAAAAAAAADgOBAQ/original"
              size={getPxToRem(30)}
              onClick={() => {
                set({
                  calculationDetailsVisible: !config.calculationDetailsVisible,
                });
              }}
            />
          </CustomControl>
        ) : null}

        <TextLayer
          id="textLayer"
          {...config.textLayerOption}
          source={{
            data: cityList,
            parser: { type: 'json', x: 'lon', y: 'lat' },
          }}
        />
        <RenderLineData selectSource={config.selectSource} isPrice={isPrice} />
        <RenderAnimatePointData pointData={config?.pointData} />
        <RenderPointData
          selectSource={config?.selectSource?.data || []}
          pointData={config?.pointData}
        />
      </LarkMap>
      <CityTree
        list={config.queryList}
        selectedCity={config?.selectPoint}
        selectFlight={config?.selectFlight}
        sortType={config.sortType}
        onSelect={(val) => {
          handlePoint(val);
        }}
        onSelectPath={(path: any) => {
          if (path) {
            set({
              currentStep: 0,
              selectSource: {
                ...config.selectSource,
                data: transformLine([...path?.paths]),
              },
              pointData: config.pointData.map((item: any) => {
                const isActive = [...path?.paths].some((active: any) =>
                  selectKeysFromObjectAsArray(
                    ['destination', 'origin'],
                    active
                  ).includes(item?.cityname_en)
                );
                if (isActive) {
                  return { ...item, isSelect: 'animation' };
                } else {
                  const isSelectThisPoint = config?.selectPoint.some(
                    (_item: any) => _item?.cityname_en === item?.cityname_en
                  );
                  return {
                    ...item,
                    isSelect: isSelectThisPoint ? 'click' : false,
                  };
                }
              }),
            });
          }
        }}
        onStart={onStart}
        flightViewVisible={config.flightViewVisible}
        setConfigType={set}
      />
      {config.flightDetailsVisible && config?.queryList?.length ? (
        <>
          <FlightInfo
            set={set}
            start={{
              zh: getZhName(stepData?.origin, cityList),
              en: stepData?.origin,
            }}
            length={length}
            end={{
              zh: getZhName(stepData?.destination, cityList),
              en: stepData?.destination,
            }}
            currentStep={config.currentStep}
            usedPrice={{
              price: stepData?.cost,
            }}
            usedTime={{
              m: getTime(stepData?.time).m,
              h: getTime(stepData?.time).h,
            }}
            startStationInfo={{
              time: moment(stepData?.start_time).format('HH:mm'),
              address: stepData?.origin_airport,
              date: moment(stepData?.start_time).format('YYYY-MM-DD'),
            }}
            endStationInfo={{
              time: moment(stepData?.end_time).format('HH:mm'),
              address: stepData?.destination_airport,
              date: `${moment(
                moment(stepData?.end_time).format('YYYY-MM-DD')
              ).diff(
                moment(stepData?.start_time).format('YYYY-MM-DD'),
                'day'
              )}`,
            }}
            information={`${stepData?.flight_type} . ${stepData?.flight_number}`}
            onNext={() => {
              set({
                currentStep:
                  config?.currentStep >= length ? 0 : config?.currentStep + 1,
              });
            }}
            onPrev={() => {
              set({
                currentStep:
                  config?.currentStep <= 0 ? length : config?.currentStep - 1,
              });
            }}
          />
        </>
      ) : undefined}
      <img
        src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*KJbgSb1AAVUAAAAAAAAAAAAADgOBAQ/original"
        className={styles?.backHome}
        onClick={() => {
          set({ mapMaskVisible: true });
        }}
      />
      <MapMask visible={config.mapMaskVisible} set={set} />
      <MapLoading visible={config.loading} />
      <CalculationDetails
        loading={config.loading}
        visible={config.calculationDetailsVisible}
        onClose={() => {
          set({
            calculationDetailsVisible: false,
            isClose: true,
          });
        }}
      />
    </>
  );
};
