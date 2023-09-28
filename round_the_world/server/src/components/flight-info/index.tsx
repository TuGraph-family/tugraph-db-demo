import { FlightInfoType } from '@/interface';

import styles from './index.module.less';

const FlightInfo = ({
  title = '航线详情',
  subTitleBottom = '',
  subTitleTop = '',
  start = {
    zh: '北京',
    en: 'beijing',
  },
  end = {
    zh: '上海',
    en: 'shanghai',
  },
  information = '中国国航 · CA149 · 空客321（中）',
  startStationInfo = {
    time: '00:05',
    address: '上海虹桥国际机场',
    date: '',
  },
  endStationInfo = {
    time: '04:35',
    address: '台北松山机场',
    date: '',
  },
  usedPrice = {
    price: 10880.0,
  },
  usedTime = {
    h: 27,
    m: 15,
  },
  onPrev,
  onNext,
  length,
  currentStep,
  set,
}: FlightInfoType) => {
  return (
    <div className={styles.flightInfo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*VjdXSZCX4FMAAAAAAAAAAAAADgOBAQ/original"
        className={styles?.close}
        onClick={() => {
          set({ flightDetailsVisible: false });
        }}
      />
      <div className={styles.flightInfoTitle}>
        <div className={styles.left}>
          <div className={styles.flightInfoMainTitle}>{title}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.flightInfoSubTitle}>{subTitleTop}</div>
          <div className={styles.flightInfoSubTitle}>{subTitleBottom}</div>
        </div>
      </div>
      <div className={styles.address}>
        {currentStep > 0 ? (
          <img
            src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*2KyISLWXWPIAAAAAAAAAAAAADgOBAQ/original"
            className={styles.prev}
            onClick={onPrev}
          />
        ) : (
          <div className={styles.normal} />
        )}

        <div className={styles.start}>
          <div className={styles.zh}>{start.zh}</div>
          {/* <div className={styles.en}>{start.en}</div> */}
        </div>
        <div className={styles.icon}>
          <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*dlCBRq0-YAcAAAAAAAAAAAAADgOBAQ/original" />
        </div>
        <div className={styles.end}>
          <div className={styles.zh}>{end.zh}</div>
          {/* <div className={styles.en}>{end.en}</div> */}
        </div>
        {currentStep < length ? (
          <img
            src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*2KyISLWXWPIAAAAAAAAAAAAADgOBAQ/original"
            className={styles.next}
            onClick={onNext}
          />
        ) : (
          <div className={styles.normal} />
        )}
      </div>
      <div className={styles.flightStation}>
        <div className={styles.flightTransferPoint}>
          <div className={styles.icon}>
            <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*K12CRJ3Hp2cAAAAAAAAAAAAADgOBAQ/original" />
          </div>
          <div className={styles.time}>
            <div className={styles.flightTransferStartDate}>
              {/* {startStationInfo.date} */}
            </div>
            {startStationInfo.time}
          </div>
          <div className={styles.airport}>{startStationInfo.address}</div>
        </div>
        <div className={styles.flightTransferInformation}>
          <span>{information}</span>
        </div>
        <div className={styles.flightTransferPoint}>
          <div className={styles.icon}>
            <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*K12CRJ3Hp2cAAAAAAAAAAAAADgOBAQ/original" />
          </div>
          <div className={styles.time}>
            {Number(endStationInfo?.date) > 0 ? (
              <div className={styles.flightTransferEndDate}>
                +{endStationInfo?.date || 0}天
              </div>
            ) : null}
            {endStationInfo.time}
          </div>
          <div className={styles.airport}>{endStationInfo.address}</div>
        </div>
      </div>
      <div className={styles.usedTime}>
        <div className={styles.icon}>
          <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*vpRJQI9wUh0AAAAAAAAAAAAADgOBAQ/original" />
        </div>
        <div className={styles.details}>
          <div className={styles.normalText}>航行用时</div>
          <div className={styles.highlightText}>{usedTime.h}</div>
          <div className={styles.normalText}>小时</div>
          <div className={styles.highlightText}>{usedTime.m}</div>
          <div className={styles.normalText}>分</div>
        </div>
      </div>
      <div className={styles.usedPrice}>
        <div className={styles.icon}>
          <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*-RAJT4YrjyEAAAAAAAAAAAAADgOBAQ/original" />
        </div>
        <div className={styles.details}>
          <div className={styles.normalText}>支出费用</div>
          <div className={styles.highlightText}>
            <div className={styles.icon}>
              <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*EFO2RrB_VYoAAAAAAAAAAAAADgOBAQ/original" />
            </div>
            <div className={styles.text}>{Math.floor(usedPrice.price)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightInfo;
