import mapboxgl from "mapbox-gl";
import { TrafficImage } from "../../types/backend";

export function addTrafficCameras(map: mapboxgl.Map, cameras: TrafficImage[]) {
    cameras.forEach((camera) => {
        const el = document.createElement("div");
        el.className = "camera-marker";

        new mapboxgl.Marker(el)
            .setLngLat([camera.longitude, camera.latitude])
            .setPopup(
                new mapboxgl.Popup().setHTML(
                    `<strong>Camera ${camera.camera_id}</strong><br/><img src="${camera.image_link}" width="200"/>`
                )
            )
            .addTo(map);
    });
}
