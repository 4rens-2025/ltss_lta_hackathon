import mapboxgl from "mapbox-gl";
import { TrafficIncident } from "../../types/backend";

const typeToIconMap: Record<string, string> = {
    Accident: "/accident.png",
    Roadwork: "/roadwork.png",
    "Vehicle breakdown": "/breakdown.png",
    Weather: "/weather.png",
    Obstacle: "/barrier.png",
    "Road Block": "/barrier.png",
    "Heavy Traffic": "/traffic-jam.png",
};

const defaultType = "Uncategorized";
const defaultIconUrl = "/barrier.png";

export const INCIDENT_TYPES = [
    "Accident",
    "Roadwork",
    "Vehicle breakdown",
    "Weather",
    "Obstacle",
    "Road Block",
    "Heavy Traffic",
    "Uncategorized",
];

// Map of incident type -> list of markers
const markersByType: Map<string, mapboxgl.Marker[]> = new Map();
const typeVisibility: Map<string, boolean> = new Map(
    INCIDENT_TYPES.map((type) => [type, false]) // Initialize all types as false
);
export function addIncidentMarkers(
    map: mapboxgl.Map,
    incidents: TrafficIncident[]
) {
    // Clear all previous markers
    markersByType.forEach((markers) => {
        markers.forEach((marker) => marker.remove());
    });
    markersByType.clear();

    // Add new markers grouped by type
    incidents.forEach((incident) => {
        const type = typeToIconMap[incident.type] ? incident.type : defaultType;
        const iconUrl = typeToIconMap[type] || defaultIconUrl;

        const el = document.createElement("div");
        el.style.backgroundImage = `url(${iconUrl})`;
        el.style.width = "26px";
        el.style.height = "26px";
        el.style.backgroundSize = "100%";
        el.style.cursor = "pointer";
        el.style.display = typeVisibility.get(type) ? "block" : "none";

        const marker = new mapboxgl.Marker(el)
            .setLngLat([incident.longitude, incident.latitude])
            .setPopup(new mapboxgl.Popup().setText(incident.message))
            .addTo(map);

        if (!markersByType.has(type)) {
            markersByType.set(type, []);
        }
        markersByType.get(type)!.push(marker);
    });
}

// Toggle visibility of a specific incident type
export function setIncidentTypeVisibility(type: string, visible: boolean) {
    typeVisibility.set(type, visible);

    const markers = markersByType.get(type);
    if (!markers) return;

    markers.forEach((marker) => {
        marker.getElement().style.display = visible ? "block" : "none";
    });
}
