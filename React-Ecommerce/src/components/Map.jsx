import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState ,useEffect} from 'react';
import ChangeMapCenter from '../core/utils/ChangeMapCenter';
import { miAxios } from '../core/axios/axios';
import useAxiosPrivate from '../core/hooks/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';


function Map({ onSelectLocation, lat , lng }) {
  const [position, setPosition] = useState(null);
  const [geo, setGeo] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const axiosPrivate = useAxiosPrivate()
  const [markerPos, setMarkerPos] = useState(null);




  function MapClickHandler() {
    useMapEvents({
        click(e) {
          setPosition(e.latlng);
          if (onSelectLocation) {
          onSelectLocation(e.latlng);
          }
      },
    });
    return null;
  }
  useEffect(() => {
    const res = miAxios.get("/api/geo").then(res => {
      setGeo(res.data);
      
    })
  }, []);


  const getLocation = useQuery({
    queryKey: ["user-location"],
    queryFn: async () => {
      const res = await axiosPrivate.get("/user/get-location");
      return setUserLocation(res.data)
    },
  });

  useEffect(() => {
    if (!userLocation) {
      return;
    }
    console.log(userLocation)
  }, [geo, userLocation ]);

  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      setMarkerPos({
        lat: userLocation.latitude,
        lng: userLocation.longitude
      });
    } else if (geo?.latitude && geo?.longitude) {
      setMarkerPos({
        lat: geo.latitude,
        lng: geo.longitude
      });
    }
  }, [userLocation, geo]);

  return (
    <MapContainer zoomControl={true}  attributionControl={true} doubleClickZoom={true}  scrollWheelZoom={true}   center={[30.0444, 31.2357]} zoom={12} style={{ height: '300px', width: '100%', borderTopLeftRadius:'1rem', borderTopRightRadius:'1rem' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
        {geo && <ChangeMapCenter lat={userLocation?.latitude ? userLocation?.latitude :  geo?.latitude} lng={userLocation?.longitude ? userLocation?.longitude :  geo?.longitude} />}
        <MapClickHandler />
        {
          markerPos && <Marker position={[markerPos.lat, markerPos.lng] || position}>
          <Popup>Your Location</Popup></Marker>
        }
        {
          position && <Marker position={position}>
          <Popup>New Location</Popup></Marker>
        }
    </MapContainer>
  );
}

export default Map;
