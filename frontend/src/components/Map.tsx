import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import { LandParcelView } from '@/api/types/land_parcel';
import { Zone } from '@/api/types/zone';
import { MemberView } from '@/api/types/user';
import { ProcessingUnitView } from '@/api/types/processing_unit';
import { Geolocation } from '../interface';
import 'leaflet-geosearch/dist/geosearch.css';

type Item = ProcessingUnitView | LandParcelView | Zone | MemberView | null;

interface LocationProps {
  callback: (arg: Geolocation) => void;
  item: Item;
  location: [number, number];
}

function LocationMarker({ callback, item, location }: LocationProps) {
  const { t } = useTranslation();
  const validLocation = location[0] && location[1] ? location : null;

  const [position, setPosition] = useState<[number, number] | null>(
    validLocation,
  );

  const map = useMapEvents({
    click(event) {
      map.locate();

      setPosition([event.latlng.lat, event.latlng.lng]);

      callback({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  useEffect(() => {
    if (validLocation) {
      setPosition(validLocation);

      map.setView(validLocation);
    }
  }, [location]);

  if (item && position && !('code' in item)) {
    return (
      <Marker position={position}>
        <Popup>
          <div className="py-3">
            <h3>
              {t('Name')}: {item.name}
            </h3>
            <h4 className="mt-1">
              {t('Type of Processing')}: {item.type_of_processing}
            </h4>
          </div>
        </Popup>
      </Marker>
    );
  }

  if (item && position && 'code' in item) {
    let itemName: string = '';

    if ('business_name' in item) itemName = item.business_name || '';
    if ('location' in item) itemName = item.location;

    return (
      <Marker position={position}>
        <Popup>
          <div className="py-3">
            <h3>
              {t('Name')}: {itemName}
            </h3>
            <h4 className="mt-1">
              {t('Code')}: {item.code}
            </h4>
          </div>
        </Popup>
      </Marker>
    );
  }

  return position === null ? null : (
    <Marker position={position}>
      <Popup>{t('New Location')}</Popup>
    </Marker>
  );
}

function MapSearch() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider,
      showMarker: false,
      autoClose: true,
      animateZoom: true,
    });

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, []);

  return null;
}

interface MapProps {
  location: [number, number];
  item: Item;
  callback: (arg: Geolocation) => void;
  className?: string;
}

function MapComponent({ location, item, callback, className }: MapProps) {
  useEffect(() => {
    // fixing map image load
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <MapContainer
      className={className ?? 'h-56'}
      center={[42.659304, 21.162675]}
      zoom={15}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapSearch />

      <LocationMarker callback={callback} item={item} location={location} />
    </MapContainer>
  );
}

export default MapComponent;
