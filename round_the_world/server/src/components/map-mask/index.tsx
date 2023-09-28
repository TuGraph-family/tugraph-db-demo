import styles from './index.module.less';

const MapMask = ({
  visible = true,
  set = (values) => {},
}: {
  visible: boolean;
  set: (values: any) => void;
}) => {
  if (!visible) return null;
  return (
    <div className={styles.mapMask}>
      <img
        src={
          'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*udenQZNuEeEAAAAAAAAAAAAADgOBAQ/original'
        }
        className={styles.gif}
        loading="lazy"
      />
      <div
        className={styles.content}
        onClick={() => {
          set({
            mapMaskVisible: false,
          });
        }}
      >
        <div className={styles?.title}>点点相连 行遍全球</div>
        <div className={styles?.subTitle}>图计算环球旅行航线规划</div>
        <div className={styles?.logo}>
          <div className={styles?.text}>POWERED BY</div>
          <img
            className={styles?.icon}
            src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*eBd5QKbQ1AoAAAAAAAAAAAAADgOBAQ/original"
          />
        </div>
        <div className={styles?.copyright}>
          <p>
            本示例仅用于展示图计算技术，不涉及任何商业用途。相关航班线路、时间、计算结果等仅供示意，不作为实际出行建议。
          </p>
          <p>
            航班数据来源
            <span style={{ color: 'rgb(40, 80, 246)' }}>
              https://zenodo.org/record/7923702
            </span>
            ，城市和票价信息基于航班数据逻辑处理后生成。
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapMask;
