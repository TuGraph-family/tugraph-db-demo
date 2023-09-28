import { find, groupBy, map, cloneDeep } from 'lodash';
import { useEffect, useState, useMemo, memo } from 'react';
import { TreeConfigType, TreeProp, ListItem, PointData } from '@/interface';
import { DatePicker } from 'antd';
import useDebounceRerender from '@/hook/useDebounceRerender';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import {
  arrayFull,
  calculateTimeProgress,
  addZero,
  setAttr,
  getCookie,
  setCookie,
} from '@/utils';
import { STAY_TYPE } from '@/constant';
import classNames from 'classnames';
import pointData from '@/data/city_new.json';
import FlightView from '@/components/flight-view';

import styles from './index.module.less';

const CityTree: React.FC<TreeProp> = ({
  selectedCity,
  onSelect,
  list = [],
  onSelectPath,
  onStart,
  flightViewVisible,
  setConfigType,
  selectFlight,
  sortType,
}) => {
  // const cityPoints = groupBy(pointData, 'countryname_zh');

  const [config, setConfig] = useState<TreeConfigType>({
    visible: true,
    cityList: pointData,
    activeCity: undefined,
    activeKey: '美国',
    mapList: list,
    index: 0,
    type: 0,
  });

  const set = (obj: Partial<TreeConfigType>) => {
    setConfig((pre: TreeConfigType) => {
      return { ...pre, ...obj };
    });
  };

  useEffect(() => {
    set({
      mapList: list,
    });
  }, [list, selectFlight]);

  const earthIcon = (
    <div
      className={styles[`earthIcon`]}
      onClick={() => {
        set({ visible: !config.visible });
      }}
    ></div>
  );

  const Tabs = () => {
    return (
      <>
        <div
          className={
            styles[
              `city-tree-left-tabs-item${config.type === 0 ? '-selected' : ''}`
            ]
          }
        >
          <img
            onClick={() => {
              set({
                type: 0,
              });
            }}
            src={
              config.type === 0
                ? 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*LI62R5BUbZQAAAAAAAAAAAAADgOBAQ/original'
                : 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*HYCsT4xBViIAAAAAAAAAAAAADgOBAQ/original'
            }
            className={styles[`city-tree-left-tabs-item-icon`]}
          />
        </div>
        <div
          className={
            styles[
              `city-tree-left-tabs-item${config.type === 1 ? '-selected' : ''}`
            ]
          }
        >
          <img
            onClick={() => {
              set({
                type: 1,
              });
            }}
            src={
              config.type === 1
                ? 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*LpIYT4OGk3wAAAAAAAAAAAAADgOBAQ/original'
                : 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*JXueT7lzwvMAAAAAAAAAAAAADgOBAQ/original'
            }
            className={styles[`city-tree-left-tabs-item-icon`]}
          />
        </div>
      </>
    );
  };
  const StepTimePicker = ({ type }: { type: number }) => {
    const [index, setIndex] = useState<number>(0);
    useDebounceRerender(type);
    useEffect(() => {
      const cacheStepTime = getCookie('StepTimePicker') || 0;
      setIndex(Number(cacheStepTime));
    }, []);
    useEffect(() => {
      setCookie('interval', `${STAY_TYPE[index].code}`, 360);
    }, [index]);
    if (type !== 0) return null;
    return (
      <div className={styles[`city-tree-left-content-transform-picker`]}>
        <img
          className={styles[`city-tree-left-content-transform-picker-del`]}
          src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*5XhnSqkHycAAAAAAAAAAAAAADgOBAQ/original"
          onClick={() => {
            const _index = index > 0 ? index - 1 : 2;
            setIndex(_index);
            setCookie('StepTimePicker', `${_index}`, 360);
          }}
        />
        <span
          className={
            styles[`city-tree-left-content-transform-picker-normalText`]
          }
        >
          {STAY_TYPE[index].text}
        </span>
        <span
          className={styles[`city-tree-left-content-transform-picker-grayText`]}
        >
          停留
        </span>
        <span
          className={
            styles[`city-tree-left-content-transform-picker-normalText`]
          }
        >
          {addZero(STAY_TYPE[index].code)}
        </span>
        <span
          className={styles[`city-tree-left-content-transform-picker-grayText`]}
        >
          h
        </span>
        <img
          className={styles[`city-tree-left-content-transform-picker-add`]}
          src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*5XhnSqkHycAAAAAAAAAAAAAADgOBAQ/original"
          onClick={() => {
            const _index = index >= 2 ? 0 : index + 1;
            setIndex(_index);
            setCookie('StepTimePicker', `${_index}`, 360);
          }}
        />
      </div>
    );
  };
  const StepDatePicker = ({ type }: { type: number }) => {
    const [time, setTime] = useState<any>({
      start_day: '2019-1-1',
      end_day: '2022-12-31',
    });
    useDebounceRerender(type);
    useEffect(() => {
      if (type === 1) {
        const cacheTime = JSON.parse(`${getCookie('StepDatePicker')}`);
        if (cacheTime) {
          setTime(cacheTime);
        }
      }
    }, []);
    useEffect(() => {
      setCookie('StepDatePicker', JSON.stringify(time), 360);
    }, [time]);
    if (type !== 1) return null;
    return (
      <div className={styles[`city-tree-left-content-transform-datePicker`]}>
        <div
          className={
            styles[`city-tree-left-content-transform-datePicker-start`]
          }
        >
          起
        </div>
        <DatePicker
          className={styles[`city-tree-left-content-transform-datePicker-node`]}
          format="YYYY年MM月DD日"
          suffixIcon={undefined}
          clearIcon={undefined}
          value={moment(time.start_day)}
          defaultValue={moment('2019-12-28')}
          onChange={(value) => {
            const _time = {
              ...time,
              start_day: moment(value).format('YYYY-MM-DD'),
            };
            setTime(_time);
          }}
          popupClassName={
            styles[`city-tree-left-content-transform-datePicker-popup`]
          }
          locale={locale}
        />
        <div
          className={styles[`city-tree-left-content-transform-datePicker-end`]}
        >
          止
        </div>
        <DatePicker
          className={styles[`city-tree-left-content-transform-datePicker-node`]}
          format="YYYY年MM月DD日"
          suffixIcon={undefined}
          clearIcon={undefined}
          value={moment(time.end_day)}
          onChange={(value) => {
            const _time = {
              ...time,
              end_day: moment(value).format('YYYY-MM-DD'),
            };
            setTime(_time);
          }}
          defaultValue={moment('2022-02-15')}
          locale={locale}
          popupClassName={
            styles[`city-tree-left-content-transform-datePicker-popup`]
          }
        />
        <div
          className={
            styles[`city-tree-left-content-transform-datePicker-endText`]
          }
        >
          必经城市
        </div>
      </div>
    );
  };
  const TransformTitle = ({ type }: { type: number }) => {
    const memoTitle = useMemo(() => {
      return type === 0 ? '途经城市' : '旅行时长';
    }, [type]);
    const MemoStepTimePicker = memo(StepTimePicker);
    const MemoStepDatePicker = memo(StepDatePicker);

    return (
      <div className={styles[`city-tree-left-content-transform`]}>
        <div className={styles[`city-tree-left-content-transform-title`]}>
          {memoTitle}
        </div>
        <MemoStepDatePicker type={type} />
        <MemoStepTimePicker type={type} />
      </div>
    );
  };
  const Country = ({
    pointData,
    set,
  }: {
    pointData: any[];
    set: (obj: Partial<TreeConfigType>) => void;
  }) => {
    const memoPointData = useMemo(() => {
      return pointData;
    }, [pointData]);
    const obsServer = () => {
      const el = document.querySelector('#country-active');
      const intersectionObserver = new IntersectionObserver(function (entries) {
        // 如果不可见，就返回
        if (entries[0].intersectionRatio <= 0) {
          el &&
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
            });
        }
      });
      if (el) {
        intersectionObserver.observe(el);
      }
    };
    useEffect(() => {
      // obsServer();
    }, []);
    return (
      <>
        <div className={styles[`city-tree-right-country`]}>
          {map(
            groupBy(memoPointData, 'countryname_zh'),
            (item: PointData[], key: string) => {
              return (
                <div
                  key={key}
                  id={key === config.activeKey ? 'country-active' : ''}
                  className={
                    styles[
                      `city-tree-right-country-item${
                        key === config.activeKey ? '-active' : ''
                      }`
                    ]
                  }
                  onClick={() => {
                    set({
                      cityList: item,
                      activeKey: key,
                    });
                  }}
                >
                  {key}
                </div>
              );
            }
          )}
        </div>
      </>
    );
  };

  const City = () => {
    return (
      <>
        {map(config.cityList, (item: PointData, index: number) => {
          const activeCity = find(
            selectedCity,
            (city: PointData) => city.cityname_en === item.cityname_en
          );
          return (
            <div
              className={
                activeCity ? styles[`city-tree-right-city-active`] : ''
              }
              key={index}
              onClick={() => {
                set({ activeCity: item });
                onSelect(item);
              }}
            >
              {item.cityname_zh}
            </div>
          );
        })}
      </>
    );
  };

  const SelectCityView = ({
    type,
    selectedCity,
  }: {
    selectedCity: any[];
    type: number;
  }) => {
    const memoSelectCity = useMemo(() => {
      return selectedCity;
    }, [selectedCity]);
    return (
      <div className={styles[`city-tree-left-root`]}>
        <div
          className={styles[`city-tree-left-list`]}
          style={{
            maxHeight: type === 0 ? '1.1111rem' : '.625rem',
          }}
        >
          {map(memoSelectCity, (item: PointData) => {
            return (
              <div
                key={item.cityname_en}
                className={styles[`city-tree-left-root-item`]}
                onClick={() => {
                  onSelect(item);
                }}
              >
                {item.cityname_zh}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {earthIcon}

      {config.visible ? (
        <div className={styles[`city-tree`]}>
          <img
            src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*KapnRpjBzi4AAAAAAAAAAAAADgOBAQ/original"
            className={styles[`city-tree-start`]}
            onClick={() => {
              if (config.activeCity) {
                onStart(config.activeCity);
              }
            }}
          />
          {/* <div
            className={classNames({
              [styles['city-tree-left']]: true,
              [styles['city-tree-left-mask-normal']]: config.type === 0,
              [styles['city-tree-left-mask-min']]: config.type === 1,
            })}
          >
            <div className={styles[`city-tree-left-tabs`]}>
              <Tabs />
            </div>
            <div className={styles[`city-tree-left-content`]}>
              <TransformTitle type={config.type} />
              <SelectCityView type={config.type} selectedCity={selectedCity} />
            </div>
          </div> */}

          <div className={styles[`city-tree-right`]}>
            <div className={styles[`city-tree-right-left`]}>
              <div
                className={styles[`city-tree-right-left-tabs-item-selected`]}
              >
                <img
                  src={
                    'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*LI62R5BUbZQAAAAAAAAAAAAADgOBAQ/original'
                  }
                  className={styles[`city-tree-right-left-tabs-item-icon`]}
                />
              </div>
            </div>
            <div className={styles[`city-tree-right-tab`]}>
              <div className={styles[`city-tree-right-text`]}>请选择城市</div>
              <div className={styles[`city-tree-right-city`]}>
                <City />
              </div>
            </div>
          </div>
          {flightViewVisible ? (
            <FlightView
              list={config.mapList}
              sortType={sortType}
              onChangeType={(value: string) => {
                setCookie('SortType', value, 360);
                setConfigType({
                  sortType: value || 'time',
                });
              }}
              selectFlight={selectFlight}
              offsets={[]}
              listItemClick={(item: ListItem) => {
                const current = config.mapList.map((_item: ListItem) => {
                  return { ..._item, selected: item.id === _item.id };
                });
                set({ mapList: current });
                setConfigType({
                  selectFlight: item,
                  flightDetailsVisible: true,
                });

                onSelectPath(item);
              }}
              onBack={() => {
                setConfigType({
                  flightViewVisible: false,
                  flightDetailsVisible: false,
                  selectPoint: [],
                  selectSource: [],
                  source: [],
                  pointData: [],
                  selectFlight: null,
                });
              }}
            />
          ) : null}
        </div>
      ) : undefined}
    </>
  );
};

export default CityTree;
