import { Map as MapboxMap, Popup } from "mapbox-gl";
import { RoadWorkEvent } from "../../types/backend";
import { Feature } from "geojson";
import { getRoadNameMap } from "../../utils/roadHashMap";

const roadMap: Map<string, Feature> = getRoadNameMap();

/**
 * Highlight roads with road works using a prebuilt road name map
 * @param map - Mapbox GL map instance
 * @param roadWorks - Array of road work events
 */
export const highlightRoadWorks = (
    map: MapboxMap,
    roadWorks: RoadWorkEvent[]
) => {
    const currentTime = new Date(); // Get the current time

    // Filter road works that are happening now
    const activeRoadWorks = roadWorks.filter((rw) => {
        const startTime = new Date(rw.start_date);
        const endTime = new Date(rw.end_date);
        return currentTime >= startTime && currentTime <= endTime;
    });

    // Extract road names from active road works
    const roadNamesToHighlight = new Set(
        activeRoadWorks.map((rw) => rw.road_name)
    );

    const matchingFeatures = Array.from(roadNamesToHighlight)
        .map((roadName) => roadMap.get(roadName))
        .filter((feature): feature is Feature => !!feature);

    const highlightGeoJSON: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: matchingFeatures,
    };

    if (map.getLayer("road-works-highlight")) {
        map.removeLayer("road-works-highlight");
    }
    if (map.getSource("road-works-highlight")) {
        map.removeSource("road-works-highlight");
    }

    map.addSource("road-works-highlight", {
        type: "geojson",
        data: highlightGeoJSON,
    });

    map.addLayer({
        id: "road-works-highlight",
        type: "line",
        source: "road-works-highlight",
        paint: {
            "line-color": "#FF5733",
            "line-width": 3,
        },
    });

    // Add click event listener for the highlighted roads
    map.on("click", "road-works-highlight", (e) => {
        const features = e.features;
        if (!features || features.length === 0) return;

        const feature = features[0];
        const roadName = feature.properties?.final_name;

        // Find the corresponding road work event
        const roadWork = activeRoadWorks.find(
            (rw) => rw.road_name.toUpperCase() === roadName.toUpperCase()
        );
        if (roadWork) {
            // Create a popup with road work information
            new Popup()
                .setLngLat(e.lngLat)
                .setHTML(
                    `<strong>Road Name:</strong> ${roadWork.road_name}<br/>
                     <strong>Start Date:</strong> ${roadWork.start_date}<br/>
                     <strong>End Date:</strong> ${roadWork.end_date}<br/>
                     <strong>Service Department:</strong> ${roadWork.svc_dept}<br/>
                     `
                )
                .addTo(map);
        }
    });

    // Change the cursor to a pointer when hovering over the roads
    map.on("mouseenter", "road-works-highlight", () => {
        map.getCanvas().style.cursor = "pointer";
    });

    // Reset the cursor when leaving the roads
    map.on("mouseleave", "road-works-highlight", () => {
        map.getCanvas().style.cursor = "";
    });
};
