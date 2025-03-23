import mapboxgl from "mapbox-gl";
import { TrafficImage } from "../../types/backend";

// Tracks all current camera markers
let currentCameraMarkers: mapboxgl.Marker[] = [];

// Toggle visibility state (default is visible)
let cameraVisible = false;

// Icon for camera marker
const cameraIconUrl = "/cctv.png";

/**
 * Add camera markers to the map
 */
export function addTrafficCameras(map: mapboxgl.Map, cameras: TrafficImage[]) {
    // Remove old markers
    currentCameraMarkers.forEach((marker) => marker.remove());
    currentCameraMarkers = [];

    // Add new markers
    cameras.forEach((camera) => {
        const el = document.createElement("div");
        el.className = "camera-marker";
        el.style.backgroundImage = `url(${cameraIconUrl})`;
        el.style.width = "22px";
        el.style.height = "22px";
        el.style.backgroundSize = "100%";
        el.style.cursor = "pointer";
        el.style.display = cameraVisible ? "block" : "none";

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

/**
 * Toggle visibility of all camera markers
 */
export function setCameraVisibility(visible: boolean) {
    cameraVisible = visible;

    currentCameraMarkers.forEach((marker) => {
        const el = marker.getElement();
        el.style.display = visible ? "block" : "none";
    });
}
