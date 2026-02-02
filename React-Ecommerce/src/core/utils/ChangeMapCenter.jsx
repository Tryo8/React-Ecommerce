import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function ChangeMapCenter({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true }, 12);
    }
  }, [lat, lng, map]);

  return null;
}