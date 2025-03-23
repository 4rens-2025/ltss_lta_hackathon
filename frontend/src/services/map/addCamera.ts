import mapboxgl from "mapbox-gl";
import { TrafficImage } from "../../types/backend";

// Track the camera markers globally within this module
let currentCameraMarkers: mapboxgl.Marker[] = [];

const cameraIconUrl = "/cctv.png";

export function addTrafficCameras(map: mapboxgl.Map, cameras: TrafficImage[]) {
    // Remove all existing markers
    currentCameraMarkers.forEach((marker) => marker.remove());
    currentCameraMarkers = [];

    // Add new markers
    cameras.forEach((camera) => {
        const el = document.createElement("div");
        el.className = "camera-marker";
        el.style.backgroundImage = `url(${cameraIconUrl})`; // or incident.png
        el.style.width = "22px";
        el.style.height = "22px";
        el.style.backgroundSize = "100%";
        el.style.cursor = "pointer";

        const marker = new mapboxgl.Marker(el)
            .setLngLat([camera.longitude, camera.latitude])
            .setPopup(
                new mapboxgl.Popup().setHTML(
                    `<strong>Camera ${camera.camera_id}</strong><br/><img src="${camera.image_link}" width="200"/>`
                )
            )
            .addTo(map);

        currentCameraMarkers.push(marker);
    });
}
