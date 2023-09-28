import styles from './index.module.less';

const Line = ({
  zh,
  en,
  sum,
  unit,
}: {
  zh: string;
  en: string;
  sum: string | number;
  unit: string;
}) => {
  return (
    <div className={styles.line}>
      <div className={styles.left}>
        <div className={styles.zh}>{zh}</div>
        <div className={styles.en}>{en}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.sum}>{sum}</div>
        <div className={styles.unit}>{unit}</div>
      </div>
    </div>
  );
};

export default Line;
