import mapboxgl from "mapbox-gl";
import { TrafficIncident } from "../../types/backend";

// Track current markers to clean up before rendering new ones
let currentIncidentMarkers: mapboxgl.Marker[] = [];

// Path to your local icon in the public folder
const incidentIconUrl = "/accident.png"; // e.g., /public/icons/incident.png

export function addIncidentMarkers(
    map: mapboxgl.Map,
    incidents: TrafficIncident[]
) {
    // Remove existing markers
    currentIncidentMarkers.forEach((marker) => marker.remove());
    currentIncidentMarkers = [];

    // Add new markers
    incidents.forEach((incident) => {
        const el = document.createElement("div");
        el.style.backgroundImage = `url(${incidentIconUrl})`;
        el.style.width = "22px";
        el.style.height = "22px";
        el.style.backgroundSize = "100%";
        el.style.cursor = "pointer";

        const marker = new mapboxgl.Marker(el)
            .setLngLat([incident.longitude, incident.latitude])
            .setPopup(new mapboxgl.Popup().setText(incident.message))
            .addTo(map);

        currentIncidentMarkers.push(marker);
    });
}
