import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

import { db } from '../../firebase-config';
import { EventComponent } from '../components/eventComponent/EventComponent';
import { MarkerInterface } from '../../helpers/types';

import './home.scss';
import 'leaflet/dist/leaflet.css';

export const Home = () => {
  const [markers, setMarkers] = useState<MarkerInterface[]>([]);

  const markersRef = collection(db, 'markers');

  useEffect(() => {
    let markersData: MarkerInterface[] = [];
    getDocs(markersRef).then((res) => {
      res.forEach((doc) => {
        markersData.push({ ...doc.data(), id: doc.id } as MarkerInterface);
      });
      setMarkers([...markersData]);
    });
  }, []);

  const addMarker = async (newMarker: any) => {
    try {
      const response = await addDoc(markersRef, newMarker);
      setMarkers((currentMarker) => [
        ...currentMarker,
        { ...newMarker, id: response.id },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMarker = async (id: string) => {
    try {
      await deleteDoc(doc(markersRef, id));
      setMarkers((currentMarker) =>
        currentMarker.filter((marker) => marker.id !== id),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updateMarker = async (id: string, lat: number, lng: number) => {
    try {
      const docRef = doc(db, 'markers', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const newData = { ...data, location: [lat, lng] };

        await updateDoc(docRef, newData);

        setMarkers((currentMarker) => {
          return currentMarker.map((marker) => {
            return marker.id === id
              ? { ...marker, location: [lat, lng] }
              : marker;
          });
        });
      } else {
        throw new Error('Error in marker`s updating ');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllMarkers = () => {
    markers.forEach((marker) => deleteDoc(doc(markersRef, marker.id)));
    setMarkers([]);
  };

  const customIcon = new Icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/F9BC00/marker.png',
    iconSize: [40, 40],
  });

  return (
    <div className="home">
      <button className="button" onClick={() => deleteAllMarkers()}>
        Delete all
      </button>
      <MapContainer
        center={[49.8397, 24.0297]}
        zoom={10}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {markers.map((marker) => (
            <Marker
              icon={customIcon}
              position={marker.location}
              key={Math.floor(Math.random() * 10000)}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  updateMarker(
                    marker.id,
                    e.target._latlng.lat,
                    e.target._latlng.lng,
                  );
                },
                click: () => deleteMarker(marker.id),
              }}
            ></Marker>
          ))}
          <EventComponent addMarker={addMarker} />
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};
