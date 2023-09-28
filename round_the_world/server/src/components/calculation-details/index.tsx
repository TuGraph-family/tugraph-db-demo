import { evaluate } from 'mathjs';
import styles from './index.module.less';
import {
  CalculationDetailsLocalDataType,
  CalculationDetailsType,
} from '@/interface';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils';

const CalculationDetails = ({
  visible,
  onClose,
  loading,
}: CalculationDetailsType) => {
  const [details, setDetails] = useState<CalculationDetailsLocalDataType>();
  useEffect(() => {
    if (visible) setDetails(JSON.parse(`${getCookie('calculationDetails')}`));
  }, [visible, loading]);
  if (!visible) return null;
  return (
    <div className={styles.mask}>
      <div className={styles.calculationDetails}>
        <div className={styles.title}>
          <div className={styles.left}>
            <div className={styles.mainTitle}>
              <img
                src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*1TCgR5XbUpgAAAAAAAAAAAAADgOBAQ/original"
                className={styles.icon}
              />
              <span>计算详情</span>
            </div>
            <img
              src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*VVv5Q7M3G9YAAAAAAAAAAAAADgOBAQ/original"
              className={styles.close}
              onClick={onClose}
            />
          </div>
          <div className={styles.right}>
            <div className={styles.subTitle}></div>
            <div className={styles.subTitle}></div>
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.left}>航班规模</div>
          <div className={styles.right}>
            <div className={styles.name}>航班数量</div>
            <div className={styles.num}>
              <span className={styles.active}>
                {details?.num_flights
                  ? Number(evaluate(`${details?.num_flights} / 10000`)).toFixed(
                      1
                    )
                  : 0}
              </span>
              万
            </div>
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.left}>计算路径</div>
          <div className={styles.right}>
            <div className={styles.name}>计算路径</div>
            <div className={styles.num}>
              <span className={styles.active}>{details?.num_paths || 0}</span>条
            </div>
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.left}>计算耗时</div>
          <div className={styles.right}>
            <div className={styles.num}>
              <span className={styles.light}>
                {details?.total_time
                  ? Number(details?.total_time).toFixed(1)
                  : 0}
              </span>
              秒
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationDetails;
