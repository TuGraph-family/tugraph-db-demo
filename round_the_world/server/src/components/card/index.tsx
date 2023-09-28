import styles from './index.module.less';

const Card = ({
  children,
  title,
  icon,
}: {
  children: any;
  title: string;
  icon: string;
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.text}>{title}</div>
        <img src={icon} className={styles.icon} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Card;
