import { useEffect, useState } from 'react';
import { FlightType, TypeItem } from '@/interface';

import styles from './index.module.less';

const FlightTypeItem = ({ title, selected, color, key }: TypeItem) => {
  return (
    <div
      key={key + title}
      className={
        selected
          ? title === '经济优先'
            ? styles.filterPriceTypeItemSelected
            : styles.filterTypeItemSelected
          : styles.filterTypeItem
      }
    >
      <span>{title}</span>
    </div>
  );
};

const FlightTypeRoot = ({ onChange, sortType }: FlightType) => {
  const [type, setType] = useState<TypeItem[]>([
    {
      title: '经济优先',
      selected: true,
      key: 'price',
      color: '#ff8603',
    },
    {
      title: '时间优先',
      selected: false,
      key: 'time',
      color: '#1650ff',
    },
  ]);
  useEffect(() => {
    onChange(type[0]);
  }, []);
  return (
    <div className={styles.filterType}>
      {Array.isArray(type) &&
        type?.map(({ title, selected, key, color }: TypeItem) => {
          return (
            <div
              key={title}
              onClick={() => {
                setType(() => {
                  return type.map((item: TypeItem) => {
                    return {
                      ...item,
                      selected: item?.title === title,
                    };
                  });
                });
                key && onChange && onChange({ key, color });
              }}
            >
              <FlightTypeItem
                title={title}
                selected={selected}
                color={color}
                key={key}
              />
            </div>
          );
        })}
    </div>
  );
};

export default FlightTypeRoot;
