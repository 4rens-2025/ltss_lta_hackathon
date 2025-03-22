import mapboxgl from "mapbox-gl";
import { TrafficIncident } from "../../types/backend";

export function addIncidentMarkers(
    map: mapboxgl.Map,
    incidents: TrafficIncident[]
) {
    incidents.forEach((incident) => {
        const el = document.createElement("div");
        el.className = "incident-marker";

        new mapboxgl.Marker(el)
            .setLngLat([incident.longitude, incident.latitude])
            .setPopup(new mapboxgl.Popup().setText(incident.message))
            .addTo(map);
    });
}
