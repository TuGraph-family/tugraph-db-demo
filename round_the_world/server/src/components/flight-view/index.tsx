import { ListItem, FlightViewProps } from '@/interface';
import FlightList from './components/flight-list';
import FlightType from './components/flight-type';
import localStorage from '@/utils/localStorage';

import styles from './index.module.less';
import { useEffect, useState } from 'react';

const FlightView = ({
  list,
  listItemClick,
  onChangeType,
  offsets,
  onBack,
  selectFlight,
  sortType,
}: FlightViewProps) => {
  const [mapList, setMapList] = useState(list);

  const [type, setType] = useState<any>('');
  useEffect(() => {
    setMapList(localStorage.getStorage('queryData')[sortType || 'price']);
  }, [sortType, selectFlight]);
  return (
    <div
      className={styles.flightView}
      style={{ left: offsets[0], top: offsets[1] }}
    >
      <img
        src={
          type?.key === 'price'
            ? 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*KJbgSb1AAVUAAAAAAAAAAAAADgOBAQ/original'
            : 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*RfkyRKOsA8QAAAAAAAAAAAAADgOBAQ/original'
        }
        className={styles.back}
        onClick={onBack}
      />
      <FlightType
        sortType={sortType}
        onChange={(value: any) => {
          onChangeType(value?.key);
          setType(value);
        }}
      />
      <FlightList
        list={mapList}
        selectFlight={selectFlight}
        type={type}
        listItemClick={(item: ListItem) => {
          listItemClick(item);
        }}
      />
    </div>
  );
};

export default FlightView;
