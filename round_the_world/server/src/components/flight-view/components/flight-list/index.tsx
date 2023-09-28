import { ListItem, FlightList, FlightListItem } from '@/interface';
import { last } from 'lodash';
import {
  getZhName,
  getTime,
  getPxToRem,
  getTimeView,
  arrayFull,
} from '@/utils';
import { useMemo } from 'react';
import { Tooltip } from 'antd';
import cityList from '@/data/city_new.json';

import styles from './index.module.less';

const FlightListItemRoot = ({
  flightInfo,
  listItemClick,
  selectFlight,
  type,
}: FlightListItem) => {
  const isSelected = selectFlight?.id === flightInfo?.id;
  const isPrice = type?.key === 'price';

  const site = useMemo(() => {
    const _site: any = {
      start: undefined,
      end: undefined,
    };
    if (arrayFull(flightInfo?.paths)) {
      _site.start = flightInfo?.paths[0];
      _site.end = last(flightInfo.paths);
    }
    return _site;
  }, [flightInfo]);

  return (
    <div
      className={
        isSelected ? styles.flightListItemSelected : styles.flightListItem
      }
      style={{
        ...(isSelected
          ? {
              background: type?.color,
            }
          : {}),
      }}
      onClick={() => {
        listItemClick(flightInfo);
      }}
      key={flightInfo?.id}
      id={flightInfo?.id}
    >
      <div className={styles.left}>
        <div className={styles.top}>
          <div className={styles.start}>
            <span>{getZhName(site?.start?.origin, cityList)}</span>
          </div>

          <Tooltip
            title={
              arrayFull(flightInfo?.paths) && flightInfo?.paths?.length > 1
                ? flightInfo?.paths.map((item: any, index: number) => {
                    return (
                      <>
                        {flightInfo?.paths?.length - 1 === index ? (
                          getZhName(item?.destination, cityList)
                        ) : (
                          <>
                            {getZhName(item?.destination, cityList)}{' '}
                            <img
                              src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*2KyISLWXWPIAAAAAAAAAAAAADgOBAQ/original"
                              className={styles.pathIcon}
                            />
                          </>
                        )}
                      </>
                    );
                  })
                : ''
            }
            overlayClassName={isPrice ? styles.priceTooltip : styles.tooltip}
          >
            <div className={styles.icon}>
              <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*UrH4SZklZrIAAAAAAAAAAAAADgOBAQ/original" />
              {flightInfo?.paths.length > 1 ? (
                <>
                  <span>途径</span>
                  <span className={styles?.num} style={{ color: type?.color }}>
                    {flightInfo?.paths.length - 1 || 0}
                  </span>
                  <span>城市</span>
                </>
              ) : (
                <img
                  src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*83w3RKpkwLEAAAAAAAAAAAAADgOBAQ/original"
                  style={{
                    width: `${getPxToRem(16)}rem`,
                    height: `${getPxToRem(16)}rem`,
                    margin: `0 ${getPxToRem(6)}rem`,
                    display: 'block',
                  }}
                />
              )}
              <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*UrH4SZklZrIAAAAAAAAAAAAADgOBAQ/original" />
            </div>
          </Tooltip>
          <div className={isPrice ? styles?.priceEnd : styles.end}>
            <span>{getZhName(site?.end?.destination, cityList)}</span>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.progress}>
            <div className={isPrice ? styles?.priceTotal : styles.total} />
            <div
              className={isPrice ? styles?.priceCurrent : styles.current}
              style={{
                width: `${getPxToRem(138)}rem`,
              }}
            />
            <div
              className={isPrice ? styles?.priceFlight : styles.flight}
              style={{
                left: `${getPxToRem(138 - 8.65)}rem`,
              }}
            />
          </div>
        </div>
      </div>
      <div className={isPrice ? styles?.priceRight : styles.right}>
        <div className={styles.top}>
          <div className={styles.priceIcon} />
          <div className={styles.priceText}>
            {Number(flightInfo.cost).toFixed(2)}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.timeText}>
            {getTime(flightInfo?.time).text}
          </div>
          <div className={styles.timeIcon} />
        </div>
      </div>
      {flightInfo.optimal && (
        <div className={isPrice ? styles.priceOptimal : styles.optimal} />
      )}
    </div>
  );
};
const FlightListRoot = ({
  list,
  listItemClick,
  selectFlight,
  type,
}: FlightList) => {
  return (
    <div className={styles.flightList}>
      {list.map((item: ListItem, index: number) => {
        item.optimal = index === 0;
        return (
          <FlightListItemRoot
            type={type}
            key={item.id}
            flightInfo={item}
            listItemClick={listItemClick}
            selectFlight={selectFlight}
          />
        );
      })}
    </div>
  );
};

export default FlightListRoot;
