import { FlightStepsType } from '@/interface';
import { MAX_OFFSET } from '@/constant';
import cityList from '@/data/city_new.json';

import styles from './index.module.less';
import { getZhName } from '@/utils';

const FlightSteps = ({ labels = [], progress = 0 }: FlightStepsType) => {
  return (
    <div className={styles.flightSteps}>
      <div className={styles.current}>
        <img
          src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*83w3RKpkwLEAAAAAAAAAAAAADgOBAQ/original"
          className={styles.icon}
          style={{ left: `${MAX_OFFSET.flight * progress}rem` }}
        />
      </div>

      <div className={styles.step}>
        <div className={styles.total} />
        <div
          className={styles.progress}
          style={{
            width: `${MAX_OFFSET.line * progress}rem`,
          }}
        />
      </div>
      <div className={styles.drag}>
        <div
          className={styles.tag}
          style={{ left: `${MAX_OFFSET.dot * progress}rem` }}
        />
      </div>

      <div className={styles.label}>
        {labels.map((item: string) => {
          return (
            <div className={styles.labelItem} key={item}>
              {getZhName(item, cityList)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default FlightSteps;
