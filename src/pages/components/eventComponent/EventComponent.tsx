import { useMapEvent } from 'react-leaflet';

type Props = {
  addMarker: (value: any) => void;
};

export const EventComponent: React.FC<Props> = ({ addMarker }) => {
  useMapEvent('click', (e) => {
    const currentDate = new Date();
    addMarker({
      id: '',
      location: [e.latlng.lat, e.latlng.lng],
      date: currentDate.toISOString(),
    });
  });
  return null;
};
