import { FlightChartItem, FlightChartType } from '@/interface';
import { LEFT_OFFSET, HEIGHTS } from '@/constant';

import styles from './index.module.less';
import { addZero } from '@/utils';

const formatPrice = (val: string) => {
  if (!val) return 0;
  return val;
};

const FlightChart = ({
  list = [
    {
      ready: 12,
      unReady: 1,
      h: 12,
      m: 0,
      price: '1000',
    },
    {
      ready: 12,
      unReady: 1,
      h: 12,
      m: 0,
      price: '10000',
    },
  ],
}: FlightChartType) => {
  const mapList = [...list];
  const len = list.slice(0, 4).length - 1;

  return (
    <div className={styles.flightChart} id="000">
      <img
        src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*v4rCS77jYv4AAAAAAAAAAAAADgOBAQ/original"
        className={styles.sizeBg}
      />
      <div className={styles.size}>
        {mapList
          .sort((a, b) => b?.ready - a?.ready)
          .map((item: any) => {
            return (
              <div className={styles.sizeItem} key={item}>
                <div className={styles.zh}>{item?.ready}</div>
                <div className={styles.en}>h</div>
              </div>
            );
          })}
      </div>
      <div className={styles.flightRect}>
        {list.map((item: FlightChartItem, index: number) => {
          const _index = mapList
            .map((_item) => _item?.ready)
            .sort((a, b) => a - b)
            .findIndex((_i) => _i === item?.ready);
          return (
            <div
              className={styles.flightRectItem}
              key={index}
              style={{
                left: `${LEFT_OFFSET[index]}rem`,
              }}
            >
              <div className={styles.tooltips}>
                <div className={styles.p1}>
                  <div className={styles.lightText}>{addZero(item.h)}</div>
                  <div className={styles.normalText}>小时</div>
                  <div className={styles.lightText}>{addZero(item.m)}</div>
                  <div className={styles.normalText}>分钟</div>
                </div>
                <div className={styles.p2}>
                  <div className={styles.normalText}>支出</div>
                  <img
                    src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*EFO2RrB_VYoAAAAAAAAAAAAADgOBAQ/original"
                    className={styles.icon}
                  />
                  <div className={styles.lightText}>
                    {formatPrice(item.price)}
                  </div>
                </div>
              </div>
              <div
                className={styles.unReadyRectangle}
                style={{ height: 0 }}
              ></div>
              <div
                className={styles.readyRectangle}
                style={{
                  height: HEIGHTS[len][_index] + 'rem',
                }}
                id={'i' + item.ready}
              ></div>
              <div className={styles.label}>
                <img
                  src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*EFO2RrB_VYoAAAAAAAAAAAAADgOBAQ/original"
                  className={styles.icon}
                />
                <div className={styles.text}>{item.price}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlightChart;
