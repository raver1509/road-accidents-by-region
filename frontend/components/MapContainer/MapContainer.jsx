import Map from '../Map/Map';
import styles from './styles.module.css';

const MapContainer = ({ onProvinceClick }) => {
  return (
    <div className={styles.mapContainer}>
      <Map onProvinceClick={onProvinceClick} />
    </div>
  );
};

export default MapContainer;
