import { useEffect, useRef } from 'react';
import styles from './index.module.less';

const MapLoading = ({ visible }: { visible: boolean }) => {
  const progress = useRef<any>(null);
  const timer = useRef<any>(null);
  // useEffect(() => {
  //   if (timer.current) clearInterval(timer.current);
  //   if (progress.current && visible) {
  //     timer.current = setInterval(() => {
  //       progress.current.innerHTML = parseInt(`${100 * Math.random()}`) + '%';
  //     }, 42);
  //   }
  //   return () => {
  //     clearInterval(timer.current);
  //   };
  // }, [visible]);
  if (!visible) return null;

  return (
    <div className={styles.mapLoading}>
      <div className={styles.content}>
        <div className={styles.progressText}>
          <div className={styles.text}>图计算中...</div>
          <div className={styles.text} ref={progress}>
            {/* 100% */}
          </div>
        </div>
        <div className={styles.progressLine}>
          <div className={styles.progressContent}></div>
        </div>
      </div>
    </div>
  );
};

export default MapLoading;
