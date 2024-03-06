import { LatLngExpression } from 'leaflet';

export interface MarkerInterface {
  id: string;
  location: LatLngExpression;
  data: Date;
}
